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
  className="input"
  placeholder="Task Title"
  value={form.task_title}
  onChange={(e) => setForm({...form, task_title: e.target.value})}
/>

      <select
  className="input"
  value={form.assigned_to}
  onChange={(e) => setForm({...form, assigned_to: e.target.value})}
>
  <option value="">Assign To</option>
  <option>Rakshitha</option>
  <option>Gokul</option>
  <option>Javeri</option>
  <option>Divya</option>
</select>

      <select
        className="w-full border p-2 rounded"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button onClick={addTask} className="btn-primary mt-4">
  Add Task
</button>
    </form>
  );
}