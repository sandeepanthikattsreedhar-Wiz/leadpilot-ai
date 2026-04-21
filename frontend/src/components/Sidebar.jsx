export default function Sidebar() {
  const menu = ["Dashboard", "Tasks", "Scheduler", "Meetings", "Reports","Notifications"];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">LeadPilot AI</h1>

      <ul className="space-y-4">
        {menu.map((item) => (
          <li key={item} className="hover:text-cyan-400 cursor-pointer">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}