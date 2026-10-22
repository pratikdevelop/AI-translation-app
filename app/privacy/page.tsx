import type { Metadata } from "next";
import { PageShell, H2, P, UL } from "@/components/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <PageShell title="Privacy Policy" updated={SITE.updated} intro={`How ${SITE.name}, operated by ${SITE.company}, handles your data.`}>
      <H2>What we collect</H2>
      <UL>
        <li><strong>Account details</strong> when you sign up (such as your email address and name), handled by our sign-in provider.</li>
        <li><strong>Text you translate</strong>, which is sent to an AI model to produce the translation.</li>
        <li><strong>Documents</strong> you upload: the file is opened in your browser and only the text of its paragraphs is sent for translation. We do not store the file.</li>
        <li><strong>Translation history</strong>, only if you are signed in: your last 50 translations (source text, result and languages).</li>
        <li><strong>Usage counters</strong>, such as characters and documents used today, tied to your account or, if you are not signed in, your IP address, to enforce limits and prevent abuse.</li>
        <li><strong>Technical logs</strong> kept by our hosting provider (for example request times and errors).</li>
      </UL>
      <H2>How long we keep it</H2>
      <UL>
        <li>Translation history is deleted automatically after 90 days, and you can clear it yourself at any time with the Clear button.</li>
        <li>Usage counters expire within a few days.</li>
        <li>Account data stays until you ask us to delete your account.</li>
      </UL>
      <H2>Who processes your data</H2>
      <P>We use trusted service providers to run the service: an AI model provider (NVIDIA) that receives your text to translate it, an authentication provider (Clerk), a database provider (Upstash) and a hosting provider. They process data on our behalf under their own terms and privacy policies.</P>
      <H2>What we do not do</H2>
      <UL>
        <li>We do not sell your data.</li>
        <li>We do not show advertising.</li>
        <li>We do not use your text to build our own models.</li>
      </UL>
      <H2>Cookies and local storage</H2>
      <P>We use cookies that keep you signed in and a setting in your browser that remembers your light or dark theme. We do not use advertising cookies.</P>
      <H2>Your choices</H2>
      <P>You can clear your history in the app, and you can ask us to access, correct or delete your data by emailing <a className="text-blue-600 dark:text-blue-400 hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>. Do not submit confidential or sensitive information you are not comfortable sending to a third-party AI provider.</P>
      <H2>Children</H2>
      <P>The service is not directed to children under 13, and we do not knowingly collect their data.</P>
      <H2>Changes</H2>
      <P>If we change this policy we will update the date above and, for significant changes, tell you in the app.</P>
      <H2>Contact</H2>
      <P>{SITE.company}: <a className="text-blue-600 dark:text-blue-400 hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></P>
    </PageShell>
  );
}