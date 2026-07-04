import CTASection from "@/src/components/sections/home/CTASection";
import Footer from "@/src/components/layout/Footer";
import HeroSection from "@/src/components/sections/home/HeroSection";
import ProblemSection from "@/src/components/sections/home/ProblemSection";
import SolveSection from "@/src/components/sections/home/SolveSection";
// import PricingHeader from "@/src/components/sections/home/PricingSection/PricingHeader";
import PricingSection from "@/src/components/sections/home/PricingSection";
import SeatsSection from "@/src/components/sections/home/SeatsSection";
import SeatsStatusBarSection from "@/src/components/sections/home/SeatsStatusBarSection";
import FloatingSeatBadge from "@/src/components/sections/home/FloatingSeatBadge";
export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <SeatsStatusBarSection/>
      <ProblemSection />
      <SolveSection />
      {/* <SeatsSection /> */}
      <PricingSection />
      <CTASection />
      <Footer />
      <FloatingSeatBadge/>
    </main>
  );
}
