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
import Insights from "./pages/Insights";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f5f2]">

      {/* SIDEBAR */}
      <div className="
        relative z-30
        bg-gradient-to-b
        from-purple-950
        via-violet-900
        to-purple-950
        shadow-2xl
        border-r
        border-violet-800
      ">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full pointer-events-none"></div>

<div className="absolute bottom-0 right-0 w-72 h-72 bg-fuchsia-500 opacity-20 blur-3xl rounded-full pointer-events-none"></div>
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="z-20">
          <Header />
        </div>

        {/* PAGE AREA */}
        <div
          className="
            flex-1
            overflow-y-auto
            p-6
            relative
            bg-[#faf8f5]
          "
        >

          {/* Fading Check Pattern */}
          <div
            className="
              absolute inset-0 opacity-[0.035] pointer-events-none
            "
            style={{
              backgroundImage: `
                linear-gradient(5deg, #000 25%, transparent 25%),
                linear-gradient(-5deg, #000 25%, transparent 25%),
                linear-gradient(5deg, transparent 75%, #000 75%),
                linear-gradient(-5deg, transparent 75%, #000 75%)
              `,
              backgroundSize: "60px 60px",
              backgroundPosition:
                "0 0, 0 30px, 30px -30px, -30px 0px",
            }}
          ></div>

          {/* Soft Glow */}
<div className="absolute top-20 right-20 w-96 h-96 bg-violet-200 opacity-20 blur-3xl rounded-full pointer-events-none"></div>
          {/* CONTENT */}
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/scheduler" element={<SchedulerPage />} />
              <Route path="/meetings" element={<MeetingsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/docs-ai" element={<DocumentPage />} />
              <Route path="/followup-data" element={<FollowUpPage />} />
              <Route path="/capacity" element={<CapacityPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/insights" element={<Insights />} />
            </Routes>
          </div>

        </div>
      </div>
    </div>
  );
}