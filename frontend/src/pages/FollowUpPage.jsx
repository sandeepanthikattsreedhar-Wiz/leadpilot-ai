import { useMemo, useState } from "react";

export default function FollowUpPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      owner: "Rahul",
      task: "UAT Bug Fix",
      days: 2,
      priority: "High",
      status: "Pending",
    },
    {
      id: 2,
      owner: "Meena",
      task: "API Mapping",
      days: 1,
      priority: "Medium",
      status: "Pending",
    },
    {
      id: 3,
      owner: "Divya",
      task: "Dashboard UI",
      days: 4,
      priority: "High",
      status: "Pending",
    },
    {
      id: 4,
      owner: "Arjun",
      task: "Testing Support",
      days: 0,
      priority: "Low",
      status: "Updated",
    },
  ]);

  const ranked = useMemo(() => {
    return [...items].sort((a, b) => {
      const scoreA =
        (a.priority === "High" ? 10 :
        a.priority === "Medium" ? 6 : 3) + a.days;

      const scoreB =
        (b.priority === "High" ? 10 :
        b.priority === "Medium" ? 6 : 3) + b.days;

      return scoreB - scoreA;
    });
  }, [items]);

  const markUpdated = (id) => {
    setItems(
      items.map((x) =>
        x.id === id ? { ...x, status: "Updated", days: 0 } : x
      )
    );
  };

  const getSuggestion = (item) => {
    if (item.days >= 3) return "Escalate / Call directly";
    if (item.days >= 1) return "Send reminder now";
    return "Monitor";
  };

  const pendingCount = items.filter(
    (x) => x.status === "Pending"
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Pending Follow-ups</p>
          <h2 className="text-3xl font-bold">
            {pendingCount}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Critical Delays</p>
          <h2 className="text-3xl font-bold text-red-600">
            {
              items.filter((x) => x.days >= 3).length
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Updated Today</p>
          <h2 className="text-3xl font-bold text-green-600">
            {
              items.filter(
                (x) => x.status === "Updated"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Lead Efficiency</p>
          <h2 className="text-3xl font-bold">
            93%
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          Daily Digest
        </h3>

        <p className="text-gray-700 leading-7">
          Two high-priority items need immediate
          follow-up. Divya task is delayed 4 days.
          Rahul pending for 2 days. One member updated
          status today.
        </p>
      </div>

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
                    #{index + 1} {item.task}
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
                      item.priority === "High"
                        ? "text-red-600 font-semibold"
                        : item.priority === "Medium"
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
                  AI Suggestion: {getSuggestion(item)}
                </p>

                {item.status === "Pending" && (
                  <button
                    onClick={() =>
                      markUpdated(item.id)
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