import { useEffect, useState } from "react";
import {
  Mic,
  Plus,
  CalendarDays,
  User,
  FileText,
  Pencil,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    time: "",
    owner: "",
    agenda: "",
  });

  const [editForm, setEditForm] = useState({});
  const [notesMap, setNotesMap] = useState({});

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/meetings`
      );

      const data = await res.json();

      setMeetings(data.meetings || data);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- ADD ----------------
  const addMeeting = async () => {
    if (!form.title || !form.time) return;

    await fetch(
      `${import.meta.env.VITE_API_URL}/meetings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    setForm({
      title: "",
      time: "",
      owner: "",
      agenda: "",
    });

    loadMeetings();
  };

  // ---------------- TOGGLE ----------------
  const toggleExpand = (id) => {
    if (editingId) return;

    setExpandedId(
      expandedId === id ? null : id
    );
  };

  // ---------------- EDIT ----------------
  const startEdit = (m) => {
    setEditingId(m.id);

    setExpandedId(m.id);

    setEditForm({
      title: m.title,
      time: m.time,
      owner: m.owner,
      agenda: m.agenda,
      notes: m.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const updateMeeting = async (id) => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/meetings/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(editForm),
      }
    );

    setEditingId(null);

    loadMeetings();
  };

  // ---------------- DELETE ----------------
  const deleteMeeting = async (id) => {
    if (
      !confirm("Delete this meeting?")
    )
      return;

    await fetch(
      `${import.meta.env.VITE_API_URL}/meetings/${id}`,
      {
        method: "DELETE",
      }
    );

    loadMeetings();
  };

  // ---------------- NOTES ----------------
  const saveNotes = async (id) => {
    
    try
    {
      const response=await fetch(
      `${import.meta.env.VITE_API_URL}/meetings/${id}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          notes:
            notesMap[id] || "",
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to save");
    }

    await loadMeetings();
    alert("Notes saved successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to save notes");
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">

      {/* TOP HERO */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-6 md:p-10 shadow-2xl text-white mb-8 relative overflow-hidden">

        <div className="absolute right-0 top-0 opacity-10 text-[200px] font-bold">
          AI
        </div>

        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={30} />
            <h1 className="text-3xl md:text-5xl font-bold">
              Meeting Intelligence
            </h1>
          </div>

          <p className="text-white/80 max-w-2xl text-sm md:text-base">
            AI-powered collaboration hub
            with smart summaries,
            searchable notes, meeting
            memory, and action tracking.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

            <TopCard
              title="Meetings"
              value={meetings.length}
            />

            <TopCard
              title="AI Ready"
              value="Enabled"
            />

            <TopCard
              title="Transcripts"
              value="Live"
            />

            <TopCard
              title="Summaries"
              value="Auto"
            />

          </div>
        </div>
      </div>

      {/* ADD MEETING */}
      <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 mb-8 border border-gray-100">

        <div className="flex items-center gap-3 mb-6">
          <Plus className="text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-800">
            Schedule New Meeting
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

          <InputField
            icon={<FileText size={18} />}
            placeholder="Meeting Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <InputField
            icon={
              <CalendarDays size={18} />
            }
            placeholder="Meeting Time"
            value={form.time}
            onChange={(e) =>
              setForm({
                ...form,
                time: e.target.value,
              })
            }
          />

          <InputField
            icon={<User size={18} />}
            placeholder="Owner"
            value={form.owner}
            onChange={(e) =>
              setForm({
                ...form,
                owner: e.target.value,
              })
            }
          />

          <InputField
            icon={<FileText size={18} />}
            placeholder="Agenda"
            value={form.agenda}
            onChange={(e) =>
              setForm({
                ...form,
                agenda: e.target.value,
              })
            }
          />

        </div>

        <div className="flex flex-wrap gap-4 mt-6">

          <button
            onClick={addMeeting}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} />
            Add Meeting
          </button>

          <button
            className="bg-slate-900 hover:bg-black transition text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg"
          >
            <Mic size={18} />
            Start AI Listening
          </button>

        </div>

      </div>

      {/* MEETINGS */}
      <div className="space-y-5">

        {meetings.map((m) => {

          const isOpen =
            expandedId === m.id;

          const isEditing =
            editingId === m.id;

          return (
            <div
              key={m.id}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition"
            >

              {/* HEADER */}
              <div
                onClick={() =>
                  toggleExpand(m.id)
                }
                className="p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer"
              >

                <div>

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                      <CalendarDays className="text-indigo-600" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {m.title}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {m.time} •{" "}
                        {m.owner}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    AI Enabled
                  </span>

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
                    ? "max-h-screen opacity-100 p-6 pt-0 transition-all duration-500"
                    : "max-h-0 opacity-0 overflow-hidden transition-all duration-500"
                }
              >

                {isEditing ? (
                  <div className="space-y-4">

                    <InputField
                      placeholder="Title"
                      value={
                        editForm.title
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          title:
                            e.target.value,
                        })
                      }
                    />

                    <InputField
                      placeholder="Time"
                      value={
                        editForm.time
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          time:
                            e.target.value,
                        })
                      }
                    />

                    <InputField
                      placeholder="Owner"
                      value={
                        editForm.owner
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          owner:
                            e.target.value,
                        })
                      }
                    />

                    <InputField
                      placeholder="Agenda"
                      value={
                        editForm.agenda
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          agenda:
                            e.target.value,
                        })
                      }
                    />

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          updateMeeting(
                            m.id
                          )
                        }
                        className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save
                      </button>

                      <button
                        onClick={
                          cancelEdit
                        }
                        className="bg-gray-300 px-5 py-2 rounded-xl"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>
                ) : (
                  <>

                    {/* AI SECTION */}
                    <div className="grid lg:grid-cols-3 gap-5 mb-6">

                      <InfoCard
                        title="Agenda"
                        value={
                          m.agenda ||
                          "No agenda"
                        }
                      />

                      <InfoCard
                        title="AI Summary"
                        value={
                          m.ai_summary ||
                          "AI summary will appear here"
                        }
                      />

                      <InfoCard
                        title="Action Items"
                        value={
                          m.action_items ||
                          "No actions extracted yet"
                        }
                      />

                    </div>

                    {/* NOTES */}
                    <div>

                      <label className="font-semibold text-slate-700">
                        Meeting Notes
                      </label>

                      <textarea
                        rows="5"
                        value={
                          notesMap[
                            m.id
                          ] ??
                          m.notes ??
                          ""
                        }
                        onChange={(e) =>
                          setNotesMap({
                            ...notesMap,
                            [m.id]:
                              e.target
                                .value,
                          })
                        }
                        className="w-full mt-2 border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      />

                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-wrap gap-3 mt-5">

                      <button
                        onClick={() =>
                          saveNotes(m.id)
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save Notes
                      </button>

                      <button
                        onClick={() =>
                          startEdit(m)
                        }
                        className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteMeeting(
                            m.id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </>
                )}

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function TopCard({
  title,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
      <p className="text-white/70 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-1">
        {value}
      </h2>
    </div>
  );
}

function InfoCard({
  title,
  value,
}) {
  return (
    <div className="bg-slate-50 border border-gray-100 rounded-2xl p-5">
      <p className="text-gray-500 text-sm mb-2">
        {title}
      </p>

      <p className="text-slate-700 leading-7">
        {value}
      </p>
    </div>
  );
}

function InputField({
  icon,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500">

      <div className="text-gray-400">
        {icon}
      </div>

      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-transparent w-full outline-none"
      />

    </div>
  );
}