export default function MeetingList({
  meetings,
  completeMeeting,
  deleteMeeting,
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Meeting Schedule</h2>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="border rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{meeting.title}</h3>

              <span
                className={`px-3 py-1 rounded text-sm ${
                  meeting.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {meeting.status}
              </span>
            </div>

            <p className="text-gray-600">
              {meeting.date} | {meeting.time}
            </p>

            <p className="text-gray-600">
              Attendees: {meeting.attendees}
            </p>

            <p className="text-gray-600">
              Agenda: {meeting.agenda}
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => completeMeeting(meeting.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Done
              </button>

              <button
                onClick={() => deleteMeeting(meeting.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}