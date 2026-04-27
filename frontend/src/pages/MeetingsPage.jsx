import { useState } from "react";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Client Progress Review",
      time: "1:00 PM",
      owner: "Sandeep",
      agenda: "Review milestones and risks",
      notes: "",
      score: 88,
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    time: "",
    owner: "",
    agenda: "",
  });

  const addMeeting = () => {
    if (!form.title || !form.time) return;

    setMeetings([
      ...meetings,
      {
        id: Date.now(),
        ...form,
        notes: "",
        score: 80,
      },
    ]);

    setForm({
      title: "",
      time: "",
      owner: "",
      agenda: "",
    });
  };

  const updateNotes = (id, value) => {
    setMeetings(
      meetings.map((m) =>
        m.id === id ? { ...m, notes: value } : m
      )
    );
  };

  const getActions = (notes) => {
    if (!notes) return [];

    return notes
      .split(".")
      .map((x) => x.trim())
      .filter(
        (x) =>
          x.toLowerCase().includes("need") ||
          x.toLowerCase().includes("send") ||
          x.toLowerCase().includes("share") ||
          x.toLowerCase().includes("complete") ||
          x.toLowerCase().includes("follow")
      );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-4">
          Schedule Meeting
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Meeting Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Time"
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Owner"
            value={form.owner}
            onChange={(e) =>
              setForm({ ...form, owner: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Agenda"
            value={form.agenda}
            onChange={(e) =>
              setForm({ ...form, agenda: e.target.value })
            }
          />
        </div>

        <button
          onClick={addMeeting}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
        >
          Add Meeting
        </button>
      </div>

      <div className="space-y-5">
        {meetings.map((meeting) => {
          const actions = getActions(meeting.notes);

          return (
            <div
              key={meeting.id}
              className="bg-white rounded-xl shadow p-5 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {meeting.title}
                  </h3>

                  <p className="text-gray-500">
                    {meeting.time} | Owner: {meeting.owner}
                  </p>

                  <p className="mt-2 text-sm">
                    Agenda: {meeting.agenda}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Score
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {meeting.score}%
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  MOM Notes
                </h4>

                <textarea
                  rows="4"
                  className="w-full border rounded p-3"
                  placeholder="Enter meeting notes..."
                  value={meeting.notes}
                  onChange={(e) =>
                    updateNotes(
                      meeting.id,
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  Action Items
                </h4>

                <ul className="list-disc pl-5 space-y-1">
                  {actions.length === 0 ? (
                    <li>No actions detected</li>
                  ) : (
                    actions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}