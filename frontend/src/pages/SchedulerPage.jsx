import { useState } from "react";
import teamData from "../data/teamData";
import EngineerCard from "../components/EngineerCard";

export default function SchedulerPage() {
  const [team, setTeam] = useState(teamData);

  const toggleAvailability = (id) => {
    setTeam(
      team.map((member) =>
        member.id === id
          ? { ...member, available: !member.available }
          : member
      )
    );
  };

  const availableCount = team.filter((x) => x.available).length;
  const busyCount = team.length - availableCount;
  const overloaded = team.filter((x) => x.tasks >= 4).length;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Engineers</p>
          <h2 className="text-3xl font-bold">{team.length}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Available</p>
          <h2 className="text-3xl font-bold text-green-600">
            {availableCount}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Overloaded</p>
          <h2 className="text-3xl font-bold text-red-600">
            {overloaded}
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {team.map((member) => (
          <EngineerCard
            key={member.id}
            engineer={member}
            toggleAvailability={toggleAvailability}
          />
        ))}
      </div>
    </div>
  );
}