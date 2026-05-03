import { useEffect, useMemo, useState } from "react";

export default function CapacityPage() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    loadCapacity();

    const timer = setInterval(
      loadCapacity,
      5000
    );

    return () => clearInterval(timer);
  }, []);

  const loadCapacity = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/capacity-data"
      );

      const data = await res.json();
      setTeam(data);
    } catch (error) {
      console.error(error);
    }
  };

  const data = useMemo(() => {
    return team.map((x) => {
      const percent = Math.round(
        (x.allocated / x.capacity) * 100
      );

      let status = "Balanced";

      if (percent > 100)
        status = "Overloaded";
      else if (percent < 60)
        status = "Available";

      return {
        ...x,
        percent,
        status,
      };
    });
  }, [team]);

  if (data.length === 0) {
    return (
      <div className="text-lg font-medium">
        Loading Capacity...
      </div>
    );
  }

  const overloaded = data.filter(
    (x) => x.status === "Overloaded"
  );

  const available = data.filter(
    (x) => x.status === "Available"
  );

  const balanced = data.filter(
    (x) => x.status === "Balanced"
  );

  const totalPercent = data.reduce(
    (sum, x) => sum + x.percent,
    0
  );

  const sprintHealth = Math.max(
    0,
    Math.min(
      100,
      100 -
        Math.round(
          overloaded.length * 12 +
            (totalPercent /
              data.length -
              80)
        )
    )
  );

  const suggestion =
    overloaded.length &&
    available.length
      ? `Move work from ${overloaded[0].name} to ${available[0].name}`
      : "Team load balanced";

  return (
    <div className="space-y-6">

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-5">

        <Card
          title="Overloaded"
          value={overloaded.length}
          red
        />

        <Card
          title="Available"
          value={available.length}
          green
        />

        <Card
          title="Balanced"
          value={balanced.length}
        />

        <Card
          title="Sprint Health"
          value={`${sprintHealth}%`}
          blue
        />

      </div>

      {/* AI Recommendation */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          AI Recommendation
        </h3>

        <p className="text-gray-700">
          {suggestion}
        </p>
      </div>

      {/* Team Capacity */}
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
                    user.status ===
                    "Overloaded"
                      ? "text-red-600 font-semibold"
                      : user.status ===
                        "Available"
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
                    user.status ===
                    "Overloaded"
                      ? "bg-red-500 h-3 rounded"
                      : user.status ===
                        "Available"
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
                {user.allocated}h /{" "}
                {user.capacity}h
                allocated (
                {user.percent}%)
              </p>

            </div>
          ))}

        </div>
      </div>

      {/* Sprint Notes */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-4">
          Sprint Notes
        </h3>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">

          {overloaded.map((x) => (
            <li key={x.id}>
              {x.name} needs load reduction
            </li>
          ))}

          {available.map((x) => (
            <li key={x.id}>
              {x.name} can take extra tasks
            </li>
          ))}

          {balanced.map((x) => (
            <li key={x.id}>
              {x.name} is at balanced load
            </li>
          ))}

        </ul>
      </div>

    </div>
  );
}

function Card({
  title,
  value,
  red,
  green,
  blue,
}) {
  let color = "text-black";

  if (red) color = "text-red-600";
  if (green)
    color = "text-green-600";
  if (blue) color = "text-blue-600";

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">
        {title}
      </p>

      <h2
        className={`text-3xl font-bold ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}