'use server';

/**
 * @fileOverview A flow to generate command suggestions based on the current conversation context.
 *
 * - generateCommandSuggestions - A function that generates command suggestions.
 * - GenerateCommandSuggestionsInput - The input type for the generateCommandSuggestions function.
 * - GenerateCommandSuggestionsOutput - The return type for the generateCommandSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommandSuggestionsInputSchema = z.object({
  conversationContext: z
    .string()
    .describe('The current conversation context to generate command suggestions for.'),
});
export type GenerateCommandSuggestionsInput = z.infer<typeof GenerateCommandSuggestionsInputSchema>;

const GenerateCommandSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested voice commands based on the context.'),
});
export type GenerateCommandSuggestionsOutput = z.infer<typeof GenerateCommandSuggestionsOutputSchema>;

export async function generateCommandSuggestions(
  input: GenerateCommandSuggestionsInput
): Promise<GenerateCommandSuggestionsOutput> {
  return generateCommandSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommandSuggestionsPrompt',
  input: {schema: GenerateCommandSuggestionsInputSchema},
  output: {schema: GenerateCommandSuggestionsOutputSchema},
  prompt: `You are an AI assistant that suggests possible voice commands based on the current conversation context.

  Current context: {{{conversationContext}}}

  Suggest a list of voice commands that a user might want to use next. Return the suggestions as a JSON array of strings.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateCommandSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateCommandSuggestionsFlow',
    inputSchema: GenerateCommandSuggestionsInputSchema,
    outputSchema: GenerateCommandSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
