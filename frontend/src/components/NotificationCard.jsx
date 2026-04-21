export default function NotificationCard({ item }) {
  const styles = {
    high: "border-red-500 bg-red-50",
    medium: "border-yellow-500 bg-yellow-50",
    info: "border-blue-500 bg-blue-50",
    success: "border-green-500 bg-green-50",
  };

  return (
    <div
      className={`border-l-4 rounded-xl p-4 shadow bg-white ${styles[item.type]}`}
    >
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-gray-600 mt-1">{item.message}</p>
    </div>
  );
}