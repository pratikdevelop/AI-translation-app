'use server';

/**
 * @fileOverview Implements domain-specific term recognition using RAG.
 *
 * - domainTermRecognition - A function that recognizes domain-specific terms in a transcript.
 * - DomainTermRecognitionInput - The input type for the domainTermRecognition function.
 * - DomainTermRecognitionOutput - The return type for the domainTermRecognition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DomainTermRecognitionInputSchema = z.object({
  transcript: z.string().describe('The real-time transcript of the voice data.'),
  domain: z.string().describe('The specific domain (e.g., legal, medical, technical support).'),
});
export type DomainTermRecognitionInput = z.infer<typeof DomainTermRecognitionInputSchema>;

const DomainTermRecognitionOutputSchema = z.object({
  highlightedTranscript: z.string().describe('The transcript with domain-specific terms highlighted.'),
});
export type DomainTermRecognitionOutput = z.infer<typeof DomainTermRecognitionOutputSchema>;

export async function domainTermRecognition(input: DomainTermRecognitionInput): Promise<DomainTermRecognitionOutput> {
  return domainTermRecognitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'domainTermRecognitionPrompt',
  input: {schema: DomainTermRecognitionInputSchema},
  output: {schema: DomainTermRecognitionOutputSchema},
  prompt: `You are an expert in identifying domain-specific terminology in real-time transcripts.

  Based on the provided transcript and domain, highlight the terms that are specific and relevant to the given domain.
  Return the transcript with the domain-specific terms highlighted using markdown's bold syntax.

  Domain: {{{domain}}}
  Transcript: {{{transcript}}}

  Highlighted Transcript:`, // Removed erroneous backticks
});

const domainTermRecognitionFlow = ai.defineFlow(
  {
    name: 'domainTermRecognitionFlow',
    inputSchema: DomainTermRecognitionInputSchema,
    outputSchema: DomainTermRecognitionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {highlightedTranscript: output!.highlightedTranscript!};
  }
);
