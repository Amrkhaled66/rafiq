import SolveHeader from "./SolveHeader";
import SolveVisual from "./SolveVisual";

export default function SolveSection() {
  return (
    <section id="solve" className="section">
      <div className="flex flex-col gap-6 md:gap-8 lg:gap-12">
        <SolveHeader />
        <SolveVisual />
      </div>
    </section>
  );
}
