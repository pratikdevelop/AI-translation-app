import type { Metadata } from "next";
import { PageShell, H2, P, UL } from "@/components/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Terms() {
  return (
    <PageShell title="Terms of Service" updated={SITE.updated} intro={`By using ${SITE.name} you agree to these terms.`}>
      <H2>The service</H2>
      <P>{SITE.name} provides AI-powered translation and grammar correction of text and Word documents. {SITE.company} operates the service.</P>
      <H2>Translations may contain errors</H2>
      <P>Machine translation is imperfect. Results are provided for general information. Do not rely on them alone for legal, medical, financial, safety-critical or other high-stakes purposes; have a qualified person review anything important.</P>
      <H2>Your account and usage limits</H2>
      <UL>
        <li>Keep your sign-in details secure; you are responsible for activity on your account.</li>
        <li>Each plan has usage limits (see the Pricing page). We may change limits, and we may restrict use that looks automated or abusive.</li>
        <li>Paid plans, when available, will have their own billing terms shown before you buy.</li>
      </UL>
      <H2>Acceptable use</H2>
      <P>You agree not to:</P>
      <UL>
        <li>use the service for anything unlawful, or to create or spread harmful, hateful or infringing content;</li>
        <li>submit content you do not have the right to use;</li>
        <li>try to break, overload or bypass the limits of the service, or scrape it with bots;</li>
        <li>resell or provide access to the service without our written permission.</li>
      </UL>
      <H2>Your content</H2>
      <P>You keep ownership of the text and documents you submit and of the translations you receive. You give us permission to process your content only to provide the service, as described in our Privacy Policy.</P>
      <H2>Availability and changes</H2>
      <P>The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We may change, suspend or discontinue features at any time, and we do not guarantee uninterrupted or error-free operation.</P>
      <H2>Limitation of liability</H2>
      <P>To the extent permitted by law, {SITE.company} is not liable for indirect or consequential losses, or for losses caused by reliance on a translation. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim, or zero if you used a free plan.</P>
      <H2>Ending use</H2>
      <P>You can stop using the service at any time. We may suspend or end access if you break these terms.</P>
      <H2>Governing law</H2>
      <P>These terms are governed by the laws of {SITE.jurisdiction}.</P>
      <H2>Changes to these terms</H2>
      <P>We may update these terms. Continuing to use the service after a change means you accept the new terms.</P>
      <H2>Contact</H2>
      <P><a className="text-blue-600 dark:text-blue-400 hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></P>
    </PageShell>
  );
}