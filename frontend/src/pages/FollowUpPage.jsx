import { useEffect, useMemo, useState } from "react";

export default function FollowUpPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/followup-data`);
    const data = await res.json();
    setItems(data);
  };

  // 🔍 Search filter
  const filtered = useMemo(() => {
    return items.filter((x) =>
      x.task.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  // 🔥 Sort by score
  const ranked = useMemo(() => {
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [filtered]);

  // 🔴🟡🟢 Grouping
  const critical = ranked.filter((x) => x.criticality === "High");
  const medium = ranked.filter((x) => x.criticality === "Medium");
  const low = ranked.filter((x) => x.criticality === "Low");

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Follow-up Intelligence Dashboard.
      </h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search task..."
        className="border p-3 rounded-xl w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🔴 CRITICAL */}
      <Section title="🔥 Critical (Immediate Action)">
        {critical.map((item) => (
          <TaskCard item={item} />
        ))}
      </Section>

      {/* 🟡 MEDIUM */}
      <Section title="⚠️ Needs Attention">
        {medium.map((item) => (
          <TaskCard item={item} />
        ))}
      </Section>

      {/* 🟢 LOW */}
      <Section title="✅ Under Control">
        {low.map((item) => (
          <TaskCard item={item} />
        ))}
      </Section>

    </div>
  );
}

// ---------------- TASK CARD ----------------
function TaskCard({ item }) {
  const color =
    item.criticality === "High"
      ? "border-red-500"
      : item.criticality === "Medium"
      ? "border-yellow-500"
      : "border-green-500";

  const bg =
    item.criticality === "High"
      ? "bg-red-50"
      : item.criticality === "Medium"
      ? "bg-yellow-50"
      : "bg-green-50";

  // ⏳ urgency %
  const urgencyPercent =
    item.days <= 0
      ? 100
      : item.days <= 3
      ? 80
      : item.days <= 7
      ? 50
      : 20;

  return (
    <div className={`p-5 rounded-xl border-l-4 shadow ${color} ${bg}`}>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {item.task}
          </h3>
          <p className="text-sm text-gray-500">
            {item.owner}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold">
            Score: {item.score}
          </p>
          <p className="text-xs text-gray-500">
            {item.priority}
          </p>
        </div>
      </div>

      {/* URGENCY BAR */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${urgencyPercent}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-gray-600">
          Deadline in {item.days} day(s)
        </p>
      </div>

      {/* ACTION */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm font-medium text-blue-700">
          🤖 {item.action}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-xs ${
            item.criticality === "High"
              ? "bg-red-100 text-red-600"
              : item.criticality === "Medium"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {item.criticality}
        </span>
      </div>

    </div>
  );
}

// ---------------- SECTION ----------------
function Section({ title, children }) {
  if (children.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}