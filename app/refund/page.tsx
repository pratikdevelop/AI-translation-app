import type { Metadata } from "next";
import { PageShell, H2, P, UL } from "@/components/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Cancellation & Refund Policy" };

// DRAFT: decide your real refund rules, then edit the wording below.
export default function Refund() {
  return (
    <PageShell title="Cancellation & Refund Policy" updated={SITE.updated} intro={`How cancellations and refunds work for ${SITE.name} paid plans.`}>
      <H2>Cancelling</H2>
      <P>You can cancel your subscription at any time from the Pricing page while signed in. After you cancel, you keep Pro until the end of the period you already paid for, and you will not be charged again.</P>
      <H2>Refunds</H2>
      <UL>
        <li>{SITE.name} is a monthly subscription for digital services. Subscription payments are generally non-refundable once a billing period has started. Prices are in Indian rupees (INR).</li>
        <li>If you were charged twice, or charged after cancelling, email us and we will refund the extra charge.</li>
        <li>If a technical problem on our side stopped you from using the service, contact us and we will review a refund.</li>
      </UL>
      <H2>How refunds are paid</H2>
      <P>Approved refunds are returned to the original payment method (card, UPI or bank account). After we approve a refund, the amount is credited within {SITE.refundDays}, depending on your bank.</P>
      <H2>Contact</H2>
      <P>Email <a className="text-blue-600 dark:text-blue-400 hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> with the email address on your account.</P>
    </PageShell>
  );
}