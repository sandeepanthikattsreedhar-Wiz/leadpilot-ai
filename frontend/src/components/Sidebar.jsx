import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/" },
  { name: "Tasks", path: "/tasks" },
  { name: "Scheduler", path: "/scheduler" },
  { name: "Meetings", path: "/meetings" },
  { name: "Reports", path: "/reports" },
  { name: "Notifications", path: "/notifications" },
  { name: "Performance", path: "/performance" },
  { name: "Docs AI", path: "/docs-ai" },
  { name: "Follow Up", path: "/follow-up" },
  { name: "Capacity", path: "/capacity" },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">LeadPilot AI</h1>

      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive
                    ? "bg-cyan-500 text-white"
                    : "hover:bg-slate-800"
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}