import CTASection from "@/src/components/sections/home/CTASection";
import Footer from "@/src/components/layout/Footer";
import HeroSection from "@/src/components/sections/home/HeroSection";
import ProblemSection from "@/src/components/sections/home/ProblemSection";
import SolveSection from "@/src/components/sections/home/SolveSection";
// import PricingHeader from "@/src/components/sections/home/PricingSection/PricingHeader";
import PricingSection from "@/src/components/sections/home/PricingSection";
export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <ProblemSection />
      <SolveSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
