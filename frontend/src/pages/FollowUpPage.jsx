import { useEffect, useMemo, useState } from "react";

export default function FollowUpPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadFollowups();

    const timer = setInterval(
      loadFollowups,
      5000
    );

    return () => clearInterval(timer);
  }, []);

  const loadFollowups = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/followup-data"
      );

      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const ranked = useMemo(() => {
    return [...items].sort((a, b) => {
      const scoreA =
        (a.priority === "High"
          ? 10
          : a.priority === "Medium"
          ? 6
          : 3) + a.days;

      const scoreB =
        (b.priority === "High"
          ? 10
          : b.priority === "Medium"
          ? 6
          : 3) + b.days;

      return scoreB - scoreA;
    });
  }, [items]);

  const markUpdated = async (id) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/followup-update/${id}`,
        {
          method: "PUT",
        }
      );

      loadFollowups();
    } catch (error) {
      console.error(error);
    }
  };

  const getSuggestion = (item) => {
    if (item.days >= 3)
      return "Escalate / Call directly";

    if (item.days >= 1)
      return "Send reminder now";

    return "Monitor";
  };

  const pendingCount = items.filter(
    (x) => x.status === "Pending"
  ).length;

  const criticalCount = items.filter(
    (x) => x.days >= 3
  ).length;

  const updatedToday = items.filter(
    (x) => x.status === "Updated"
  ).length;

  const efficiency =
    items.length === 0
      ? 100
      : Math.round(
          (updatedToday / items.length) * 100
        );

  const top2 = ranked
    .filter((x) => x.status === "Pending")
    .slice(0, 2);

  const digest =
    top2.length === 0
      ? "All tasks are updated. No urgent follow-ups pending."
      : `${top2
          .map(
            (x) =>
              `${x.owner} - ${x.task} delayed ${x.days} day(s)`
          )
          .join(". ")}.`;

  return (
    <div className="space-y-6">

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-5">

        <Card
          title="Pending Follow-ups"
          value={pendingCount}
        />

        <Card
          title="Critical Delays"
          value={criticalCount}
          red
        />

        <Card
          title="Updated Today"
          value={updatedToday}
          green
        />

        <Card
          title="Lead Efficiency"
          value={`${efficiency}%`}
        />

      </div>

      {/* Digest */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          Daily Digest
        </h3>

        <p className="text-gray-700 leading-7">
          {digest}
        </p>
      </div>

      {/* Queue */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          Priority Follow-up Queue
        </h3>

        <div className="space-y-4">

          {ranked.map((item, index) => (
            <div
              key={item.id}
              className="border rounded-lg p-4"
            >

              <div className="flex justify-between items-start">

                <div>
                  <h4 className="font-semibold">
                    #{index + 1}{" "}
                    {item.task}
                  </h4>

                  <p className="text-sm text-gray-500">
                    Owner: {item.owner}
                  </p>

                  <p className="text-sm">
                    Last Update: {item.days} day(s) ago
                  </p>
                </div>

                <div className="text-right space-y-2">

                  <span
                    className={
                      item.priority ===
                      "High"
                        ? "text-red-600 font-semibold"
                        : item.priority ===
                          "Medium"
                        ? "text-yellow-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {item.priority}
                  </span>

                  <p className="text-sm">
                    {item.status}
                  </p>

                </div>

              </div>

              <div className="mt-3 flex justify-between items-center">

                <p className="text-sm text-blue-700">
                  AI Suggestion:{" "}
                  {getSuggestion(item)}
                </p>

                {item.status ===
                  "Pending" && (
                  <button
                    onClick={() =>
                      markUpdated(
                        item.id
                      )
                    }
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Mark Updated
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

function Card({
  title,
  value,
  red,
  green,
}) {
  let color = "text-black";

  if (red) color = "text-red-600";
  if (green)
    color = "text-green-600";

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