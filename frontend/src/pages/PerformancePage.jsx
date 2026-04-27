import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PerformancePage() {
  const teamData = [
    { name: "Rahul", completed: 12, pending: 3 },
    { name: "Meena", completed: 9, pending: 5 },
    { name: "Arjun", completed: 14, pending: 1 },
    { name: "Divya", completed: 10, pending: 4 },
  ];

  const sorted = [...teamData].sort(
    (a, b) => b.completed - a.completed
  );

  const topPerformer = sorted[0];

  const lowPerformer = sorted[sorted.length - 1];

  const totalCompleted = teamData.reduce(
    (sum, x) => sum + x.completed,
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Completed</p>
          <h2 className="text-3xl font-bold">
            {totalCompleted}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Top Performer</p>
          <h2 className="text-2xl font-bold">
            {topPerformer.name}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Your Lead Score</p>
          <h2 className="text-3xl font-bold text-green-600">
            92%
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Needs Attention</p>
          <h2 className="text-2xl font-bold text-red-600">
            {lowPerformer.name}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 h-96">
        <h3 className="font-semibold mb-4">
          Team Productivity
        </h3>

        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={teamData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" />
            <Bar dataKey="pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-2">
            AI Insight
          </h3>
          <p className="text-gray-600">
            Arjun has highest close rate. Give critical work.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-2">
            AI Suggestion
          </h3>
          <p className="text-gray-600">
            Meena has high pending load. Rebalance tasks.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-2">
            Leadership Insight
          </h3>
          <p className="text-gray-600">
            Your team completion improved 11% this week.
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-4">
          Leaderboard
        </h3>

        <div className="space-y-3">
          {sorted.map((user, index) => (
            <div
              key={user.name}
              className="flex justify-between border-b pb-2"
            >
              <span>
                #{index + 1} {user.name}
              </span>

              <span className="font-semibold">
                {user.completed} Completed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}