import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import api from "../api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

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

  const updateStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: "Completed" }
          : task
      )
    );
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
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