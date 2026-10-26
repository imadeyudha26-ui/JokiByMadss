import { CTASection } from './components/CTASection';
import { FAQ } from './components/FAQ';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Navbar } from './components/Navbar';
import { PopularPackages } from './components/PopularPackages';
import { PricingSection } from './components/PricingSection';
import { PushRankSection } from './components/PushRankSection';
import { Testimonials } from './components/Testimonials';
import { TrustBar } from './components/TrustBar';
import { WhatsAppButton } from './components/WhatsAppButton';

export default function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <PricingSection />
        <PopularPackages />
        <PushRankSection />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
