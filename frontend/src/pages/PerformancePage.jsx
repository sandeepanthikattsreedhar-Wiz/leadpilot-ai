import { useEffect, useState } from "react";

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

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Team Performance Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Engineer-wise delivery performance
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

        {data.map((item, index) => {
          const total =
            item.completed +
            item.pending +
            item.progress +
            item.qa +
            item.uat;

          const efficiency =
            total === 0
              ? 0
              : Math.round((item.completed / total) * 100);

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-5 border border-slate-200"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Implementation Engineer
                  </p>
                </div>

                <div
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    efficiency >= 80
                      ? "bg-green-100 text-green-700"
                      : efficiency >= 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {efficiency}%
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 mt-5">

                <StatCard
                  label="Completed"
                  value={item.completed}
                  color="green"
                />

                <StatCard
                  label="Pending"
                  value={item.pending}
                  color="yellow"
                />

                <StatCard
                  label="In Progress"
                  value={item.progress}
                  color="blue"
                />

                <StatCard
                  label="QA/UAT"
                  value={(item.qa || 0) + (item.uat || 0)}
                  color="purple"
                />
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-5">
                <div className="flex justify-between text-sm mb-1">
                  <span>Efficiency</span>
                  <span>{efficiency}%</span>
                </div>

                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${efficiency}%` }}
                  ></div>
                </div>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className={`rounded-xl p-3 ${colors[color]}`}>
      <p className="text-xs">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}