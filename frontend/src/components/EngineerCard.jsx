export default function EngineerCard({ engineer, toggleAvailability }) {
  const busy = engineer.tasks >= 4;

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{engineer.name}</h3>

        <span
          className={`px-3 py-1 rounded text-sm ${
            engineer.available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {engineer.available ? "Available" : "Busy"}
        </span>
      </div>

      <p className="text-gray-600">Skill: {engineer.skill}</p>
      <p className="text-gray-600">Project: {engineer.project}</p>
      <p className="text-gray-600">Open Tasks: {engineer.tasks}</p>

      {busy && (
        <p className="text-red-600 text-sm font-medium">
          Overloaded Resource
        </p>
      )}

      <button
        onClick={() => toggleAvailability(engineer.id)}
        className="bg-slate-900 text-white px-4 py-2 rounded"
      >
        Toggle Status
      </button>
    </div>
  );
}