import React from 'react';
import { Icons } from './icons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Icons.logo className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-lg font-headline">StreamVerse</span>
        </div>
      </div>
    </header>
  );
}
