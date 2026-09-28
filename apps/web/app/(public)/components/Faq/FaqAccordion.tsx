'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/ui/accordion';

const FAQS = [
  {
    id: 'item-1',
    question: 'How does FITNEXA connect with our physical turnstiles and gates?',
    answer:
      'FITNEXA connects directly to optical turnstiles, speed gates, and magnetic lock doors using our lightweight IoT relay controller or pre-configured webhooks for Dormakaba, Gunnebo, and Kisi. Verification decisions are cached at the local controller node to guarantee sub-250ms unlock speeds even during internet latency or network drops.',
  },
  {
    id: 'item-2',
    question:
      'Can we migrate member data from our current software without losing payment methods?',
    answer:
      'Yes. Our concierge migration specialists provide zero-downtime onboarding from Mindbody, Wodify, GymMaster, and Zen Planner. Through secure PCI-to-PCI token transfers with Stripe and regional payment processors, customer payment profiles are mapped without requiring members to manually re-enter credit cards.',
  },
  {
    id: 'item-3',
    question: 'Does FITNEXA support both International Credit Cards and Mobile Money?',
    answer:
      'Yes. FITNEXA features unified multi-rail checkout. We handle standard international cards (Visa, Mastercard, Amex, Apple Pay) alongside regional African and Latin American mobile wallets (M-Pesa, Orange Money, Wave) with automated monthly recurring dunning and reconciliation.',
  },
  {
    id: 'item-4',
    question: 'How does role-based access work for trainers vs managers?',
    answer:
      'FITNEXA provides distinct, role-scoped portals. Facility Executives and Managers access full revenue data, billing runs, and turnstile controls. Coaches and Personal Trainers receive dedicated programming tools to design workouts, record client biometric data, and verify attendance without viewing facility-wide financial ledgers.',
  },
  {
    id: 'item-5',
    question: 'Is there a setup fee or long-term contract requirement?',
    answer:
      'No. All plans come with zero setup fees, transparent monthly or annual pricing, and no long-term contractual lock-in. You can upgrade, downgrade, or cancel your account at any time directly from the manager dashboard.',
  },
  {
    id: 'item-6',
    question: 'How do members access their digital QR pass?',
    answer:
      'Upon sign-up, members receive an instant digital pass via SMS/WhatsApp or the FITNEXA Member App. Passes can be added directly to Apple Wallet or Google Wallet with dynamic rolling NFC tokens that prevent screenshot sharing and pass borrowing.',
  },
];

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {FAQS.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="rounded-xl border border-gray-200/90 bg-white px-5 sm:px-6 shadow-2xs data-[state=open]:border-gray-300"
        >
          <AccordionTrigger className="text-sm sm:text-base font-semibold text-gray-950 py-4 hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-5">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
