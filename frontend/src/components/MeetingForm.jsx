import { useState } from "react";

export default function MeetingForm({ addMeeting }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [agenda, setAgenda] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!title || !date || !time) return;

    addMeeting({
      id: Date.now(),
      title,
      date,
      time,
      attendees,
      agenda,
      status: "Scheduled",
    });

    setTitle("");
    setDate("");
    setTime("");
    setAttendees("");
    setAgenda("");
  };

  return (
    <form onSubmit={submit} className="bg-white p-5 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Schedule Meeting</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Meeting Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="time"
          className="border p-2 rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <input
        className="w-full border p-2 rounded"
        placeholder="Attendees"
        value={attendees}
        onChange={(e) => setAttendees(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Agenda"
        rows="3"
        value={agenda}
        onChange={(e) => setAgenda(e.target.value)}
      />

      <button className="bg-slate-900 text-white px-4 py-2 rounded">
        Add Meeting
      </button>
    </form>
  );
}