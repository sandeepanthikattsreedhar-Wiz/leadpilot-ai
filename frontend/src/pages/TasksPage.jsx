import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => setTasks([task, ...tasks]);

  const updateStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "Completed" } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-6">
      <TaskForm addTask={addTask} />
      <TaskList
        tasks={tasks}
        updateStatus={updateStatus}
        deleteTask={deleteTask}
      />
    </div>
  );
}