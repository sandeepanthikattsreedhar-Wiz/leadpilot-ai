export default function EngineerCard({ engineer }) {
  const {
    name,
    tasks,
    pending,
    progress,
    completed,
    available
  } = engineer;

  const busy = tasks >= 4;

  const badgeStyle = available
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";

  const utilization = Math.min(tasks * 25, 100);

  return (
<div className="glass card-hover rounded-2xl p-5 space-y-4">

      {/* Header */}
  <div className="flex justify-between items-center">

        <div>
          <h3 className="text-xl font-bold">
            {name}
          </h3>

           <div>
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-sm text-slate-500">
        Implementation Engineer
      </p>
    </div>
    <span className={`px-3 py-1 rounded-full text-sm ${
      available
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}>
      {available ? "Available" : "Busy"}
    </span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyle}`}
        >
          {available ? "Available" : "Busy"}
        </span>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
    <div className="bg-white/50 p-3 rounded-xl">
      <p className="text-sm text-gray-500">Tasks</p>
      <h2 className="text-2xl font-bold">{tasks}</h2>
    </div>

          <h2 className="text-3xl font-bold mt-1">
            {tasks}
          </h2>
        </div>

        <div className="bg-white/50 p-3 rounded-xl">
      <p className="text-sm text-gray-500">Completed</p>
      <h2 className="text-2xl font-bold text-green-600">
        {completed}
      </h2>
    </div>

      

      {/* Breakdown */}
      <div className="space-y-3">

        <Row
          label="Yet to Start"
          value={pending}
          color="bg-red-500"
        />

        <Row
          label="In Progress"
          value={progress}
          color="bg-amber-500"
        />

        <Row
          label="Completed"
          value={completed}
          color="bg-green-500"
        />

      </div>

      {/* Overload Alert */}
      {busy && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-xl font-medium">
          Overloaded Resource
        </div>
      )}

      {/* Utilization */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">
            Utilization
          </span>

          <span className="font-semibold">
            {utilization}%
          </span>
        </div>

        <div className="h-3 bg-slate-200 rounded-full">
          <div
            className="h-3 rounded-full bg-blue-600"
            style={{
              width: `${utilization}%`
            }}
          ></div>
        </div>
      </div>

    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2 bg-slate-200 rounded-full">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{
            width: `${Math.min(value * 25, 100)}%`
          }}
        ></div>
      </div>
    </div>
  );
}