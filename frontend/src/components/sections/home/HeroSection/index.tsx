import AccentDot from "./AccentDot";
import HeroHeader from "./HeroHeader";
import HeroContent from "./HeroContent";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden  pt-32 sm:pt-36 min-h-screen lg:pt-40">
      <AccentDot className="left-8 bottom-28 h-4 w-4 lg:h-5 lg:w-5" />
      <AccentDot className="right-10 bottom-24 h-3 w-3 lg:h-4 lg:w-4" />

      <div className=" mx-auto flex w-full max-w-7xl flex-col px-4  sm:px-6 lg:px-8 lg:pb-10">
        <div className=" flex flex-col items-center">
          <HeroHeader />
          <HeroContent />
        </div>
      </div>
    </section>
  );
}
