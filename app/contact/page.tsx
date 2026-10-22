import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageShell, H2, P } from "@/components/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <PageShell title="Contact Us" intro="Questions, feedback, bug reports, refunds or data requests: we want to hear from you.">
      <div className="space-y-3">
        <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
          <Mail className="w-5 h-5 text-blue-600" /> {SITE.email}
        </a>
        <a href={`tel:${SITE.phoneRaw}`} className="flex items-center gap-3 text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
          <Phone className="w-5 h-5 text-blue-600" /> {SITE.phone}
        </a>
        <p className="flex items-start gap-3 text-gray-800 dark:text-gray-100">
          <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" /> <span>{SITE.company}<br />{SITE.address}</span>
        </p>
      </div>
      <H2>What we offer</H2>
      <P>{SITE.name} is an online software service that translates text and Word (.docx) documents between 12 languages using AI, with automatic language detection and grammar correction. Free and paid monthly plans are available. See the Pricing page for details.</P>
      <H2>Reporting a problem</H2>
      <P>Please include the language pair, what you expected and what happened. Do not send passwords or sensitive documents by email. To delete your translation history or account data, email us from the address on your account.</P>
    </PageShell>
  );
}