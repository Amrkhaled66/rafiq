import { useEffect, useRef } from "react";
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Icon } from "@iconify/react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import PageHeader from "@/features/admin/shared/components/PageHeader";
import AdminPageSkeleton from "@/features/admin/shared/components/skeletons/AdminPageSkeleton";
import StatCard from "@/features/admin/shared/components/StatCard";
import { useStudentStudyTimeAnalyticsQuery } from "@/features/admin/students/queries/studentQueries";
import type { StudentStudyTimeDailyPoint } from "@/features/admin/students/services/studentService";
import Button from "@/shared/components/Button";
import { formatDateArShort, formatDateLocal } from "@/shared/utils/dates";

const DAY_MS = 86_400_000;
const PRESETS = [
  { days: 7, label: "7 أيام" },
  { days: 30, label: "30 يوم" },
  { days: 90, label: "90 يوم" },
] as const;

Chart.register(
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

function getCairoToday() {
  return formatDateLocal(
    new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })),
  );
}

function addDays(date: string, days: number) {
  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + days);
  return formatDateLocal(nextDate);
}

function getPresetRange(days: number) {
  const to = getCairoToday();
  return {
    from: addDays(to, -(days - 1)),
    to,
  };
}

function countDays(from: string, to: string) {
  const fromTime = new Date(`${from}T00:00:00`).getTime();
  const toTime = new Date(`${to}T00:00:00`).getTime();

  if (Number.isNaN(fromTime) || Number.isNaN(toTime) || toTime < fromTime) {
    return 0;
  }

  return Math.floor((toTime - fromTime) / DAY_MS) + 1;
}

function fillDailyPoints(
  points: StudentStudyTimeDailyPoint[],
  from: string,
  to: string,
) {
  const pointByDate = new Map(points.map((point) => [point.date, point]));
  const totalDays = countDays(from, to);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(from, index);
    return (
      pointByDate.get(date) ?? {
        date,
        totalStudySeconds: 0,
        totalStudyMinutes: 0,
        sessionsCount: 0,
      }
    );
  });
}

function formatStudyMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} دقيقة`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ساعة`;
  }

  return `${hours} ساعة و${remainingMinutes} دقيقة`;
}

