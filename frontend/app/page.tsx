import CTASection from "@/src/components/sections/home/CTASection";
import HeroSection from "@/src/components/sections/home/HeroSection";
import ProblemSection from "@/src/components/sections/home/ProblemSection";
import SolveSection from "@/src/components/sections/home/SolveSection";

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <ProblemSection />
      <SolveSection />
      <CTASection />
    </main>
  );
}
