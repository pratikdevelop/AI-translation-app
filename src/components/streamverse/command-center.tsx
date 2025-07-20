"use client";

import React, { type Dispatch, type SetStateAction, useEffect, useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RealtimeTranscript, AssemblyAI } from 'assemblyai';

interface CommandCenterProps {
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  setTranscript: Dispatch<SetStateAction<string>>;
  suggestions: string[];
}

export function CommandCenter({ isRecording, setIsRecording, setTranscript, suggestions }: CommandCenterProps) {
  const [currentUtterance, setCurrentUtterance] = useState('');
  const recorderRef = useRef<AssemblyAI.RealtimeTranscriber | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = async () => {
    if (recorderRef.current) {
      console.error("Recording is already in progress.");
      return;
    }

    try {
      const response = await fetch('/api/assemblyai');
      const data = await response.json();

      if (!data.token) {
        throw new Error('Failed to get AssemblyAI token');
      }

      const recorder = new AssemblyAI.RealtimeTranscriber({
        token: data.token,
        sampleRate: 16000,
      });

      recorder.on('open', () => {
        console.log('Connection opened');
      });

      recorder.on('transcript', (transcript: RealtimeTranscript) => {
        if (transcript.text) {
          if (transcript.message_type === 'PartialTranscript') {
            setCurrentUtterance(transcript.text);
          } else if (transcript.message_type === 'FinalTranscript') {
            setTranscript(prev => prev ? `${prev}\n\n- ${transcript.text}` : `- ${transcript.text}`);
            setCurrentUtterance('');
          }
        }
      });

      recorder.on('error', (error) => {
        console.error('Real-time transcription error:', error);
        stopRecording();
      });
      
      recorder.on('close', (code: number, reason: string) => {
        console.log('Connection closed:', code, reason);
        recorderRef.current = null;
        setIsRecording(false);
      });

      await recorder.connect();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      recorder.stream(source);
      
      recorderRef.current = recorder;
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      await recorderRef.current.close();
      recorderRef.current = null;
    }
    if(audioContextRef.current && audioContextRef.current.state !== 'closed') {
        await audioContextRef.current.close();
    }
    setIsRecording(false);
    setCurrentUtterance('');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
        if (isRecording) {
            stopRecording();
        }
    }
  }, []);

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
