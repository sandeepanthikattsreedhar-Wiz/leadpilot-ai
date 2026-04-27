export default function HomePage() {
  const priorities = [
    "Follow up with Rahul on UAT fix",
    "Review client escalation from Alpha ERP",
    "Approve Meena resource request",
    "Prepare 3 PM steering meeting notes",
  ];

  const meetings = [
    { time: "10:00 AM", title: "Internal Standup" },
    { time: "1:00 PM", title: "Client Progress Review" },
    { time: "3:00 PM", title: "Management Steering Call" },
  ];

  const team = [
    { name: "Rahul", status: "Busy" },
    { name: "Meena", status: "Available" },
    { name: "Arjun", status: "Busy" },
    { name: "Divya", status: "Overloaded" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Pending Tasks</p>
          <h2 className="text-3xl font-bold">14</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Meetings Today</p>
          <h2 className="text-3xl font-bold">3</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Critical Alerts</p>
          <h2 className="text-3xl font-bold text-red-600">2</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Lead Score</p>
          <h2 className="text-3xl font-bold text-green-600">92%</h2>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-4">
            AI Priorities Today
          </h3>

          <div className="space-y-3">
            {priorities.map((item, i) => (
              <div
                key={i}
                className="border-l-4 border-blue-500 pl-3 py-2"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-4">
            Upcoming Meetings
          </h3>

          <div className="space-y-3">
            {meetings.map((m, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <span>{m.title}</span>
                <span className="text-gray-500">
                  {m.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-4">
            Team Availability
          </h3>

          <div className="space-y-3">
            {team.map((member, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <span>{member.name}</span>

                <span
                  className={
                    member.status === "Available"
                      ? "text-green-600"
                      : member.status === "Overloaded"
                      ? "text-red-600"
                      : "text-orange-600"
                  }
                >
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-4">
            AI Executive Summary
          </h3>

          <p className="text-gray-700 leading-7">
            Team is operating at good capacity.
            Two delayed items need follow-up.
            One engineer is overloaded.
            Today focus should be client review
            and risk closures.
          </p>
        </div>
      </div>
    </div>
  );
}