import { useEffect, useMemo, useState } from "react";

export default function CapacityPage() {
  const [team, setTeam] = useState([]);
  const [summary, setSummary] = useState({});
  const [deadlines, setDeadlines] = useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [balanceMessage, setBalanceMessage] =
    useState("");

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
        `${import.meta.env.VITE_API_URL}/capacity-data`
      );

      const data = await res.json();

      setTeam(data);
      const summaryRes = await fetch(`${import.meta.env.VITE_API_URL}/capacity-summary`);

      const summaryData =
        await summaryRes.json();

      setSummary(summaryData);
      const deadlineRes = await fetch(`${import.meta.env.VITE_API_URL}/upcoming-deadlines`);

      setDeadlines(
        await deadlineRes.json()
      );
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

      if (percent >= 100) {
        status = "Overloaded";
      } else if (percent < 60) {
        status = "Available";
      }

      let burnout = "Low";

      if (percent >= 100) burnout = "High";
      else if (percent >= 75)
        burnout = "Medium";

      return {
        ...x,
        percent,
        status,
        burnout,
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

  const workforceHealth = Math.max(
    0,
    Math.min(
      100,
      100 -
      overloaded.length * 15 -
      Math.round(
        data.reduce(
          (sum, x) => sum + x.percent,
          0
        ) / data.length - 75
      )
    )
  );

  const autoBalanceTeam = () => {
    const overloadedUsers = data.filter(
      (x) => x.status === "Overloaded"
    );

    const availableUsers = data.filter(
      (x) => x.status === "Available"
    );

    if (
      overloadedUsers.length === 0 ||
      availableUsers.length === 0
    ) {
      setBalanceMessage(
        "AI detected balanced workload across team."
      );

      return;
    }

    const from = overloadedUsers[0];
    const to = availableUsers[0];

    setBalanceMessage(
      `AI recommends moving tasks from ${from.name} to ${to.name}`
    );
  };

  const aiInsights = [];

  if (overloaded.length > 0) {
    aiInsights.push(
      `${overloaded[0].name} is overloaded and may impact sprint delivery.`
    );
  }

  if (available.length > 0) {
    aiInsights.push(
      `${available[0].name} is available for additional assignments.`
    );
  }

  if (workforceHealth > 80) {
    aiInsights.push(
      "Team delivery health is stable and balanced."
    );
  } else {
    aiInsights.push(
      "AI detected workload imbalance across engineers."
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-700 text-white shadow-2xl">

        <div className="flex justify-between items-center flex-wrap gap-6">

          <div>
            <h1 className="text-4xl font-bold">
              Workforce Intelligence
            </h1>

            <p className="mt-2 text-purple-100">
              AI Delivery Intelligence Suite
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/20">
            <p className="text-sm text-purple-100">
              Workforce Health
            </p>

            <h2 className="text-4xl font-bold">
              {workforceHealth}%
            </h2>
          </div>

        </div>

      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-5">

        <KpiCard
          title="Total Tasks"
          value={summary.total_tasks}
        />

        <KpiCard
          title="Active"
          value={summary.active_tasks}
        />

        <KpiCard
          title="High Risk"
          value={summary.high_risk_tasks}
        />

        <KpiCard
          title="Completed"
          value={summary.completed_tasks}
        />

        <KpiCard
          title="Delivery Health"
          value={`${summary.delivery_health}%`}
        />

      </div>
      <div className="bg-white rounded-3xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Upcoming Deadlines
        </h2>

        {deadlines.map(d => (

          <div
            key={d.task}
            className="flex justify-between py-2 border-b"
          >

            <span>{d.task}</span>

            <span>{d.owner}</span>

            <span>
              {d.days} day(s)
            </span>

          </div>

        ))}
      </div>
      {/* AI INSIGHTS */}
      <div className="bg-white/70 backdrop-blur-xl border border-purple-100 rounded-3xl shadow-xl p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">
            🧠
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              AI Workforce Insights
            </h2>

            <p className="text-sm text-slate-500">
              Intelligent delivery recommendations
            </p>
          </div>

        </div>

        <div className="space-y-4">

          {aiInsights.map((x, i) => (
            <div
              key={i}
              className="bg-purple-50 border border-purple-100 rounded-2xl p-4"
            >
              <p className="text-slate-700">
                {x}
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* TEAM */}
      <div className="bg-white/70 backdrop-blur-xl border border-purple-100 rounded-3xl shadow-xl p-6">

        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Team Capacity Matrix
            </h2>

            <p className="text-slate-500">
              Real-time engineer utilization tracking
            </p>
          </div>

          <button
            onClick={autoBalanceTeam}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            Auto Balance Team
          </button>

        </div>

        {balanceMessage && (
          <div className="mb-6 bg-purple-50 border border-purple-200 text-purple-700 rounded-2xl p-4">
            🧠 {balanceMessage}
          </div>
        )}

        <div className="space-y-5">

          {data.map((user) => (
            <EngineerCard
              key={user.id}
              user={user}
              setSelectedUser={
                setSelectedUser
              }
              setShowModal={
                setShowModal
              }
            />
          ))}

        </div>

      </div>

      {/* MODAL */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[500px]">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-2xl font-bold">
                  {selectedUser.name}
                </h2>

                <p className="text-slate-500">
                  {selectedUser.skill}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-slate-500 hover:text-black"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">
                  Utilization
                </p>

                <h3 className="text-3xl font-bold">
                  {selectedUser.percent}%
                </h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">
                  Burnout Risk
                </p>

                <h3 className="text-2xl font-bold">
                  {selectedUser.burnout}
                </h3>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                <p className="font-semibold text-purple-700">
                  AI Recommendation
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  {selectedUser.status ===
                    "Overloaded"
                    ? "Reduce workload and redistribute tasks."
                    : selectedUser.status ===
                      "Available"
                      ? "Can take additional project assignments."
                      : "Current workload is balanced."}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* KPI CARD */
function KpiCard({
  title,
  value,
  color,
}) {
  const map = {
    red: "text-red-600",
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-purple-100 rounded-3xl shadow-xl p-6">

      <p className="text-slate-500">
        {title}
      </p>

      <h2
        className={`text-4xl font-bold mt-2 ${map[color]}`}
      >
        {value}
      </h2>

    </div>
  );
}

/* ENGINEER CARD */
function EngineerCard({
  user,
  setSelectedUser,
  setShowModal,
}) {
  const barColor =
    user.status === "Overloaded"
      ? "from-red-500 to-rose-500"
      : user.status === "Available"
        ? "from-green-500 to-emerald-500"
        : "from-blue-500 to-indigo-500";

  return (
    <div className="border border-purple-100 rounded-3xl p-5 bg-gradient-to-r from-white to-purple-50">

      <div className="flex justify-between items-center flex-wrap gap-4">

        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {user.name}
          </h3>

          <p className="text-slate-500">
            {user.skill}
          </p>
        </div>

        <div className="text-right">

          <div
            className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${user.status ===
              "Overloaded"
              ? "bg-red-100 text-red-700"
              : user.status ===
                "Available"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
              }`}
          >
            {user.status}
          </div>

          <p className="text-sm mt-2 text-slate-500">
            Burnout Risk: {user.burnout}
          </p>

        </div>

      </div>

      <div className="mt-5">

        <div className="flex justify-between text-sm mb-2">
          <span>Utilization</span>

          <span>
            {user.percent}%
          </span>
        </div>

        <div className="h-4 bg-slate-200 rounded-full overflow-hidden">

          <div
            className={`h-4 rounded-full bg-gradient-to-r ${barColor}`}
            style={{
              width: `${Math.min(
                user.percent,
                100
              )}%`,
            }}
          ></div>

        </div>

      </div>

      <div className="mt-5 flex justify-between items-center flex-wrap gap-3">

        <div className="text-sm text-slate-600">
          {user.allocated}h allocated
          out of {user.capacity}h
          capacity
        </div>

        <button
          onClick={() => {
            setSelectedUser(user);
            setShowModal(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
        >
          View Details
        </button>

      </div>

    </div>
  );
}