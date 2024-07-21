import { openapiToFunctions } from "@/lib/openapi-conversion";
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers";
import { Tables } from "@/supabase/types";
import { ChatSettings } from "@/types";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

interface ExtractedData {
  cmd: string;
  url: string;
}

async function extractCommandAndUrl(prompt: string, openai: OpenAI): Promise<ExtractedData> {
  const extractionPrompt = `Extract the command and URL from the following prompt: "${prompt}". If the URL does not start with "http://" or "https://", prepend "https://" to it. Format the response as JSON with "cmd" and "url". if there is no url detected the url is "https://google.com"`;

  const extractionResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: extractionPrompt }],
  });

  const extractionMessage = extractionResponse.choices[0].message.content || "Extraction Message Missing";
  const extractedData: ExtractedData = JSON.parse(extractionMessage);

  return extractedData;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const json = await request.json();
    const { chatSettings, messages, selectedTools } = json as {
      chatSettings: ChatSettings;
      messages: any[];
      selectedTools: Tables<"tools">[];
    };

    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    const profile = await getServerProfile();
    checkApiKey(profile.openai_api_key, "OpenAI");

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id || "", // Provide a default value
    });

    // Extract cmd and url from the prompt using the AI extraction function
    const { cmd, url } = await extractCommandAndUrl(prompt, openai);

    // Perform schema conversion in parallel
    const conversionPromises = selectedTools.map(async (selectedTool) => {
      try {
        const convertedSchema = await openapiToFunctions(
          JSON.parse(selectedTool.schema as string)
        );
        const tools = convertedSchema.functions || [];
        const routeMap = convertedSchema.routes.reduce(
          (map: Record<string, string>, route) => {
            map[route.path.replace(/{(\w+)}/g, ":$1")] = route.operationId;
            return map;
          },
          {}
        );

        return {
          tools,
          schemaDetail: {
            title: convertedSchema.info.title,
            description: convertedSchema.info.description,
            url: convertedSchema.info.server,
            headers: selectedTool.custom_headers,
            routeMap,
            requestInBody: convertedSchema.routes[0].requestInBody,
          }
        };
      } catch (error: unknown) {
        console.error("Error converting schema", error);
        return null;
      }
    });

    const conversionResults = await Promise.all(conversionPromises);
    const allTools = conversionResults.flatMap(result => result?.tools || []);
    const schemaDetails = conversionResults.map(result => result?.schemaDetail).filter(Boolean) as any[];

    const firstResponse = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages,
      tools: allTools.length > 0 ? allTools : undefined,
    });

    const message = firstResponse.choices[0].message;
    messages.push(message);
    const toolCalls = message.tool_calls || [];

    if (toolCalls.length === 0) {
      return new Response(JSON.stringify({ content: message.content }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Process tool calls in parallel
    const toolCallPromises = toolCalls.map(async (toolCall) => {
      try {
        const functionCall = toolCall.function;
        const functionName = functionCall.name;
        const parsedArgs = JSON.parse(functionCall.arguments.trim());

        console.log(`Parsed arguments for function ${functionName}:`, parsedArgs);

        const schemaDetail = schemaDetails.find((detail) =>
          detail && Object.values(detail.routeMap).includes(functionName)
        );

        if (!schemaDetail) {
          throw new Error(`Function ${functionName} not found in any schema`);
        }

        const pathTemplate = Object.keys(schemaDetail.routeMap).find(
          (key) => schemaDetail.routeMap[key] === functionName
        );

        if (!pathTemplate) {
          throw new Error(`Path for function ${functionName} not found`);
        }

        const path = pathTemplate.replace(/:(\w+)/g, (_, paramName) => {
          const value = parsedArgs.parameters[paramName];
          if (!value) {
            throw new Error(
              `Parameter ${paramName} not found for function ${functionName}`
            );
          }
          return encodeURIComponent(value);
        });

        const baseUrl = schemaDetail.url.endsWith('/')
          ? schemaDetail.url.slice(0, -1)
          : schemaDetail.url;
        const fullUrl = `${baseUrl}${path}`;

        console.log(`Full URL for function ${functionName}:`, fullUrl);

        const isRequestInBody = schemaDetail.requestInBody;
        let data: any = {};

        if (isRequestInBody) {
          let headers = {
            "Content-Type": "application/json",
          };

          const customHeaders = schemaDetail.headers;
          if (customHeaders && typeof customHeaders === "string") {
            headers = {
              ...headers,
              ...JSON.parse(customHeaders),
            };
          }

          console.log(`Headers for POST request to ${fullUrl}:`, headers);

          const bodyContent = parsedArgs.requestBody || parsedArgs;

          const response = await fetch(fullUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(bodyContent),
          });

          data = response.ok ? await response.json() : { error: response.statusText };
        } else {
          const queryParams = new URLSearchParams({ cmd, url }).toString();
          const fullUrlWithQuery = fullUrl + (queryParams ? "?" + queryParams : "");

          const customHeaders = schemaDetail.headers;
          const headers = customHeaders && typeof customHeaders === "string"
            ? JSON.parse(customHeaders)
            : {};

          console.log(`Headers for GET request to ${fullUrlWithQuery}:`, headers);

          const response = await fetch(fullUrlWithQuery, {
            method: "GET",
            headers,
          });

          data = response.ok ? await response.json() : { error: response.statusText };
        }

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(data),
        });
      } catch (error: unknown) {
        console.error(`Error processing tool call ${toolCall.id}`, error);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: toolCall.function.name,
          content: JSON.stringify({ error: (error as Error).message }),
        });
      }
    });

    await Promise.all(toolCallPromises);

    const secondResponse = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages,
      stream: true,
    });

    const stream = OpenAIStream(secondResponse);

    return new StreamingTextResponse(stream);
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    const errorCode = (error as any).status || 500;
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
