import { useEffect, useState } from "react";

function getTimeAgo(dateString) {
  if (!dateString) return "Not updated";

  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour ago`;
  if (days === 1) return "Yesterday";

  return `${days} days ago`;
}

export default function Tasks() {
  const emptyForm = {
    task_title: "",
    task_name: "",
    assigned_to: "Rakshitha",
    start_date: "",
    end_date: "",
    remarks: "",
    status: "Yet to Start",
    priority: "Medium",
  };

  const [form, setForm] = useState(emptyForm);
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterOwner, setFilterOwner] = useState("");

  useEffect(() => {
    loadTasks();

    const timer = setInterval(() => {
      loadTasks();
    }, 60000);

    return () => clearInterval(timer);
  }, [search, filterStatus, filterOwner]);

  const loadTasks = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/tasks?search=${search}&status=${filterStatus}&assigned_to=${filterOwner}`
    );

    const data = await res.json();
    setTasks(data);
  };

  // SAVE
  const saveTask = async () => {
    if (!form.task_title.trim()) {
      alert("Task title required");
      return;
    }

    const url = editingId
      ? `${import.meta.env.VITE_API_URL}/tasks/${editingId}`
      : `${import.meta.env.VITE_API_URL}/tasks`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    setEditingId(null);

    loadTasks();
  };

  // EDIT
  const editTask = (task) => {
    setForm({
      task_title: task.task_title || "",
      task_name: task.task_name || "",
      assigned_to: task.assigned_to || "Rakshitha",
      start_date: task.start_date || "",
      end_date: task.end_date || "",
      remarks: task.remarks || "",
      status: task.status || "Yet to Start",
      priority: task.priority || "Medium",
    });

    setEditingId(task.id);
  };

  // DELETE
  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;

    await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    loadTasks();
  };

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Task Management
      </h1>

      {/* FORM */}
      <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow grid md:grid-cols-2 gap-4">

        <input
          className="border p-3 rounded-xl"
          placeholder="Task Title"
          value={form.task_title}
          onChange={(e) =>
            setForm({ ...form, task_title: e.target.value })
          }
        />

        <input
          className="border p-3 rounded-xl"
          placeholder="Task Name"
          value={form.task_name}
          onChange={(e) =>
            setForm({ ...form, task_name: e.target.value })
          }
        />

        <select
          className="border p-3 rounded-xl"
          value={form.assigned_to}
          onChange={(e) =>
            setForm({ ...form, assigned_to: e.target.value })
          }
        >
          <option>Rakshitha</option>
          <option>Gokul</option>
          <option>Javeri</option>
          <option>Divya</option>
        </select>

        <select
          className="border p-3 rounded-xl"
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          className="border p-3 rounded-xl"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option>Yet to Start</option>
          <option>In Progress</option>
          <option>In QA</option>
          <option>In UAT</option>
          <option>In Production</option>
          <option>Completed</option>
          <option>Blocked</option>
        </select>

        <input
          type="date"
          className="border p-3 rounded-xl"
          value={form.start_date}
          onChange={(e) =>
            setForm({ ...form, start_date: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-3 rounded-xl"
          value={form.end_date}
          onChange={(e) =>
            setForm({ ...form, end_date: e.target.value })
          }
        />

        <textarea
          rows="3"
          className="border p-3 rounded-xl md:col-span-2"
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) =>
            setForm({ ...form, remarks: e.target.value })
          }
        />

        <button
          onClick={saveTask}
          className="bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl md:col-span-2"
        >
          {editingId ? "Update Task" : "Add Task"}
        </button>

      </div>

      {/* FILTERS */}
      <div className="bg-white/90 p-4 rounded-2xl shadow flex gap-4 flex-wrap">

        <input
          className="border p-3 rounded-xl"
          placeholder="Search Task"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-3 rounded-xl"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Yet to Start</option>
          <option>In Progress</option>
          <option>In QA</option>
          <option>In UAT</option>
          <option>In Production</option>
          <option>Completed</option>
          <option>Blocked</option>
        </select>

        <select
          className="border p-3 rounded-xl"
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
        >
          <option value="">All Engineers</option>
          <option>Rakshitha</option>
          <option>Gokul</option>
          <option>Javeri</option>
          <option>Divya</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white/90 rounded-2xl shadow overflow-auto">

        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Assigned</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Start</th>
              <th className="p-3 text-left">End</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Updated</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">

                <td className="p-3">{task.task_title}</td>
                <td className="p-3">{task.assigned_to}</td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                    {task.priority}
                  </span>
                </td>

                <td className="p-3">{task.start_date}</td>
                <td className="p-3">{task.end_date}</td>
                <td className="p-3">{task.status}</td>

                <td className="p-3 text-sm text-gray-500">
                  {getTimeAgo(task.last_updated)}
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => editTask(task)}
                    className="bg-amber-500 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}