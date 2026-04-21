import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const titleMap = {
    "/": "Dashboard",
    "/tasks": "Tasks",
    "/scheduler": "Scheduler",
    "/meetings": "Meetings",
    "/reports": "Reports",
    "/notifications": "Notifications",
  };

  const title = titleMap[location.pathname] || "LeadPilot AI";

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-sm text-gray-600">
        Welcome, Project Lead
      </div>
    </div>
  );
}