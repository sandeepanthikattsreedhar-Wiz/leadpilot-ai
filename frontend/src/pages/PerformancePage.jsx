import { useEffect, useState } from "react";
import {
  Trophy,
  CheckCircle2,
  Clock3,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Activity,
  BarChart3,
} from "lucide-react";

export default function PerformancePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/performance-data`
      );

      const result = await res.json();

      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  const overallScore =
    data.length > 0
      ? Math.round(
          data.reduce(
            (sum, item) =>
              sum + calculateScore(item),
            0
          ) / data.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8 space-y-8">

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 shadow-2xl text-white overflow-hidden relative">

        <div className="absolute right-0 top-0 text-[180px] opacity-10 font-bold">
          AI
        </div>

        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-4">
            <Trophy size={34} />
            <h1 className="text-4xl font-bold">
              Performance Intelligence
            </h1>
          </div>

          <p className="text-white/80 max-w-2xl">
            AI-powered delivery analytics,
            efficiency monitoring,
            execution health tracking,
            and workforce performance insights.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">

            <TopCard
              title="Engineers"
              value={data.length}
            />

            <TopCard
              title="Avg Efficiency"
              value={`${overallScore}%`}
            />

            <TopCard
              title="AI Monitoring"
              value="Enabled"
            />

            <TopCard
              title="Delivery Health"
              value={
                overallScore >= 75
                  ? "Healthy"
                  : overallScore >= 50
                  ? "Moderate"
                  : "Critical"
              }
            />

          </div>

        </div>

      </div>

      {/* ENGINEERS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {data.map((item, index) => {

          const score =
            calculateScore(item);

          const total =
            item.completed +
            item.yet_to_start +
            item.progress +
            item.qa +
            item.uat;

          const status =
            score >= 80
              ? "Excellent"
              : score >= 60
              ? "Good"
              : score >= 40
              ? "Average"
              : "Critical";

          return (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all"
            >

              {/* HEADER */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">

                <div className="flex justify-between items-center">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {item.name}
                    </h2>

                    <p className="text-white/70 text-sm">
                      Implementation Engineer
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      score >= 80
                        ? "bg-green-500"
                        : score >= 60
                        ? "bg-blue-500"
                        : score >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {status}
                  </div>

                </div>

              </div>

              {/* BODY */}
              <div className="p-6">

                {/* SCORE */}
                <div className="flex items-center justify-center mb-6">

                  <div className="relative w-36 h-36">

                    <svg
                      className="w-36 h-36 transform -rotate-90"
                    >
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />

                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke={
                          score >= 80
                            ? "#22c55e"
                            : score >= 60
                            ? "#3b82f6"
                            : score >= 40
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={377}
                        strokeDashoffset={
                          377 -
                          (377 * score) / 100
                        }
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">

                      <h2 className="text-4xl font-bold">
                        {score}%
                      </h2>

                      <p className="text-xs text-gray-500">
                        AI Score
                      </p>

                    </div>

                  </div>

                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-4">

                  <MetricCard
                    icon={
                      <CheckCircle2 size={18} />
                    }
                    label="Completed"
                    value={item.completed}
                    color="green"
                  />

                  <MetricCard
                    icon={<Clock3 size={18} />}
                    label="Yet to Start"
                    value={
                      item.yet_to_start
                    }
                    color="yellow"
                  />

                  <MetricCard
                    icon={
                      <Loader2 size={18} />
                    }
                    label="In Progress"
                    value={item.progress}
                    color="blue"
                  />

                  <MetricCard
                    icon={
                      <ShieldCheck size={18} />
                    }
                    label="QA/UAT"
                    value={
                      item.qa + item.uat
                    }
                    color="purple"
                  />

                </div>

                {/* TASK FLOW */}
                <div className="mt-8">

                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">
                      Delivery Flow
                    </span>

                    <span>
                      {total} Tasks
                    </span>
                  </div>

                  <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">

                    <div
                      style={{
                        width: `${
                          (item.completed /
                            total) *
                          100
                        }%`,
                      }}
                      className="bg-green-500"
                    ></div>

                    <div
                      style={{
                        width: `${
                          (item.progress /
                            total) *
                          100
                        }%`,
                      }}
                      className="bg-blue-500"
                    ></div>

                    <div
                      style={{
                        width: `${
                          ((item.qa +
                            item.uat) /
                            total) *
                          100
                        }%`,
                      }}
                      className="bg-purple-500"
                    ></div>

                    <div
                      style={{
                        width: `${
                          (item.yet_to_start /
                            total) *
                          100
                        }%`,
                      }}
                      className="bg-yellow-400"
                    ></div>

                  </div>

                </div>

                {/* AI INSIGHT */}
                <div className="mt-8 bg-slate-50 rounded-2xl p-4 border">

                  <div className="flex items-center gap-2 mb-2">
                    <Activity
                      size={18}
                      className="text-indigo-600"
                    />

                    <h3 className="font-semibold">
                      AI Insight
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 leading-7">

                    {score >= 80 &&
                      "Excellent delivery consistency with strong closure rate."}

                    {score >= 60 &&
                      score < 80 &&
                      "Good performance with minor optimization opportunities."}

                    {score >= 40 &&
                      score < 60 &&
                      "Execution speed needs improvement for better delivery health."}

                    {score < 40 &&
                      "Critical attention required due to low task completion trend."}

                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

/* ---------------- SCORE LOGIC ---------------- */

function calculateScore(item) {

  const total =
    item.completed +
    item.yet_to_start +
    item.progress +
    item.qa +
    item.uat;

  if (total === 0) return 0;

  const weighted =
    item.completed * 100 +
    item.progress * 65 +
    (item.qa + item.uat) * 80 +
    item.yet_to_start * 20;

  return Math.round(
    weighted / total
  );
}

/* ---------------- COMPONENTS ---------------- */

function TopCard({
  title,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
      <p className="text-white/70 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-1">
        {value}
      </h2>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}) {

  const colors = {
    green:
      "bg-green-50 text-green-700 border-green-100",
    yellow:
      "bg-yellow-50 text-yellow-700 border-yellow-100",
    blue:
      "bg-blue-50 text-blue-700 border-blue-100",
    purple:
      "bg-purple-50 text-purple-700 border-purple-100",
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${colors[color]}`}
    >

      <div className="flex items-center gap-2 mb-2">
        {icon}

        <p className="text-sm font-medium">
          {label}
        </p>
      </div>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>

    </div>
  );
}