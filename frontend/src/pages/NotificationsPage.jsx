import notificationData from "../data/notificationData";
import NotificationCard from "../components/NotificationCard";

export default function NotificationsPage() {
  const high = notificationData.filter((x) => x.type === "high").length;
  const medium = notificationData.filter((x) => x.type === "medium").length;
  const info = notificationData.filter((x) => x.type === "info").length;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Alerts</p>
          <h2 className="text-3xl font-bold">{notificationData.length}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Critical</p>
          <h2 className="text-3xl font-bold text-red-600">{high}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Follow-ups</p>
          <h2 className="text-3xl font-bold text-yellow-600">{medium}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Reminders</p>
          <h2 className="text-3xl font-bold text-blue-600">{info}</h2>
        </div>
      </div>

      <div className="space-y-4">
        {notificationData.map((item) => (
          <NotificationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}