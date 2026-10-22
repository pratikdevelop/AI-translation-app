import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { H2, P } from "@/components/PageShell";
import { UpgradeButton } from "@/components/UpgradeButton";

export const metadata: Metadata = { title: "Pricing" };

const free = [
  "Up to 1,000 characters per translation",
  "3,000 characters per day",
  "1 Word document per day (about 2,000 words)",
  "Language detection and grammar fixing",
  "Translation history for signed-in users (90 days)",
];
const pro = [
  "Up to 5,000 characters per translation",
  "300,000 characters per day",
  "50 Word documents per day (about 50,000 words)",
  "Everything in Free",
  "Priority access as we add features",
];

function Card({ name, blurb, items, children, highlight }: { name: string; blurb: string; items: string[]; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`flex flex-col rounded-2xl border p-6 bg-white dark:bg-gray-900 ${highlight ? "border-blue-500 shadow-lg shadow-blue-500/10" : "border-gray-200 dark:border-gray-800"}`}>
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{blurb}</p>
      <ul className="mt-5 space-y-3 flex-1">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Check className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" /> {t}
          </li>
        ))}
      </ul>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Start free. Upgrade when you need more.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card name="Free" blurb="₹0 per month. For occasional translations." items={free}>
          <Link href="/" className="block text-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition">Start translating</Link>
        </Card>
        <Card name="Pro" blurb={process.env.NEXT_PUBLIC_PRO_PRICE_LABEL ? `${process.env.NEXT_PUBLIC_PRO_PRICE_LABEL} per month` : "For heavy users and teams."} items={pro} highlight>
          <UpgradeButton />
        </Card>
      </div>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">All prices are in Indian rupees (INR). Payments are processed securely by Razorpay.</p>
      <div className="mt-12 max-w-3xl mx-auto space-y-4">
        <H2>Common questions</H2>
        <P><strong>What counts as a character?</strong> Every letter, space and punctuation mark in the text you submit. Documents count the text inside your paragraphs.</P>
        <P><strong>Do limits reset?</strong> Daily limits reset each day (UTC).</P>
        <P><strong>Is my text stored?</strong> Only translation history for signed-in users, for 90 days, and you can clear it any time. Details are in the <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.</P>
        <P><strong>How do I cancel?</strong> Sign in, open this page and choose Cancel subscription. You keep Pro until the end of the period you paid for. See the <Link href="/refund" className="text-blue-600 dark:text-blue-400 hover:underline">Cancellation &amp; Refund Policy</Link>.</P>
        <P><strong>Can limits change?</strong> Yes. The numbers above are current and may change as the service grows.</P>
      </div>
    </div>
  );
}