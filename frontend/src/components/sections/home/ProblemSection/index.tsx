import ProblemHeader from "./ProblemHeader";
import ProblemVisual from "./ProblemVisual";

export default function ProblemSection() {
  return (
    <section id="problem" className="h-screen ">
      {/* <div className="absolute left-1/2 top-8 h-52 w-52 -translate-x-1/2 rounded-full bg-[rgba(208,5,7,0.08)] blur-3xl" />
      <div className="absolute -left-16 top-36 h-44 w-44 rounded-full bg-[rgba(244,184,194,0.22)] blur-3xl" />
      <div className="absolute -right-16 bottom-16 h-56 w-56 rounded-full bg-[rgba(255,228,230,0.8)] blur-3xl" /> */}

      <div className="mx-auto flex flex-col gap-4 lg:gap-6  container">
        <ProblemHeader />
        <ProblemVisual />
      </div>
    </section>
  );
}
// bg-[linear-gradient(180deg,#fffdfd_0%,#fff6f6_56%,#ffffff_100%)]
