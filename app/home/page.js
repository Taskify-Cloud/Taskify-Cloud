"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  // --- Fungsi di atas agar bisa dipanggil dari useEffect ---
  async function fetchTasks(userId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setTasks(data);
  }

  async function addTask() {
    if (!newTask) return;
    const { error } = await supabase
      .from("tasks")
      .insert([{ title: newTask, user_id: user.id, status: "todo" }]);
    if (!error) {
      setNewTask("");
      fetchTasks(user.id);
    }
  }

  async function toggleTask(id, status) {
    await supabase
      .from("tasks")
      .update({ status: status === "todo" ? "done" : "todo" })
      .eq("id", id);
    fetchTasks(user.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  // --- useEffect dipanggil terakhir ---
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        fetchTasks(data.user.id);
      }
    };
    init();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="flex justify-between w-full max-w-lg mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Taskify Cloud</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4 w-full max-w-lg">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Tambahkan tugas baru..."
          className="px-3 py-2 border rounded-lg flex-grow"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Tambah
        </button>
      </div>

      <ul className="w-full max-w-lg">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-3 mb-2 rounded-lg flex justify-between items-center shadow"
          >
            <span
              className={
                task.status === "done" ? "line-through text-gray-400" : ""
              }
            >
              {task.title}
            </span>
            <button
              onClick={() => toggleTask(task.id, task.status)}
              className="text-sm text-blue-500"
            >
              {task.status === "done" ? "Undo" : "Selesai"}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