function StudyTimeChart({ data }: { data: StudentStudyTimeDailyPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const chart = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((point) =>
          new Intl.DateTimeFormat("ar-EG", {
            day: "numeric",
            month: "short",
          }).format(new Date(point.date)),
        ),
        datasets: [
          {
            label: "وقت المذاكرة",
            data: data.map((point) => point.totalStudyMinutes),
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.12)",
            borderWidth: 3,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#2563eb",
            pointBorderWidth: 3,
            pointHoverBackgroundColor: "#2563eb",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 3,
            pointHoverRadius: 7,
            pointRadius: 5,
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            rtl: true,
            textDirection: "rtl",
            displayColors: false,
            callbacks: {
              title(items) {
                const index = items[0]?.dataIndex ?? 0;
                return formatDateArShort(data[index]?.date ?? "");
              },
              label(item) {
                return formatStudyMinutes(Number(item.raw ?? 0));
              },
              afterLabel(item) {
                const point = data[item.dataIndex];
                return `عدد الجلسات: ${point?.sessionsCount ?? 0}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#64748b",
              maxRotation: 0,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10,
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            grace: "8%",
            grid: {
              color: "rgba(148, 163, 184, 0.24)",
            },
            border: {
              display: false,
            },
            ticks: {
              color: "#64748b",
              precision: 0,
              font: {
                size: 11,
              },
            },
            title: {
              display: true,
              text: "الوقت بالدقائق",
              color: "#64748b",
              font: {
                size: 12,
                weight: "normal",
              },
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <div className="h-80 w-full">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="إجمالي وقت المذاكرة اليومي"
      />
    </div>
  );
}

function RangeControls({
  from,
  to,
  hasValidRange,
  onChange,
}: {
  from: string;
  to: string;
  hasValidRange: boolean;
  onChange: (nextRange: { from: string; to: string }) => void;
}) {
  return (
    <section className="dashboard-card space-y-5 text-right">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-foreground text-xl font-bold">الفترة الزمنية</h2>
          <p className="text-subTitle mt-1 text-sm">
            اختر فترة لا تزيد عن 90 يومًا لعرض وقت المذاكرة اليومي.
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-3">
          <label className="space-y-1 text-sm">
            <span className="text-subTitle block">من</span>
            <input
              type="date"
              value={from}
              onChange={(event) => onChange({ from: event.target.value, to })}
              className="border-border focus:border-brand-primary rounded-lg border bg-white px-3 py-2 outline-none"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-subTitle block">إلى</span>
            <input
              type="date"
              value={to}
              onChange={(event) => onChange({ from, to: event.target.value })}
              className="border-border focus:border-brand-primary rounded-lg border bg-white px-3 py-2 outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.days}
                variant="outline"
                onClick={() => onChange(getPresetRange(preset.days))}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {!hasValidRange && (
        <p className="text-sm text-red-500">
          يجب أن تكون الفترة صحيحة ولا تزيد عن 90 يومًا.
        </p>
      )}
    </section>
  );
}

export default function StudentAnalyticsPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const studentId = Number(id);
  const defaultRange = getPresetRange(7);
  const from = searchParams.get("from") ?? defaultRange.from;
  const to = searchParams.get("to") ?? defaultRange.to;
  const totalDays = countDays(from, to);
  const hasValidRange = totalDays > 0 && totalDays <= 90;
  const analyticsQuery = useStudentStudyTimeAnalyticsQuery(
    studentId,
    {
      from,
      to,
    },
    hasValidRange,
  );

  function updateRange(nextRange: { from: string; to: string }) {
    setSearchParams(nextRange, { replace: true });
  }

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تحليلات الأداء</h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  if (hasValidRange && analyticsQuery.isLoading && !analyticsQuery.data) {
    return (
      <AdminPageSkeleton header="profile" statsCount={4} contentSections={1} />
    );
  }

  if (!hasValidRange) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="تحليلات الأداء"
          subtitle="متابعة وقت المذاكرة حسب الفترة المحددة."
          action={
            <Link to="..">
              <Button variant="outline" className="bg-white">
                العودة لتفاصيل الطالب
              </Button>
            </Link>
          }
        />

        <RangeControls
          from={from}
          to={to}
          hasValidRange={hasValidRange}
          onChange={updateRange}
        />
      </div>
    );
  }

  if (analyticsQuery.isError || !analyticsQuery.data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="تحليلات الأداء"
          subtitle="متابعة وقت المذاكرة حسب الفترة المحددة."
          action={
            <Link to="..">
              <Button variant="outline" className="bg-white">
                العودة لتفاصيل الطالب
              </Button>
            </Link>
          }
        />

        <RangeControls
          from={from}
          to={to}
          hasValidRange={hasValidRange}
          onChange={updateRange}
        />

        <section className="dashboard-card text-right">
          <p className="text-sm text-red-500">
            تعذر تحميل بيانات تحليلات الأداء.
          </p>
        </section>
      </div>
    );
  }

  const filledDailyData = fillDailyPoints(analyticsQuery.data.daily, from, to);
  const isEmpty = filledDailyData.every(
    (point) => point.totalStudyMinutes === 0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="تحليلات الأداء"
        subtitle={`إجمالي وقت مذاكرة الطالب ${analyticsQuery.data.student.fullName} خلال الفترة المحددة.`}
        action={
          <Link to="..">
            <Button variant="outline" className="bg-white">
              العودة لتفاصيل الطالب
            </Button>
          </Link>
        }
      />

      <RangeControls
        from={from}
        to={to}
        hasValidRange={hasValidRange}
        onChange={updateRange}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي وقت المذاكرة"
          value={formatStudyMinutes(analyticsQuery.data.summary.totalStudyMinutes)}
          icon={<Icon icon="solar:clock-circle-linear" />}
          color="#2563eb"
        />
        <StatCard
          title="متوسط الوقت اليومي"
          value={formatStudyMinutes(
            analyticsQuery.data.summary.averageDailyMinutes,
          )}
          icon={<Icon icon="solar:chart-2-linear" />}
          color="#16a34a"
        />
        <StatCard
          title="أيام النشاط"
          value={analyticsQuery.data.summary.activeDays}
          icon={<Icon icon="solar:calendar-mark-linear" />}
          color="#7c3aed"
        />
        <StatCard
          title="عدد الجلسات"
          value={filledDailyData.reduce(
            (total, point) => total + point.sessionsCount,
            0,
          )}
          icon={<Icon icon="solar:play-circle-linear" />}
          color="#ea580c"
        />
      </div>

      <section className="dashboard-card space-y-5 text-right">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-xl font-bold">
              وقت المذاكرة اليومي
            </h2>
            <p className="text-subTitle mt-1 text-sm">
              يعرض الرسم إجمالي دقائق المذاكرة المسجلة من جلسات المهام.
            </p>
          </div>
          {analyticsQuery.isFetching && (
            <span className="text-brand-primary text-sm">جاري التحديث...</span>
          )}
        </div>

        {isEmpty ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
            <Icon
              icon="solar:chart-square-linear"
              className="text-subTitle size-12"
            />
            <p className="text-subTitle text-sm">
              لا توجد جلسات مذاكرة مسجلة خلال هذه الفترة.
            </p>
          </div>
        ) : (
          <StudyTimeChart data={filledDailyData} />
        )}
      </section>
    </div>
  );
}
