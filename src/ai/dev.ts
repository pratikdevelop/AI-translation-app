import { config } from 'dotenv';
config();

import '@/ai/flows/generate-command-suggestions.ts';
import '@/ai/flows/domain-term-recognition.ts';
import '@/ai/flows/summarize-transcript.ts';