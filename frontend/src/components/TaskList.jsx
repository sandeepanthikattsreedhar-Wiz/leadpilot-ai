export default function TaskList({ tasks, updateStatus, deleteTask }) {
  const color = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Task List</h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-500">Owner: {task.owner}</p>
              <p className="text-sm">Status: {task.status}</p>
            </div>

            <div className="flex gap-2 items-center">
              <span className={`px-3 py-1 rounded ${color[task.priority]}`}>
                {task.priority}
              </span>

              <button
                onClick={() => updateStatus(task.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Done
              </button>

              <button
                onClick={() => deleteTask(task.id)}
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