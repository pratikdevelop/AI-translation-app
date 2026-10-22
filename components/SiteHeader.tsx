import Link from "next/link";
import { Languages } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButtons } from "./AuthButtons";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
            <Languages className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">{SITE.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Pricing</Link>
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">About</Link>
          <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}