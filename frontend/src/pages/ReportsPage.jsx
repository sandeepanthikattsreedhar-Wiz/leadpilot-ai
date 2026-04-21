import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import InsightCard from "../components/InsightCard";

export default function ReportsPage() {
  const taskData = [
    { name: "Mon", completed: 4, pending: 3 },
    { name: "Tue", completed: 6, pending: 2 },
    { name: "Wed", completed: 5, pending: 4 },
    { name: "Thu", completed: 8, pending: 1 },
    { name: "Fri", completed: 7, pending: 2 },
  ];

  const teamLoad = [
    { name: "Rahul", value: 2 },
    { name: "Meena", value: 4 },
    { name: "Arjun", value: 1 },
    { name: "Divya", value: 3 },
  ];

  const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Tasks Completed</p>
          <h2 className="text-3xl font-bold">30</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Pending Tasks</p>
          <h2 className="text-3xl font-bold">12</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Team Utilization</p>
          <h2 className="text-3xl font-bold">78%</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Your Efficiency</p>
          <h2 className="text-3xl font-bold">91%</h2>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow h-80">
          <h3 className="font-semibold mb-4">Weekly Task Trend</h3>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={taskData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" />
              <Bar dataKey="pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-xl shadow h-80">
          <h3 className="font-semibold mb-4">Engineer Workload</h3>

          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={teamLoad}
                dataKey="value"
                outerRadius={100}
                label
              >
                {teamLoad.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <InsightCard
          title="AI Insight"
          text="Meena is overloaded. Reassign 1 task this week."
        />

        <InsightCard
          title="AI Suggestion"
          text="Schedule client follow-up today for delayed project Alpha ERP."
        />

        <InsightCard
          title="Performance Alert"
          text="Your completion rate improved 12% over last week."
        />
      </div>
    </div>
  );
}