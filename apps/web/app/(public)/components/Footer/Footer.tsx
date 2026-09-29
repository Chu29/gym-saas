import { Dumbbell, Globe, Lock, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'PRODUCT',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Access Control', href: '#portals' },
      { label: 'Billing & Invoicing', href: '#portals' },
      { label: 'Trainer Suite', href: '#portals' },
      { label: 'Member App', href: '#portals' },
      { label: "What's New in v3.0", href: '#' },
    ],
  },
  {
    title: 'SOLUTIONS',
    links: [
      { label: 'Commercial Gyms', href: '#' },
      { label: 'CrossFit Boxes', href: '#' },
      { label: 'Boutique Studios', href: '#' },
      { label: 'Multi-Tenant Franchises', href: '#' },
      { label: 'Periodized Trainers', href: '#' },
    ],
  },
  {
    title: 'RESOURCES',
    links: [
      { label: 'API Documentation', href: '#' },
      { label: 'Hardware Setup Guides', href: '#' },
      { label: 'Migration Guide', href: '#' },
      { label: 'Gym ROI Calculator', href: '#' },
      { label: 'Help Center', href: '#' },
    ],
  },
  {
    title: 'COMPANY & LEGAL',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Security Architecture', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Preferences', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white pt-14 pb-12 text-sm text-gray-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12 border-b border-gray-100">
          {/* Brand & System Status Column (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl text-gray-950 tracking-tight"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16A34A] text-white shadow-xs">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span>FITNEXA</span>
            </Link>

            <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
              High-performance operating system for athletic facilities, franchise fleets, and
              boutique studio collectives.
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50/80 px-3 py-1 text-xs font-medium text-[#16A34A]">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>All Systems Operational • 99.99% SLA</span>
            </div>

            <p className="text-[11px] text-gray-400">SOC2 Type II & GDPR Compliant</p>
          </div>

          {/* Navigation Links Columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-gray-950 uppercase">
                {column.title}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-gray-950 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright & Security Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 FITNEXA Inc. All rights reserved. SOC2 Type II Certified & GDPR Compliant.</p>

          <div className="flex items-center gap-4 text-gray-400">
            <button
              type="button"
              className="hover:text-gray-700 cursor-pointer"
              aria-label="Security Status"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hover:text-gray-700 cursor-pointer"
              aria-label="Global CDN"
            >
              <Globe className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hover:text-gray-700 cursor-pointer"
              aria-label="Encrypted"
            >
              <Lock className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hover:text-gray-700 cursor-pointer"
              aria-label="Contact Support"
            >
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
