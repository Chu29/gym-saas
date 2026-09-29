import CtaBanner from './components/CtaBanner/CtaBanner';
import FaqSection from './components/Faq/FaqSection';
import FeaturesGrid from './components/Features/FeaturesGrid';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import IntegrationsGrid from './components/Integrations/IntegrationsGrid';
import LogoCloud from './components/LogoCloud/LogoCloud';
import Navbar from './components/Navbar/Navbar';
import OnboardingSteps from './components/Onboarding/OnboardingSteps';
import PortalShowcase from './components/Portals/PortalShowcase';
import PricingSection from './components/Pricing/PricingSection';
import TestimonialsSection from './components/Testimonials/TestimonialsSection';

export default function PublicHomePage() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900 selection:bg-green-100 selection:text-green-800">
      {/* Sticky Navigation Bar */}
      <Navbar />

      <main id="main-content" className="relative">
        {/* Hero Section with Dashboard Preview */}
        <Hero />

        {/* Social Proof Partners Logo Cloud */}
        <LogoCloud />

        {/* 4 Dedicated Portals Showcase */}
        <PortalShowcase />

        {/* Core Operations Features Grid */}
        <FeaturesGrid />

        {/* 4-Step Onboarding Process */}
        <OnboardingSteps />

        {/* Hardware & Software Ecosystem */}
        <IntegrationsGrid />

        {/* Transparent Pricing Plans */}
        <PricingSection />

        {/* Operator Testimonials */}
        <TestimonialsSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Call to Action Banner */}
        <CtaBanner />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
