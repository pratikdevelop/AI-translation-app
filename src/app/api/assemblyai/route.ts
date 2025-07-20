// src/app/api/assemblyai/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {AssemblyAI} from 'assemblyai';

export async function GET(req: NextRequest) {
  if (!process.env.ASSEMBLYAI_API_KEY) {
    return NextResponse.json({ error: 'AssemblyAI API key not configured' }, { status: 500 });
  }

  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY,
  });

  try {
    const token = await client.realtime.createTemporaryToken({expires_in: 3600});
    return NextResponse.json({token});
  } catch (error) {
    console.error('Error getting AssemblyAI token:', error);
    return NextResponse.json({error: 'Failed to get AssemblyAI token'}, {status: 500});
  }
}
