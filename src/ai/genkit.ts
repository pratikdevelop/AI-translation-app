import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  // Log developer-level details to the console.
  // Perform OpenTelemetry instrumentation and enable trace collection.
});
