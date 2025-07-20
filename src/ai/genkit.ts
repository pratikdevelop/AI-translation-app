import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {configureGenkit} from 'genkit';
import {googleCloud} from '@genkit-ai/google-cloud';

configureGenkit({
  plugins: [
    googleAI(),
    googleCloud({
      // Optional, but recommended for production.
      // projectId: 'your-gcp-project-id',
    }),
  ],
  // Log developer-level details to the console.
  logLevel: 'debug',
  // Perform OpenTelemetry instrumentation and enable trace collection.
  enableTracing: true,
});
