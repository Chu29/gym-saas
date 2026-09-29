'use client';

import { Button } from '@repo/ui/components/ui/button';
import { ArrowRight, Dumbbell, Menu, X } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#portals' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl text-gray-950 tracking-tight"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16A34A] text-white shadow-sm">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span>FITNEXA</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-950 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors"
          >
            Sign In
          </Link>
          <Button
            asChild
            className="bg-[#16A34A] hover:bg-[#15803d] text-white shadow-sm font-medium h-9 px-4 gap-1.5"
          >
            <Link href="#pricing">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-950 focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-200 bg-white px-4 pt-2 pb-6 md:hidden shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#16A34A]"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-gray-700 hover:text-gray-950"
              >
                Sign In
              </Link>
              <Button
                asChild
                className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-medium"
              >
                <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                  Start Free Trial
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
