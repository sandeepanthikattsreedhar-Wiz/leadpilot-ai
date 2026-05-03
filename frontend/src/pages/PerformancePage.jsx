import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PerformancePage() {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    loadPerformance();

    const timer = setInterval(
      loadPerformance,
      5000
    );

    return () => clearInterval(timer);
  }, []);

  const loadPerformance = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/performance-data"
      );

      const data = await res.json();
      setTeamData(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (teamData.length === 0) {
    return (
      <div className="text-lg font-medium">
        Loading Performance...
      </div>
    );
  }

  const sorted = [...teamData].sort(
    (a, b) => b.completed - a.completed
  );

  const topPerformer = sorted[0];

  const lowPerformer =
    sorted[sorted.length - 1];

  const totalCompleted = teamData.reduce(
    (sum, x) => sum + x.completed,
    0
  );

  const leadScore =
    totalCompleted === 0
      ? 0
      : Math.min(
          Math.round(
            (totalCompleted /
              (totalCompleted +
                teamData.reduce(
                  (sum, x) =>
                    sum + x.pending,
                  0
                ))) *
              100
          ),
          100
        );

  const teamGrowth =
    totalCompleted > 0
      ? Math.min(
          Math.round(
            totalCompleted / 4
          ),
          25
        )
      : 0;

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-5">

        <Card
          title="Total Completed"
          value={totalCompleted}
        />

        <Card
          title="Top Performer"
          value={topPerformer.name}
        />

        <Card
          title="Your Lead Score"
          value={`${leadScore}%`}
          green
        />

        <Card
          title="Needs Attention"
          value={lowPerformer.name}
          red
        />

      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-5 h-96">
        <h3 className="font-semibold mb-4">
          Team Productivity
        </h3>

        <ResponsiveContainer
          width="100%"
          height="90%"
        >
          <BarChart data={teamData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" />
            <Bar dataKey="pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Cards */}
      <div className="grid md:grid-cols-3 gap-5">

        <InsightCard
          title="AI Insight"
          text={`${topPerformer.name} has highest close rate. Give critical work.`}
        />

        <InsightCard
          title="AI Suggestion"
          text={`${lowPerformer.name} has high pending load. Rebalance tasks.`}
        />

        <InsightCard
          title="Leadership Insight"
          text={`Your team completion improved ${teamGrowth}% this week.`}
        />

      </div>

      {/* Leaderboard */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-4">
          Leaderboard
        </h3>

        <div className="space-y-3">

          {sorted.map(
            (user, index) => (
              <div
                key={user.name}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  #{index + 1}{" "}
                  {user.name}
                </span>

                <span className="font-semibold">
                  {user.completed} Completed
                </span>
              </div>
            )
          )}

        </div>
      </div>

    </div>
  );
}

function Card({
  title,
  value,
  green,
  red,
}) {
  let color = "text-black";

  if (green) color = "text-green-600";
  if (red) color = "text-red-600";

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">
        {title}
      </p>

      <h2
        className={`text-3xl font-bold ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}

function InsightCard({
  title,
  text,
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-600">
        {text}
      </p>
    </div>
  );
}