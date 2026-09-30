import { IntegrationCard, type IntegrationItem } from './IntegrationCard';

const INTEGRATIONS: IntegrationItem[] = [
  {
    name: 'Stripe & Terminal',
    category: 'Automated credit card processing',
    status: 'Active',
  },
  {
    name: 'Apple & Google Wallet',
    category: 'Contactless NFC passes',
    status: 'Active',
  },
  {
    name: 'Mobile Money Rails',
    category: 'M-Pesa, Orange, Wave integration',
    status: 'Active',
  },
  {
    name: 'InBody & Withings',
    category: 'Biometric scale & body comp sync',
    status: 'Active',
  },
  {
    name: 'QuickBooks & Xero',
    category: 'Automated ledger reconciliation',
    status: 'Active',
  },
  {
    name: 'WhatsApp & Twilio',
    category: 'Automated alerts and triggers',
    status: 'Active',
  },
  {
    name: 'Dormakaba & Kisi',
    category: 'Turnstile relay controllers',
    status: 'Active',
  },
  {
    name: 'Zapier & Webhooks',
    category: 'REST APIs & inbound relays',
    status: 'Active',
  },
];

export default function IntegrationsGrid() {
  return (
    <section id="integrations" className="border-b border-gray-100 bg-gray-50/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            Connects with Your Existing Hardware & Stack
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Plug FITNEXA directly into your access turnstiles, accounting software, and payment
            gateways with native webhooks.
          </p>
        </div>

        {/* 2x4 Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTEGRATIONS.map((item) => (
            <IntegrationCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
