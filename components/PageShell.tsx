import type { ReactNode } from "react";

export function PageShell({ title, intro, updated, children }: { title: string; intro?: string; updated?: string; children: ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {intro && <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{intro}</p>}
      {updated && <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Last updated: {updated}</p>}
      <div className="mt-8 space-y-4">{children}</div>
    </div>
  );
}
export const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="pt-4 text-xl font-semibold">{children}</h2>
);
export const P = ({ children }: { children: ReactNode }) => (
  <p className="leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
);
export const UL = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc pl-6 space-y-1.5 leading-relaxed text-gray-700 dark:text-gray-300">{children}</ul>
);