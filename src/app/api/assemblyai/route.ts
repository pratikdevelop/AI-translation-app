// src/app/api/assemblyai/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {AssemblyAI} from 'assemblyai';

export async function GET(req: NextRequest) {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'AssemblyAI API key not configured on the server.' }, { status: 500 });
  }

  const client = new AssemblyAI({
    apiKey: apiKey,
  });

  try {
    const token = await client.realtime.createTemporaryToken({expires_in: 3600});
    return NextResponse.json({token});
  } catch (error: any) {
    console.error('Error getting AssemblyAI token:', error);
    const errorMessage = error.message || 'Failed to get AssemblyAI token';
    return NextResponse.json({error: `AssemblyAI API Error: ${errorMessage}`}, {status: 500});
  }
}
