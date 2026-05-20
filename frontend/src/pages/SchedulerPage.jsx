import { useEffect, useState } from "react";
import EngineerCard from "../components/EngineerCard";

export default function SchedulerPage() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    loadScheduler();

    const timer = setInterval(loadScheduler, 5000);

    return () => clearInterval(timer);
  }, []);

  const loadScheduler = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/scheduler-data"
      );

      const data = await res.json();
      setTeam(data);
    } catch (error) {
      console.error(error);
    }
  };

  const availableCount =
    team.filter((x) => x.available).length;

  const overloaded =
    team.filter((x) => x.overloaded).length;

  const avgUtilization =
    team.length > 0
      ? Math.round(
        team.reduce(
          (sum, x) => sum + x.utilization,
          0
        ) / team.length
      )
      : 0;

  return (
    <div className="space-y-6">

      {/* Top Cards */}
      <div className="grid md:grid-cols-3 gap-5">

        <Card
          title="Total Engineers"
          value={team.length}
        />

        <Card
          title="Available"
          value={availableCount}
        />

        <Card
          title="Overloaded"
          value={overloaded}
        />

        <Card
          title="Avg Utilization"
          value={`${avgUtilization}%`}
        />

      </div>

      {/* Engineer Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {team.map((member) => (
          <EngineerCard
            key={member.name}
            engineer={member}
          />
        ))}
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
}