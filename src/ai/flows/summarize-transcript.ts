// Summarize the transcript from the real-time transcription.

'use server';

/**
 * @fileOverview Summarizes the key points from a real-time transcript.
 *
 * - summarizeTranscript - A function that summarizes the transcript.
 * - SummarizeTranscriptInput - The input type for the summarizeTranscript function.
 * - SummarizeTranscriptOutput - The return type for the summarizeTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTranscriptInputSchema = z.object({
  transcript: z.string().describe('The full transcript to summarize.'),
});
export type SummarizeTranscriptInput = z.infer<
  typeof SummarizeTranscriptInputSchema
>;

const SummarizeTranscriptOutputSchema = z.object({
  summary: z.string().describe('A summary of the transcript.'),
});

export type SummarizeTranscriptOutput = z.infer<
  typeof SummarizeTranscriptOutputSchema
>;

export async function summarizeTranscript(
  input: SummarizeTranscriptInput
): Promise<SummarizeTranscriptOutput> {
  return summarizeTranscriptFlow(input);
}

const summarizeTranscriptPrompt = ai.definePrompt({
  name: 'summarizeTranscriptPrompt',
  input: {schema: SummarizeTranscriptInputSchema},
  output: {schema: SummarizeTranscriptOutputSchema},
  prompt: `Summarize the following transcript.  Focus on the key points and topics discussed.  The summary should be concise and easy to understand.

Transcript:
{{{transcript}}}`,
});

const summarizeTranscriptFlow = ai.defineFlow(
  {
    name: 'summarizeTranscriptFlow',
    inputSchema: SummarizeTranscriptInputSchema,
    outputSchema: SummarizeTranscriptOutputSchema,
  },
  async input => {
    const {output} = await summarizeTranscriptPrompt(input);
    return output!;
  }
);
