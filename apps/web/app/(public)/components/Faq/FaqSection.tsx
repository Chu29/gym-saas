import { FaqAccordion } from './FaqAccordion';

export default function FaqSection() {
  return (
    <section id="faq" className="border-b border-gray-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Everything you need to know about switching to FITNEXA.
          </p>
        </div>

        {/* Accordion Component */}
        <div className="mt-12">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
