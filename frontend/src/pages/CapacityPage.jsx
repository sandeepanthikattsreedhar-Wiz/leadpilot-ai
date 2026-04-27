import { useMemo, useState } from "react";

export default function CapacityPage() {
  const [team] = useState([
    {
      id: 1,
      name: "Rahul",
      allocated: 8,
      capacity: 8,
      skill: "Backend",
    },
    {
      id: 2,
      name: "Meena",
      allocated: 5,
      capacity: 8,
      skill: "Integration",
    },
    {
      id: 3,
      name: "Arjun",
      allocated: 9,
      capacity: 8,
      skill: "Testing",
    },
    {
      id: 4,
      name: "Divya",
      allocated: 3,
      capacity: 8,
      skill: "Frontend",
    },
  ]);

  const data = useMemo(() => {
    return team.map((x) => {
      const percent = Math.round(
        (x.allocated / x.capacity) * 100
      );

      let status = "Balanced";

      if (percent > 100) status = "Overloaded";
      else if (percent < 60) status = "Available";

      return {
        ...x,
        percent,
        status,
      };
    });
  }, [team]);

  const overloaded = data.filter(
    (x) => x.status === "Overloaded"
  );

  const available = data.filter(
    (x) => x.status === "Available"
  );

  const balanced = data.filter(
    (x) => x.status === "Balanced"
  );

  const suggestion =
    overloaded.length && available.length
      ? `Move work from ${overloaded[0].name} to ${available[0].name}`
      : "Team load balanced";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Overloaded</p>
          <h2 className="text-3xl font-bold text-red-600">
            {overloaded.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Available</p>
          <h2 className="text-3xl font-bold text-green-600">
            {available.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Balanced</p>
          <h2 className="text-3xl font-bold">
            {balanced.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Sprint Health</p>
          <h2 className="text-3xl font-bold text-blue-600">
            89%
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          AI Recommendation
        </h3>

        <p className="text-gray-700">
          {suggestion}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          Team Capacity View
        </h3>

        <div className="space-y-4">
          {data.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-semibold">
                    {user.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {user.skill}
                  </p>
                </div>

                <span
                  className={
                    user.status === "Overloaded"
                      ? "text-red-600 font-semibold"
                      : user.status === "Available"
                      ? "text-green-600 font-semibold"
                      : "text-blue-600 font-semibold"
                  }
                >
                  {user.status}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className={
                    user.status === "Overloaded"
                      ? "bg-red-500 h-3 rounded"
                      : user.status === "Available"
                      ? "bg-green-500 h-3 rounded"
                      : "bg-blue-500 h-3 rounded"
                  }
                  style={{
                    width: `${Math.min(
                      user.percent,
                      100
                    )}%`,
                  }}
                ></div>
              </div>

              <p className="text-sm mt-2 text-gray-600">
                {user.allocated}h / {user.capacity}h
                allocated ({user.percent}%)
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          Sprint Notes
        </h3>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Arjun needs load reduction</li>
          <li>Divya can take extra UI tasks</li>
          <li>Rahul at full capacity</li>
          <li>Meena can support integrations</li>
        </ul>
      </div>
    </div>
  );
}