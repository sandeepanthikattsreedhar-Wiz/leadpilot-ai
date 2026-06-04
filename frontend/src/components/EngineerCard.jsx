import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function EngineerCard({
  engineer,
}) {
  const data = [
    {
      name: "Used",
      value: engineer.utilization,
    },
    {
      name: "Free",
      value:
        100 - engineer.utilization,
    },
  ];

  const COLORS = [
    engineer.overloaded
      ? "#ef4444"
      : engineer.utilization > 70
      ? "#f59e0b"
      : "#8b5cf6",
    "#e5e7eb",
  ];

  const healthColor =
    engineer.health_score >= 80
      ? "text-green-600"
      : engineer.health_score >= 50
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-white to-purple-50 shadow-xl p-5 transition hover:scale-[1.02]">

      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 opacity-20 blur-3xl rounded-full"></div>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {engineer.name}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            AI Delivery Engineer
          </p>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            engineer.overloaded
              ? "bg-red-100 text-red-600"
              : engineer.available
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {engineer.overloaded
            ? "Overloaded"
            : engineer.available
            ? "Available"
            : "Balanced"}
        </div>
      </div>

      {/* Chart + Metrics */}
      <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">

        {/* Circular Chart */}
        <div className="h-40 relative">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={65}
                dataKey="value"
                stroke="none"
              >
                {data.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  )
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="text-3xl font-bold text-slate-800">
              {engineer.utilization}%
            </p>

            <p className="text-xs text-slate-500">
              Utilized
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-3">

          <Metric
            label="Active Tasks"
            value={engineer.tasks}
          />

          <Metric
            label="Completed"
            value={engineer.completed}
          />

          <Metric
            label="Blocked"
            value={engineer.blocked}
          />

          <div>
            <p className="text-xs text-slate-500">
              Delivery Health
            </p>

            <p
              className={`text-xl font-bold ${healthColor}`}
            >
              {engineer.health_score}%
            </p>
          </div>

        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mt-6 relative z-10">

        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Task Pipeline
        </h3>

        <div className="flex flex-wrap gap-2">

          <Tag
            label="Yet to Start"
            value={engineer.yet_to_start}
            color="bg-slate-200 text-slate-700"
          />

          <Tag
            label="Progress"
            value={engineer.progress}
            color="bg-blue-100 text-blue-700"
          />

          <Tag
            label="QA"
            value={engineer.qa}
            color="bg-amber-100 text-amber-700"
          />

          <Tag
            label="UAT"
            value={engineer.uat}
            color="bg-indigo-100 text-indigo-700"
          />

          <Tag
            label="Production"
            value={engineer.production}
            color="bg-green-100 text-green-700"
          />

        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 relative z-10">

        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-500">
            Sprint Load
          </span>

          <span className="font-semibold">
            {engineer.tasks}/5
          </span>
        </div>

        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">

          <div
            className={`h-3 rounded-full ${
              engineer.overloaded
                ? "bg-red-500"
                : engineer.utilization > 70
                ? "bg-yellow-500"
                : "bg-purple-600"
            }`}
            style={{
              width: `${engineer.utilization}%`,
            }}
          ></div>

        </div>
      </div>

      {/* AI Recommendation */}
      <div className="mt-6 relative z-10 bg-purple-100 border border-purple-200 rounded-2xl p-4">

        <p className="text-xs text-purple-600 font-semibold mb-1">
          AI Recommendation
        </p>

        <p className="text-sm text-slate-700">
          {engineer.recommendation}
        </p>
      </div>

    </div>
  );
}

function Metric({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-lg font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Tag({
  label,
  value,
  color,
}) {
  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {label}: {value}
    </div>
  );
}