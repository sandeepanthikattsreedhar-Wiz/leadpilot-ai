import { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [priority, setPriority] = useState("Medium");

  const submit = (e) => {
    e.preventDefault();

    if (!title || !owner) return;

    addTask({
      id: Date.now(),
      title,
      owner,
      priority,
      status: "Pending",
    });

    setTitle("");
    setOwner("");
    setPriority("Medium");
  };

  return (
    <form onSubmit={submit} className="bg-white p-5 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Add New Task</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Owner Name"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button className="bg-slate-900 text-white px-4 py-2 rounded">
        Add Task
      </button>
    </form>
  );
}