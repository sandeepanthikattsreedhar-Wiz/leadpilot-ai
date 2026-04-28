import { useMemo, useState } from "react";

export default function NotificationsPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      type: "Delay",
      title: "UAT Bug Fix delayed by Rahul",
      priority: "High",
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      type: "Meeting",
      title: "Client Review starts at 1:00 PM",
      priority: "Medium",
      time: "20 min ago",
      read: false,
    },
    {
      id: 3,
      type: "Follow Up",
      title: "Need status update from Divya",
      priority: "High",
      time: "35 min ago",
      read: false,
    },
    {
      id: 4,
      type: "Success",
      title: "API Mapping completed by Meena",
      priority: "Low",
      time: "1 hr ago",
      read: true,
    },
  ]);

  const unread = items.filter((x) => !x.read).length;

  const sorted = useMemo(() => {
    const score = (x) =>
      x.priority === "High"
        ? 3
        : x.priority === "Medium"
        ? 2
        : 1;

    return [...items].sort((a, b) => score(b) - score(a));
  }, [items]);

  const markRead = (id) => {
    setItems(
      items.map((x) =>
        x.id === id ? { ...x, read: true } : x
      )
    );
  };

  const clearAll = () => {
    setItems(
      items.map((x) => ({ ...x, read: true }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Unread Alerts</p>
          <h2 className="text-3xl font-bold text-red-600">
            {unread}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">High Priority</p>
          <h2 className="text-3xl font-bold">
            {
              items.filter(
                (x) => x.priority === "High"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Meetings Today</p>
          <h2 className="text-3xl font-bold">
            3
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Response Score</p>
          <h2 className="text-3xl font-bold text-green-600">
            94%
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">
            AI Daily Summary
          </h3>

          <button
            onClick={clearAll}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Mark All Read
          </button>
        </div>

        <p className="text-gray-700 leading-7">
          Two critical items need attention.
          One client meeting upcoming.
          One task completed recently.
          Recommend follow-up with Rahul and Divya first.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          Notification Feed
        </h3>

        <div className="space-y-4">
          {sorted.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-4 ${
                item.read
                  ? "opacity-70"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.type}
                  </p>

                  <h4 className="font-semibold">
                    {item.title}
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.time}
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

                  {!item.read && (
                    <button
                      onClick={() =>
                        markRead(item.id)
                      }
                      className="block bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}