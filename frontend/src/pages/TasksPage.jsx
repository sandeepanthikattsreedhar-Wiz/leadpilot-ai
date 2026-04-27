import { useEffect, useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import api from "../api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const loadTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (task) => {
    await api.post("/tasks", task);
    loadTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  const updateStatus = async (task) => {
    await api.put(`/tasks/${task.id}`, {
      ...task,
      status: "Completed",
    });

    loadTasks();
  };

  const saveEdit = async () => {
    await api.put(`/tasks/${editing.id}`, editing);
    setEditing(null);
    loadTasks();
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.owner.toLowerCase().includes(search.toLowerCase())
      )
      .filter((task) =>
        statusFilter === "All"
          ? true
          : task.status === statusFilter
      )
      .filter((task) =>
        priorityFilter === "All"
          ? true
          : task.priority === priorityFilter
      )
      .sort((a, b) => b.id - a.id);
  }, [tasks, search, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      <TaskForm addTask={addTask} />

      <div className="bg-white p-5 rounded-xl shadow grid md:grid-cols-4 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>

        <select
          className="border p-2 rounded"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <div className="flex items-center text-sm text-gray-600">
          {filteredTasks.length} tasks
        </div>
      </div>

      {editing && (
        <div className="bg-white p-5 rounded-xl shadow space-y-3">
          <h2 className="text-lg font-semibold">Edit Task</h2>

          <input
            className="border p-2 rounded w-full"
            value={editing.title}
            onChange={(e) =>
              setEditing({ ...editing, title: e.target.value })
            }
          />

          <input
            className="border p-2 rounded w-full"
            value={editing.owner}
            onChange={(e) =>
              setEditing({ ...editing, owner: e.target.value })
            }
          />

          <select
            className="border p-2 rounded w-full"
            value={editing.priority}
            onChange={(e) =>
              setEditing({
                ...editing,
                priority: e.target.value,
              })
            }
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button
            onClick={saveEdit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      )}

      <TaskList
        tasks={filteredTasks}
        updateStatus={updateStatus}
        deleteTask={deleteTask}
        startEdit={setEditing}
      />
    </div>
  );
}