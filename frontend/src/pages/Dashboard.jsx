import { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
  loadDashboard();

  const timer = setInterval(loadDashboard, 5000);

  return () => clearInterval(timer);
}, []);

  const loadDashboard = async () => {
    const res = await fetch("http://127.0.0.1:8000/dashboard-full");
    const json = await res.json();
    setData(json);
  };

  if (!data) return <div>Loading Dashboard...</div>;

  const chartData = [
    { name: "Completed", value: data.stats.completed },
    { name: "Pending", value: data.stats.pending },
    { name: "Progress", value: data.stats.inprogress },
  ];

  const pieData = [
    { name: "High", value: data.priority.high },
    { name: "Medium", value: data.priority.medium },
    { name: "Low", value: data.priority.low },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Executive Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-5">
        <Card title="Total Tasks" value={data.stats.total} />
        <Card title="Completed" value={data.stats.completed} />
        <Card title="Pending" value={data.stats.pending} />
        <Card title="In Progress" value={data.stats.inprogress} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow">
          <h3 className="font-semibold mb-3">Task Status</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="value" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <h3 className="font-semibold mb-3">Priority Mix</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  <Cell />
                  <Cell />
                  <Cell />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Productivity */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold">
          Team Productivity Score
        </h3>

        <div className="mt-4 text-5xl font-bold">
          {data.productivity}%
        </div>

        <div className="mt-3 bg-slate-200 h-4 rounded-full">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${data.productivity}%` }}
          ></div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Recent Tasks
        </h3>

        <div className="space-y-3">
          {data.recent.map((task) => (
            <div
              key={task.id}
              className="border rounded-xl p-4 flex justify-between"
            >
              <span>{task.title}</span>
              <span>{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-slate-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}