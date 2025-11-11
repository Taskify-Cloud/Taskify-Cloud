"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      setMessage("Gagal mengirim link login. Coba lagi.");
      console.error(error);
    } else {
      setMessage("Link login telah dikirim ke email kamu. Cek inbox!");
      setEmail("");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Taskify Cloud
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Login dengan email kamu untuk mengakses task.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Masukkan email kamu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg focus:outline-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition"
          >
            {loading ? "Mengirim link..." : "Kirim Link Login"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}
      </div>

      <footer className="text-gray-400 text-xs mt-8">
        © 2025 Taskify Cloud — Manage your tasks easily.
      </footer>
    </main>
  );
}
