import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SchedulerPage from "./pages/SchedulerPage";

export default function App() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Header />

        <div className="p-6">
          <SchedulerPage />
        </div>
      </div>
    </div>
  );
}