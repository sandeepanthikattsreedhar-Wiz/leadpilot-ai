import { useEffect, useState } from "react";

export default function Insights() {
  const [data, setData] = useState(null);

 useEffect(() => {
  loadData();

  const timer = setInterval(loadData, 7000);

  return () => clearInterval(timer);
}, []);

  const loadData = async () => {
    const res = await fetch("http://127.0.0.1:8000/smart-insights");
    const json = await res.json();
    setData(json);
  };

  if (!data) return <div>Loading insights...</div>;

  const riskColor =
    data.risk === "High"
      ? "bg-red-500"
      : data.risk === "Medium"
      ? "bg-orange-500"
      : "bg-green-500";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Smart Insights Engine
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-slate-500">Completion Risk</p>

        <div
          className={`inline-block mt-3 px-4 py-2 text-white rounded-full ${riskColor}`}
        >
          {data.risk}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card title="Pending Tasks" value={data.pending} />
        <Card title="In Progress" value={data.inprogress} />
        <Card title="High Priority" value={data.high_priority} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-xl mb-4">
          Workload Alerts
        </h3>

        {data.overloaded.length === 0 ? (
          <p>No overload detected.</p>
        ) : (
          data.overloaded.map((item, i) => (
            <div
              key={i}
              className="border rounded-xl p-3 mb-3"
            >
              {item}
            </div>
          ))
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-xl mb-4">
          Recommendations
        </h3>

        {data.recommendations.map((item, i) => (
          <div
            key={i}
            className="border rounded-xl p-3 mb-3"
          >
            {item}
          </div>
        ))}
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