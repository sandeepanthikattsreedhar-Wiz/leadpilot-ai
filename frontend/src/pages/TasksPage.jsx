import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

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
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("updated");

  const getRisk = (task) => {
    const end = new Date(task.end_date);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (task.status === "Blocked") return "High";
    if (diff <= 2) return "High";
    if (diff <= 5) return "Medium";
    return "Low";
  };

  useEffect(() => {
    loadTasks();
    const timer = setInterval(() => { loadTasks(); }, 60000);
    return () => clearInterval(timer);
  }, [search, filterStatus, filterOwner]);

  const loadTasks = async () => {
    const res = await fetch(
      `${API_URL}/tasks?search=${search}&status=${filterStatus}&assigned_to=${filterOwner}`,
      { headers: { "X-API-Key": API_KEY } }
    );
    const data = await res.json();
    setTasks(data);
  };

  const downloadReport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, `LeadPilot_Report.xlsx`);
  };

  const saveTask = async () => {
    if (!form.task_title.trim()) {
      alert("Task title required");
      return;
    }
    const url = editingId
      ? `${API_URL}/tasks/${editingId}`
      : `${API_URL}/tasks`;
    const method = editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    setEditingId(null);
    loadTasks();
  };

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

  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { "X-API-Key": API_KEY }
    });
    loadTasks();
  };

  const filteredTasks = tasks
    .filter((task) => {
      const searchMatch =
        !search ||
        task.task_title?.toLowerCase().includes(search.toLowerCase()) ||
        task.task_name?.toLowerCase().includes(search.toLowerCase());
      const statusMatch = !filterStatus || task.status === filterStatus;
      const ownerMatch = !filterOwner || task.assigned_to === filterOwner;
      const priorityMatch = !filterPriority || task.priority === filterPriority;
      return searchMatch && statusMatch && ownerMatch && priorityMatch;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const order = { High: 3, Medium: 2, Low: 1 };
        return order[b.priority] - order[a.priority];
      }
      if (sortBy === "enddate") {
        return new Date(a.end_date) - new Date(b.end_date);
      }
      return new Date(b.last_updated) - new Date(a.last_updated);
    });

  const totalTasks = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const blocked = tasks.filter((t) => t.status === "Blocked").length;
  const overdue = tasks.filter(
    (t) => new Date(t.end_date) < new Date() && t.status !== "Completed"
  ).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Task Management</h1>
      <div className="grid md:grid-cols-5 gap-4">
        <Card title="Total Tasks" value={totalTasks} />
        <Card title="In Progress" value={inProgress} />
        <Card title="Completed" value={completed} />
        <Card title="Blocked" value={blocked} />
        <Card title="Overdue" value={overdue} />
      </div>

      {/* FORM */}
      <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow grid md:grid-cols-2 gap-4">
        <input className="border p-3 rounded-xl" placeholder="Task Title"
          value={form.task_title} onChange={(e) => setForm({ ...form, task_title: e.target.value })} />
        <input className="border p-3 rounded-xl" placeholder="Task Name"
          value={form.task_name} onChange={(e) => setForm({ ...form, task_name: e.target.value })} />
        <select className="border p-3 rounded-xl" value={form.assigned_to}
          onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}>
          <option>Rakshitha</option><option>Gokul</option>
          <option>Javeri</option><option>Divya</option><option>Sandeep</option>
        </select>
        <select className="border p-3 rounded-xl" value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option>High</option><option>Medium</option><option>Low</option>
        </select>
        <select className="border p-3 rounded-xl" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Yet to Start</option><option>In Progress</option>
          <option>In QA</option><option>In UAT</option>
          <option>In Production</option><option>Completed</option><option>Blocked</option>
        </select>
        <input type="date" className="border p-3 rounded-xl" value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
        <input type="date" className="border p-3 rounded-xl" value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
        <textarea rows="3" className="border p-3 rounded-xl md:col-span-2" placeholder="Remarks"
          value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
        <button onClick={downloadReport} className="bg-green-600 text-white px-4 py-2 rounded-xl">
          Download Report
        </button>
        <button onClick={saveTask}
          className="bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl md:col-span-2">
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow flex flex-wrap gap-3">
        <input className="border p-3 rounded-xl" placeholder="Search"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="border p-3 rounded-xl" value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option>Yet to Start</option><option>In Progress</option>
          <option>In QA</option><option>In UAT</option>
          <option>Completed</option><option>Blocked</option>
        </select>
        <select className="border p-3 rounded-xl" value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}>
          <option value="">All Engineers</option>
          <option>Rakshitha</option><option>Gokul</option>
          <option>Javeri</option><option>Divya</option><option>Sandeep</option>
        </select>
        <select className="border p-3 rounded-xl" value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="">All Priority</option>
          <option>High</option><option>Medium</option><option>Low</option>
        </select>
        <select className="border p-3 rounded-xl" value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}>
          <option value="updated">Latest Updated</option>
          <option value="priority">Priority</option>
          <option value="enddate">End Date</option>
        </select>
        <button onClick={downloadReport} className="bg-green-600 text-white px-5 rounded-xl">
          Export Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white/90 rounded-2xl shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Follow Up</th>
              <th className="p-3">Follow Up Notes</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Updated</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="p-3">{task.task_title}</td>
                <td className="p-3">{task.assigned_to}</td>
                <td className="p-3">{task.priority}</td>
                <td className="p-3">{task.status}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${task.followup_status === "Escalated" ? "bg-red-100 text-red-600"
                      : task.followup_status === "Closed" ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-700"}`}>
                    {task.followup_status || "Pending"}
                  </span>
                </td>
                <td className="p-3 max-w-xs">
                  <div className="truncate text-sm text-gray-600" title={task.followup_notes}>
                    {task.followup_notes || "-"}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs
                    ${getRisk(task) === "High" ? "bg-red-100 text-red-600"
                      : getRisk(task) === "Medium" ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"}`}>
                    {getRisk(task)}
                  </span>
                </td>
                <td className="p-3">{task.start_date}</td>
                <td className="p-3">{task.end_date}</td>
                <td className="p-3 text-sm">
                  {task.last_updated
                    ? new Date(task.last_updated).toLocaleString("en-IN")
                    : "-"}
                </td>
                <td className="p-3 space-x-2">
                  <button onClick={() => editTask(task)}
                    className="bg-amber-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => deleteTask(task.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function Card({ title, value }) {
    return (
      <div className="bg-white rounded-2xl shadow p-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>
    );
  }
}
