# MultiOn & Wordware Tool Integration for Next.js & OpenAI

Welcome to the **Universal AI Playground** - the ultimate platform for harnessing the power of artificial intelligence to tackle real-world challenges. This innovative tool empowers users to create interoperable chains of intelligent agents and specialized tools, unlocking unprecedented capabilities.

## Tech Stack

- **Vercel**
- **Next.js** (using the new /app scheme with Typescript routes)

## Tool Call Examples

### Wordware Integration

**Tool call examples to use with ERAC to call API endpoints that answer questions like Wordware**


#### /multion/ Tool Call for Browse

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "Web Surfing Tool",
    "description": "This tool allows you to surf the internet and retrieve data based on a specific command and URL. You can use it to extract information from web pages by specifying what you want to find and the URL of the page.",
    "version": "v1.0.0"
  },
  "servers": [
    {
      "url": "https://myriadai.online/api/chat/tools/multion"
    }
  ],
  "paths": {
    "/": {
      "get": {
        "description": "Execute a command on a specific URL to retrieve information",
        "operationId": "SurfWeb",
        "parameters": [
          {
            "name": "cmd",
            "in": "query",
            "description": "The command to execute, describing what information to retrieve from the URL. For example: 'cmd: Find the top comment of the top post on Hackernews.' add 'cmd:' to the beginning if it does not exist.",
            "required": true,
            "schema": {
              "type": "string"
            },
            "example": "summarize"
          },
          {
            "name": "url",
            "in": "query",
            "description": "The URL of the web page to execute the command on. example: 'url: https://www.myriadai.online ' add the 'url:' to the beginning and 'https://' if they are missing.",
            "required": true,
            "schema": {
              "type": "string"
            },
            "example": "https://www.albanyumc.org"
          },
          {
            "name": "sshot",
            "in": "query",
            "description": "A boolean flag to determine if a screenshot should be taken. Defaults to false if not provided.",
            "required": false,
            "schema": {
              "type": "boolean"
            },
            "example": false
          },
          {
            "name": "proxy",
            "in": "query",
            "description": "A boolean flag to determine if a proxy should be used. Defaults to false if not provided.",
            "required": false,
            "schema": {
              "type": "boolean"
            },
            "example": false
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response with the retrieved information",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "string",
                      "description": "The information retrieved from the web page based on the command."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request, likely due to missing or invalid parameters"
          },
          "500": {
            "description": "Internal server error"
          }
        }
      }
    }
  }
}
```

## Live Demo

You can use the **LIVE Free version** here: [Universal AI Playground](https://myriadai.online). Note that the free version is limited, but a **PRO version** is coming soon.

## Tool Configurations and Deployment

- Tool configurations and code to deploy MultiOn Browse and Scrape
- All 4 Wordware Templates Demo

## Introducing the Universal AI Playground

The Universal AI Playground provides a flexible, modular environment where you can mix and match AI components, experiment with new configurations, and watch as your ideas come to life. Whether you're a seasoned developer, a domain expert, or a curious tinkerer, this playground puts the future of AI in your hands. Unlock new possibilities and revolutionize the way you approach problem-solving today.

## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Open a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for checking out the **Universal AI Playground**! We hope you enjoy exploring and creating with it. If you have any questions or need further assistance, feel free to open an issue on GitHub. Happy innovating!

Introducing the Universal AI Playground - the ultimate platform for harnessing the power of artificial intelligence to tackle real-world challenges. This innovative tool empowers users to create interoperable chains of intelligent agents and specialized tools, unlocking unprecedented capabilities. Imagine seamlessly integrating natural language processing, computer vision, robotic control, and predictive analytics to automate complex workflows or devise novel solutions. The Universal AI Playground provides a flexible, modular environment where you can mix and match AI components, experiment with new configurations, and watch as your ideas come to life. Whether you're a seasoned developer, a domain expert, or a curious tinkerer, this playground puts the future of AI in your hands. Unlock new possibilities and revolutionize the way you approach problem-solving today.

<img src="banner.png" alt="Hackathon">


