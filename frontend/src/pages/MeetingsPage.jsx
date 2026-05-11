import { useEffect, useState } from "react";

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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/meetings`);
    const data = await res.json();
    setMeetings(data.meetings || data);
  };

  // ---------------- ADD ----------------
  const addMeeting = async () => {
    if (!form.title || !form.time) return;

    await fetch(`${import.meta.env.VITE_API_URL}/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

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
    if (editingId) return; // prevent collapse while editing
    setExpandedId(expandedId === id ? null : id);
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
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const updateMeeting = async (id) => {
    await fetch("http://127.0.0.1:8000/meetings/${id}", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });

    setEditingId(null);
    loadMeetings();
  };

  // ---------------- DELETE ----------------
  const deleteMeeting = async (id) => {
    if (!confirm("Delete this meeting?")) return;

    await fetch("${import.meta.env.VITE_API_URL}/meetings/${id}", {
      method: "DELETE",
    });

    loadMeetings();
  };

  // ---------------- NOTES ----------------
  const saveNotes = async (id) => {
    await fetch("${import.meta.env.VITE_API_URL}/meetings/${id}/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: notesMap[id],
      }),
    });

    loadMeetings();
  };

  return (
    <div className="space-y-6">

      {/* ADD MEETING */}
      <div className="glass p-5 rounded-2xl space-y-4">
        <h2 className="text-xl font-semibold">
          Schedule Meeting
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Meeting Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Time"
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Owner"
            value={form.owner}
            onChange={(e) =>
              setForm({ ...form, owner: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Agenda"
            value={form.agenda}
            onChange={(e) =>
              setForm({ ...form, agenda: e.target.value })
            }
          />
        </div>

        <button onClick={addMeeting} className="btn-primary">
          Add Meeting
        </button>
      </div>

      {/* MEETING LIST */}
      <div className="space-y-4">
        {meetings.map((m) => {
          const isOpen = expandedId === m.id;
          const isEditing = editingId === m.id;

          return (
            <div
              key={m.id}
              className="glass card-hover rounded-2xl overflow-hidden"
            >
              {/* HEADER */}
              <div
                onClick={() => toggleExpand(m.id)}
                className="p-5 flex justify-between items-center cursor-pointer"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {m.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {m.time} | {m.owner}
                  </p>
                </div>

                <span className="text-xl">
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>

              {/* CONTENT */}
              <div
                className={"transition-all duration-300 " +
                  (isOpen
                    ? "max-h-[600px] p-5 pt-0 opacity-100"
                    : "max-h-0 overflow-hidden opacity-0"
                  )
                }
              >
                {isEditing ? (
                  <>
                    <input
                      className="input w-full mb-2"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          title: e.target.value,
                        })
                      }
                    />

                    <input
                      className="input w-full mb-2"
                      value={editForm.time}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          time: e.target.value,
                        })
                      }
                    />

                    <input
                      className="input w-full mb-2"
                      value={editForm.owner}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          owner: e.target.value,
                        })
                      }
                    />

                    <input
                      className="input w-full mb-2"
                      value={editForm.agenda}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          agenda: e.target.value,
                        })
                      }
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => updateMeeting(m.id)}
                        className="btn-primary"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="bg-gray-300 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Agenda: {m.agenda}
                    </p>

                    <textarea
                      className="input w-full"
                      rows="4"
                      value={notesMap[m.id] ?? m.notes ?? ""}
                      onChange={(e) =>
                        setNotesMap({
                          ...notesMap,
                          [m.id]: e.target.value,
                        })
                      }
                    />

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => saveNotes(m.id)}
                        className="btn-primary"
                      >
                        Save Notes
                      </button>

                      <button
                        onClick={() => startEdit(m)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMeeting(m.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
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