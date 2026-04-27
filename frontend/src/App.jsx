import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import SchedulerPage from "./pages/SchedulerPage";
import MeetingsPage from "./pages/MeetingsPage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import PerformancePage from "./pages/PerformancePage";
import DocumentPage from "./pages/DocumentPage";
import FollowUpPage from "./pages/FollowUpPage";
import CapacityPage from "./pages/CapacityPage";


export default function App() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Header />

        <div className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/scheduler" element={<SchedulerPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route
              path="/notifications"
              element={<NotificationsPage />}
            />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/docs-ai" element={<DocumentPage />} />
            <Route path="/follow-up" element={<FollowUpPage />} />
            <Route path="/capacity" element={<CapacityPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}