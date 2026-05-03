import { useEffect, useState } from "react";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    time: "",
    owner: "",
    agenda: "",
  });

  const [notesInput, setNotesInput] = useState({});

  useEffect(() => {
    loadMeetings();

    const timer = setInterval(loadMeetings, 5000);
    return () => clearInterval(timer);
  }, []);

  const loadMeetings = async () => {
    const res = await fetch("http://127.0.0.1:8000/meetings");
    const data = await res.json();
    setMeetings(data);
  };

  // -------------------------
  // ADD MEETING
  // -------------------------
  const addMeeting = async () => {
    if (!form.title || !form.time) return;

    await fetch("http://127.0.0.1:8000/meetings", {
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

  // -------------------------
  // SAVE TODAY NOTES
  // -------------------------
  const saveNotes = async (meetingId) => {
  const notes = notesInput[meetingId];

  console.log("Saving:", meetingId, notes); // 👈 ADD THIS

  await fetch(
    `http://127.0.0.1:8000/meeting-log/${meetingId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes }),
    }
  );

  loadMeetings();
};

  return (
    <div className="space-y-6">

      {/* CREATE MEETING */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Create Meeting
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

      {/* MEETINGS LIST */}
      <div className="space-y-6">

        {meetings.map((meeting) => (

          <div
            key={meeting.id}
            className="bg-white p-5 rounded-xl shadow space-y-4"
          >

            {/* HEADER */}
            <div className="flex justify-between">

              <div>
                <h3 className="text-lg font-semibold">
                  {meeting.title}
                </h3>

                <p className="text-gray-500 text-sm">
                  {meeting.time} | {meeting.owner}
                </p>

                <p className="mt-2 text-sm">
                  Agenda: {meeting.agenda}
                </p>
              </div>

            </div>

            {/* ADD TODAY NOTES */}
            <div>
              <h4 className="font-medium mb-2">
                Add Today Notes
              </h4>

              <textarea
                className="w-full border p-3 rounded"
                rows="3"
                placeholder="Enter today's MOM..."
                value={notesInput[meeting.id] || ""}
                onChange={(e) =>
                  setNotesInput({
                    ...notesInput,
                    [meeting.id]: e.target.value,
                  })
                }
              />

              <button
                onClick={() => saveNotes(meeting.id)}
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
              >
                Save Notes
              </button>
            </div>

            {/* HISTORY */}
            <div>
              <h4 className="font-medium mb-2">
                Daily History
              </h4>

              {meeting.logs && meeting.logs.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No updates yet
                </p>
              )}

              {meeting.logs &&
                meeting.logs
                  .slice()
                  .reverse()
                  .map((log) => (
                    <div
                      key={log.id}
                      className="border rounded p-3 mb-2"
                    >
                      <p className="text-xs text-gray-500">
                        {log.date}
                      </p>

                      <p className="mt-1">
                        {log.notes}
                      </p>
                    </div>
                  ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}