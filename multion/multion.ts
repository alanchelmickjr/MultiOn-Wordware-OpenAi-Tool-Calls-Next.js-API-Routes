import { NextRequest, NextResponse } from 'next/server';
import { MultiOnClient, MultiOnError } from 'multion';

interface SearchParams {
  cmd: string;
  url: string;
  sshot: boolean;
  proxy: boolean;
}

export async function GET(request: NextRequest) {
  // console.log('Request URL:', request.url);
  try {
    const { searchParams } = new URL(request.url);
    const cmd = searchParams.get('cmd') || 'Tell me something signifcant and interesting about todays date, in a fun way.';
    const url = (searchParams.get('url') || 'https://google.com');
    const sshot = searchParams.get('sshot') !== null ? true : false;
    const proxy = searchParams.get('proxy') != null ? true : false;

   // console.log('CMD:', cmd, 'URL:', url);

    try {
      new URL(url);
    } catch (error) {
      console.log('Error: Invalid URL parameter');
      return NextResponse.json({ error: 'Invalid URL query parameter' }, { status: 400 });
    }

    const multion = new MultiOnClient({ apiKey: process.env.MULTION_API_KEY || '' });

    const browseResponse = await multion.browse({
      cmd,
      url,
      useProxy: proxy,
      mode: "fast",
      includeScreenshot: sshot
    });

    // const screenshot = browseResponse.screenshot


    const sessionId = browseResponse.sessionId;
    console.log('Browse Response:', browseResponse);
    // IF NOT DONE then session can continue TODO:
    await multion.sessions.close(sessionId);
    return NextResponse.json(browseResponse);

  } catch (err) {
    console.error('Error caught in GET:', err);

    if (err instanceof MultiOnError) {
      console.error('MultiOnError:', {
        statusCode: err.statusCode,
        message: err.message,
        body: err.body,
      });
      return NextResponse.json({
        error: 'Failed to fetch data from MultiOn',
        details: err.message,
      }, { status: err.statusCode });
    } else {
      console.error('Unexpected error:', err);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
