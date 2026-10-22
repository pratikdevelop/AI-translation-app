import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, H2, P, UL } from "@/components/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <PageShell title={`About ${SITE.name}`} intro="Fast, clean translation for everyday text and Word documents.">
      <P>{SITE.name} translates what you type or upload, works out the source language by itself, and can fix grammar and spelling before it translates, so mistakes in the original do not carry over into the result.</P>
      <H2>What you can do</H2>
      <UL>
        <li>Translate text between 12 languages, including Hindi, Japanese, Arabic, Korean and Mandarin Chinese.</li>
        <li>Detect the language of your text automatically.</li>
        <li>Fix grammar first, or choose the same language as your text to only correct it.</li>
        <li>Translate Word (.docx) files while keeping fonts, tables and images in place.</li>
        <li>Keep a history of recent translations when you are signed in.</li>
      </UL>
      <H2>How it works</H2>
      <P>Translations are produced by AI language models. They are quick and usually good, but they can make mistakes, so check anything important. See our <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms</Link> and <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link> for how your text is handled.</P>
      <H2>Get in touch</H2>
      <P>Questions or feedback? Visit the <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link>.</P>
    </PageShell>
  );
}