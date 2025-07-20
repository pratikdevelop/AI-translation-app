"use client";

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { Separator } from '../ui/separator';

interface TranscriptDisplayProps {
  highlightedTranscript: string;
  summary: string;
  onGenerateSummary: () => void;
  isSummarizing: boolean;
  hasTranscript: boolean;
}

const HighlightedText = React.memo(({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="space-y-2 font-code whitespace-pre-wrap">
      {text.split('\n\n').map((paragraph, pIndex) => (
        <p key={pIndex}>
          {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={i} className="text-accent bg-accent/10 rounded-sm px-1 py-0.5">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      ))}
    </div>
  );
});

HighlightedText.displayName = 'HighlightedText';

export function TranscriptDisplay({ highlightedTranscript, summary, onGenerateSummary, isSummarizing, hasTranscript }: TranscriptDisplayProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [highlightedTranscript]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Live Transcript</CardTitle>
          <CardDescription>Real-time transcription with domain-specific term highlighting.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full rounded-md border p-4" ref={scrollAreaRef}>
            {hasTranscript ? (
              <HighlightedText text={highlightedTranscript} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <FileText className="h-10 w-10 mb-2" />
                <p>Transcript will appear here...</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button onClick={onGenerateSummary} disabled={isSummarizing || !hasTranscript}>
            {isSummarizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Summary
          </Button>
        </CardFooter>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Summary</CardTitle>
            <CardDescription>A concise overview of the conversation.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
