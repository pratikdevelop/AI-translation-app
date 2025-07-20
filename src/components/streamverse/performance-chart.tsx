"use client";

import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface PerformanceChartProps {
  title: string;
  data: any[];
  dataKey: string;
  chartConfig: ChartConfig;
  domain: [number, number];
}

export function PerformanceChart({ title, data, dataKey, chartConfig, domain }: PerformanceChartProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="h-40 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[dataKey].color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[dataKey].color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
              <YAxis domain={domain} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area type="monotone" dataKey={dataKey} stroke={chartConfig[dataKey].color} fillOpacity={1} fill={`url(#color-${dataKey})`} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
