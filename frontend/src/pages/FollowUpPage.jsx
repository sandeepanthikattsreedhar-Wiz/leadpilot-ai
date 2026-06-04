
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Clock3,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Save,
  Activity,
  Sparkles,
} from "lucide-react";

export default function FollowUpPage() {

  const [items, setItems] = useState([]);
  const [expanded, setExpanded] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [remarksMap, setRemarksMap] =
    useState({});

  const [statusMap, setStatusMap] =
    useState({});

  const [historyMap, setHistoryMap] =
    useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/followup-data`
    );

    const data = await res.json();

    setItems(data);
  };

  const filtered = useMemo(() => {

    return items.filter((x) =>
      x.task
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  }, [items, search]);

  const loadHistory = async (id) => {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/followup-history/${id}`
    );

    const data = await res.json();

    setHistoryMap(prev => ({
      ...prev,
      [id]: data,
    }));
  };

  const saveFollowup = async (id) => {

    await fetch(
      `${import.meta.env.VITE_API_URL}/followup-log/${id}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status:
            statusMap[id] ||
            "Awaiting Response",

          remarks:
            remarksMap[id] || "",
        }),
      }
    );

    loadHistory(id);
    loadData();

    setRemarksMap({
      ...remarksMap,
      [id]: "",
    });
  };

  const todayCritical =
    filtered.filter(
      (x) =>
        x.days <= 1 ||
        x.status === "Blocked"
    ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8 space-y-8">

      {/* HERO */}

      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">

        <div className="absolute top-0 right-0 text-[180px] opacity-10 font-bold">
          AI
        </div>

        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-4">

            <Sparkles size={32} />

            <h1 className="text-4xl font-bold">
              Follow-Up Intelligence Hub
            </h1>

          </div>

          <p className="text-white/80 max-w-2xl">
            AI-powered tracking for
            delivery monitoring,
            escalations, pending
            responses, and execution
            health.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

            <HeroCard
              title="Active Follow Ups"
              value={filtered.length}
            />

            <HeroCard
              title="Critical Today"
              value={todayCritical}
            />

            <HeroCard
              title="AI Monitoring"
              value="Enabled"
            />

            <HeroCard
              title="Escalation Risk"
              value={
                todayCritical >= 5
                  ? "High"
                  : "Moderate"
              }
            />

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <input
        placeholder="Search task..."
        className="w-full rounded-2xl border border-gray-200 p-4 bg-white shadow"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* TASKS */}

      <div className="space-y-5">

        {filtered.map((item) => {

          const isOpen =
            expanded === item.id;

          return (

            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
            >

              {/* HEADER */}

              <div
                onClick={() => {

                  setExpanded(
                    isOpen
                      ? null
                      : item.id
                  );

                  loadHistory(item.id);
                }}

                className="p-6 flex justify-between items-center cursor-pointer"
              >

                <div>

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.criticality ===
                          "High"
                          ? "bg-red-100 text-red-600"
                          : item.criticality ===
                            "Medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                    >

                      <AlertTriangle />

                    </div>

                    <div>

                      <h2 className="text-xl font-bold">
                        {item.task}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {item.owner}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-5">

                  <div className="text-right">

                    <p className="text-sm font-bold">
                      Score: {item.score}
                    </p>

                    <p className="text-xs text-gray-500">
                      Due in {item.days} day(s)
                    </p>

                  </div>

                  {isOpen ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}

                </div>

              </div>

              {/* BODY */}

              <div
                className={
                  isOpen
                    ? "max-h-screen opacity-100 transition-all duration-500 p-6 pt-0"
                    : "max-h-0 opacity-0 overflow-hidden transition-all duration-500"
                }
              >

                {/* AI */}

                <div className="bg-slate-50 rounded-2xl p-5 border mb-5">

                  <div className="flex items-center gap-2 mb-2">

                    <Activity
                      size={18}
                      className="text-indigo-600"
                    />

                    <h3 className="font-semibold">
                      AI Recommendation
                    </h3>

                  </div>

                  <p className="text-gray-600">
                    {item.action}
                  </p>

                </div>

                {/* STATUS */}

                <div className="grid md:grid-cols-2 gap-5">

                  <select
                    className="border rounded-2xl p-4"

                    value={
                      statusMap[item.id] ||
                      ""
                    }

                    onChange={(e) =>
                      setStatusMap({
                        ...statusMap,
                        [item.id]:
                          e.target.value,
                      })
                    }
                  >

                    <option>
                      Awaiting Response
                    </option>

                    <option>
                      Client Responded
                    </option>

                    <option>
                      Fix In Progress
                    </option>

                    <option>
                      Waiting For QA
                    </option>

                    <option>
                      Escalated
                    </option>

                    <option>
                      Closed
                    </option>

                  </select>

                  <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4">

                    <Clock3 size={18} />

                    <p className="text-sm">
                      Priority:
                      <span className="font-bold ml-2">
                        {item.priority}
                      </span>
                    </p>

                  </div>

                </div>

                {/* REMARKS */}

                <textarea
                  rows="4"

                  placeholder="Add follow-up remarks..."

                  value={
                    remarksMap[item.id] ||
                    ""
                  }

                  onChange={(e) =>
                    setRemarksMap({
                      ...remarksMap,
                      [item.id]:
                        e.target.value,
                    })
                  }

                  className="w-full mt-5 border rounded-2xl p-4"
                />

                {/* SAVE */}

                <button
                  onClick={() =>
                    saveFollowup(
                      item.id
                    )
                  }

                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2"
                >

                  <Save size={18} />

                  Save Follow Up

                </button>

                {/* HISTORY */}

                <div className="mt-8">

                  <div className="flex items-center gap-2 mb-4">

                    <MessageSquare
                      size={18}
                    />

                    <h3 className="text-lg font-bold">
                      Follow-Up History
                    </h3>

                  </div>

                  <div className="space-y-3">

                    {(historyMap[
                      item.id
                    ] || []).map((h) => (

                      <div
                        key={h.id}
                        className="bg-slate-50 border rounded-2xl p-4"
                      >

                        <div className="flex justify-between mb-2">

                          <span className="font-semibold text-indigo-600">
                            {h.status}
                          </span>

                          <span className="text-sm text-gray-500">
                            {
                              h.created_at
                            }
                          </span>

                        </div>

                        <p className="text-gray-600">
                          {h.remarks}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

function HeroCard({
  title,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">

      <p className="text-white/70 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-1">
        {value}
      </h2>

    </div>
  );
}

