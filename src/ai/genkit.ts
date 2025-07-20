import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {googleCloud} from '@genkit-ai/google-cloud';

configureGenkit({
  plugins: [
    googleAI(),
    googleCloud, // Pass the plugin object directly
  ],
  // Log developer-level details to the console.
  logLevel: 'debug',
  // Perform OpenTelemetry instrumentation and enable trace collection.
  enableTracing: true,
});

export const ai = genkit();
