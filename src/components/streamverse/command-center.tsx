"use client";

import React, { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/badge';

const samplePhrases = [
  "Schedule a meeting with the marketing team for tomorrow at 2 PM.",
  "What are the legal implications of the new data privacy law?",
  "Initiate the patient onboarding sequence.",
  "Run diagnostics on the primary server.",
  "What's the current status of ticket number 742?",
  "Add a new lead John Doe from Acme Corp to the CRM.",
  "Summarize the key points of the last customer support call.",
  "Book a follow-up appointment for this patient in two weeks.",
  "Generate a sales report for the last quarter.",
];

interface CommandCenterProps {
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  setTranscript: Dispatch<SetStateAction<string>>;
  suggestions: string[];
}

export function CommandCenter({ isRecording, setIsRecording, setTranscript, suggestions }: CommandCenterProps) {
  const [currentUtterance, setCurrentUtterance] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        setCurrentUtterance(randomPhrase);
        setTranscript(prev => prev ? `${prev}\n\n- ${randomPhrase}` : `- ${randomPhrase}`);
      }, 3000);
    }
    return () => {
      clearInterval(interval);
      setCurrentUtterance('');
    };
  }, [isRecording, setTranscript]);

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Command Center</CardTitle>
        <Button onClick={toggleRecording} size="icon" variant={isRecording ? 'destructive' : 'default'}>
          {isRecording ? <Square className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 flex-1">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <div className="flex items-center gap-2">
            <Badge variant={isRecording ? "default" : "secondary"}>{isRecording ? 'Listening...' : 'Idle'}</Badge>
            <div className={`h-2 w-2 rounded-full ${isRecording ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}></div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Current Utterance</h3>
          <p className="font-code text-lg min-h-[28px]">
            {isRecording ? currentUtterance : 'Press the mic to start.'}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Suggested Commands</h3>
          {suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge key={index} variant="outline" className="font-code cursor-pointer hover:bg-accent/50">
                  {suggestion}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No suggestions available. Start talking to see suggestions.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
