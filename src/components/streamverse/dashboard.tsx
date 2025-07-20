"use client";

import React, { type Dispatch, type SetStateAction, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PerformanceChart } from './performance-chart';

interface DashboardProps {
  domain: string;
  setDomain: Dispatch<SetStateAction<string>>;
}

const latencyData = [
  { time: '1s', latency: 280 },
  { time: '2s', latency: 295 },
  { time: '3s', latency: 270 },
  { time: '4s', latency: 310 },
  { time: '5s', latency: 260 },
  { time: '6s', latency: 285 },
];

const accuracyData = [
  { time: '1s', accuracy: 96.5 },
  { time: '2s', accuracy: 97.1 },
  { time: '3s', accuracy: 96.8 },
  { time: '4s', accuracy: 97.5 },
  { time: '5s', accuracy: 97.2 },
  { time: '6s', accuracy: 97.8 },
];

export function Dashboard({ domain, setDomain }: DashboardProps) {
  const chartConfigLatency = useMemo(() => ({
    latency: {
      label: 'Latency (ms)',
      color: 'hsl(var(--accent))',
    },
  }), []);

  const chartConfigAccuracy = useMemo(() => ({
    accuracy: {
      label: 'Accuracy (%)',
      color: 'hsl(var(--primary))',
    },
  }), []);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="domain-select">Domain Specialization</Label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger id="domain-select" className="w-full">
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="technical support">Technical Support</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PerformanceChart
            title="Real-Time Latency"
            data={latencyData}
            dataKey="latency"
            chartConfig={chartConfigLatency}
            domain={[200, 400]}
          />
          <PerformanceChart
            title="Transcription Accuracy"
            data={accuracyData}
            dataKey="accuracy"
            chartConfig={chartConfigAccuracy}
            domain={[95, 100]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
