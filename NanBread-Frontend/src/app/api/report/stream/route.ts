export const dynamic = 'force-dynamic';
export const runtime = 'edge';  
import { NextRequest } from 'next/server';

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:8080';

/**
 * Proxy for POST /api/report/stream → Flask POST /report/stream
 *
 * Running the fetch on the Next.js server (Node.js) means the browser
 * never makes a cross-origin request, so CORS is never an issue.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();

  let flaskRes: Response;
  try {
    flaskRes = await fetch(`${FLASK_URL}/report/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      // remove the duplex line — edge runtime doesn't need it
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Cannot reach Flask API at ${FLASK_URL}. Is it running?` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!flaskRes.ok) {
    return new Response(
      JSON.stringify({ error: `Flask returned ${flaskRes.status}` }),
      { status: flaskRes.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Stream the SSE body straight back to the browser
  return new Response(flaskRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'Connection': 'keep-alive',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
