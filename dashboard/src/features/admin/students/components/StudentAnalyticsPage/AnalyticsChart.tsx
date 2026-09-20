import { useEffect, useRef } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

export default function AnalyticsChart({
  config,
  ariaLabel,
}: {
  config: ChartConfiguration;
  ariaLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const chart = new Chart(canvasRef.current, config);

    return () => {
      chart.destroy();
    };
  }, [config]);

  return (
    <div className="h-80 w-full">
      <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />
    </div>
  );
}
