import { NextRequest, NextResponse } from 'next/server';
import { MultiOnClient } from 'multion';
import { v4 as uuidv4 } from 'uuid';

interface Session {
  sessionId: string;
  data: any; // or a more specific type if you know what kind of data is stored
  url: string;
  sshot: boolean;
  proxy: boolean;
  fields: string[];
}

let sessions: { [key: string]: Session } = {}; // Initialize the sessions object with an empty object

const multion = new MultiOnClient({ apiKey: env.MULTION_API_KEY }); // Replace with your API key

const handleRequest = async (request: NextRequest) => {
  const sessionId = request.headers.get('x-session-id')?.[0] ?? '';
  let session;

  if (!sessionId) {
    // Create a new session
    const newSessionId = uuidv4();
    sessions[newSessionId] = { sessionId: newSessionId, data: null };
    session = sessions[newSessionId];
  } else {
    // Retrieve the existing session
    session = sessions[sessionId];
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
  }

  try {
    if (request.method === 'POST') {
      // Create a new session or update an existing one
      const { cmd, fields } = await request.json();
      if (cmd) {
        const createResponse = await multion.sessions.create({
          url: url,
          useProxy: true,
        });
        session.sessionId = createResponse.sessionId;
      }

      if (fields) {
        const retrieveResponse = await multion.retrieve({
          sessionId: session.sessionId,
          cmd: cmd,
          fields: fields,
        });
        session.data = retrieveResponse;
      }

      return NextResponse.json({ sessionId: session.sessionId }, { status: 201 });
    } else if (request.method === 'GET') {
      // Retrieve data from the session
      if (!session.data) {
        return NextResponse.json({ error: 'No data found in session' }, { status: 404 });
      }

      return NextResponse.json(session.data);
    } else {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error retrieving data' }, { status: 500 });
  }
};

// No need to export
