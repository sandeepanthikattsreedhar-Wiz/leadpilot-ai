import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadReports();

    const timer = setInterval(
      loadReports,
      5000
    );

    return () => clearInterval(timer);
  }, []);

  const loadReports = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/reports-data`
    );

    const json = await res.json();
    setData(json);
  };

  if (!data) {
    return (
      <div className="text-lg font-semibold">
        Loading Reports...
      </div>
    );
  }

  const k = data.kpis;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-2xl">

        <h1 className="text-4xl font-bold">
          AI Executive Reports Center
        </h1>

        <p className="mt-3 text-purple-100">
          Real-time delivery intelligence and AI insights
        </p>

      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-5">

        <Card
          title="Productivity"
          value={`${k.productivity}%`}
          icon={<TrendingUp />}
        />

        <Card
          title="Completed"
          value={k.completed}
          icon={<FileText />}
        />

        <Card
          title="Blocked"
          value={k.blocked}
          icon={<AlertTriangle />}
        />

        <Card
          title="Top Owner"
          value={k.top_owner}
          icon={<Users />}
        />

      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* STATUS */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl">

          <h2 className="text-xl font-bold mb-5">
            Task Status Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={data.charts.status}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
              >
                {data.charts.status.map((_, index) => (
                  <Cell
                    key={index}
                    fill={[
                      "#8b5cf6",
                      "#3b82f6",
                      "#eab308",
                      "#f97316",
                      "#10b981",
                      "#22c55e",
                      "#ef4444",
                    ][index % 7]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* OWNER LOAD */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl">

          <h2 className="text-xl font-bold mb-5">
            Engineer Workload
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={data.charts.owners}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="tasks" fill="#8b5cf6" />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* AI INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white/80 rounded-3xl p-6 shadow-xl">

          <div className="flex items-center gap-3 mb-5">

            <Brain className="text-purple-600" />

            <h2 className="text-2xl font-bold">
              AI Insights
            </h2>

          </div>

          <div className="space-y-4">

            {data.insights.map((x, i) => (
              <div
                key={i}
                className="bg-purple-50 border border-purple-200 rounded-2xl p-4"
              >
                {x}
              </div>
            ))}

          </div>

        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-white/80 rounded-3xl p-6 shadow-xl">

          <h2 className="text-2xl font-bold mb-5">
            Recommendations
          </h2>

          <div className="space-y-4">

            {data.recommendations.map((x, i) => (
              <div
                key={i}
                className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4"
              >
                {x}
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* EXEC SUMMARY */}
      <div className="bg-white/80 rounded-3xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold mb-5">
          Executive Summary
        </h2>

        <div className="leading-8 whitespace-pre-line text-slate-700">
          {data.summary}
        </div>

      </div>

    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="text-purple-600">
          {icon}
        </div>

      </div>

    </div>
  );
}