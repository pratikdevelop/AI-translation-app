import Link from "next/link";
import { SITE } from "@/lib/site";

const links = [
  ["/pricing", "Pricing"], ["/about", "About"], ["/contact", "Contact"],
  ["/privacy", "Privacy"], ["/terms", "Terms"],
];

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
        <p>© {SITE.year} {SITE.name}</p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-blue-600 dark:hover:text-blue-400 transition">{label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}