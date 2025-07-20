"use client";

import { useState, useTransition, useEffect } from 'react';
import { domainTermRecognition } from '@/ai/flows/domain-term-recognition';
import { generateCommandSuggestions } from '@/ai/flows/generate-command-suggestions';
import { summarizeTranscript } from '@/ai/flows/summarize-transcript';
import { Header } from './header';
import { CommandCenter } from './command-center';
import { TranscriptDisplay } from './transcript-display';
import { Dashboard } from './dashboard';

export function MainLayout() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [highlightedTranscript, setHighlightedTranscript] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [domain, setDomain] = useState('general');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (transcript) {
      startTransition(async () => {
        try {
            const [recognitionResult, suggestionsResult] = await Promise.all([
                domainTermRecognition({ transcript, domain }),
                generateCommandSuggestions({ conversationContext: transcript })
            ]);
            
            if (recognitionResult.highlightedTranscript) {
                setHighlightedTranscript(recognitionResult.highlightedTranscript);
            }
            if (suggestionsResult.suggestions) {
                setSuggestions(suggestionsResult.suggestions);
            }
        } catch (error) {
            console.error("AI flow error:", error);
            // Fallback to non-highlighted transcript if AI fails
            setHighlightedTranscript(transcript);
        }
      });
    } else {
      setHighlightedTranscript('');
      setSuggestions([]);
    }
  }, [transcript, domain]);

  const handleGenerateSummary = () => {
    if (transcript) {
      startTransition(async () => {
        const result = await summarizeTranscript({ transcript });
        setSummary(result.summary);
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <CommandCenter
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              setTranscript={setTranscript}
              suggestions={suggestions}
            />
            <TranscriptDisplay
              highlightedTranscript={highlightedTranscript || transcript}
              summary={summary}
              onGenerateSummary={handleGenerateSummary}
              isSummarizing={isPending}
              hasTranscript={!!transcript}
            />
          </div>
          <div className="lg:col-span-1 sticky top-20">
            <Dashboard domain={domain} setDomain={setDomain} />
          </div>
        </div>
      </main>
    </div>
  );
}
