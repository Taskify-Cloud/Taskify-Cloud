"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false); // mode reset password
  const router = useRouter();

  // === LOGIN HANDLER ===
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage("Email atau password salah!");
    } else {
      setMessage("Login berhasil! Mengalihkan...");
      setTimeout(() => router.push("/home"), 1500);
    }
  }

  // === RESET PASSWORD HANDLER ===
  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMessage("Gagal mengirim tautan reset: " + error.message);
    } else {
      setMessage(
        "Tautan reset password telah dikirim ke email kamu. Cek kotak masukmu!"
      );
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Taskify Cloud
        </h1>
        <p className="text-gray-500 text-center mb-6">
          {resetMode
            ? "Masukkan email untuk reset password"
            : "Masuk untuk mengelola task kamu"}
        </p>

        <form
          onSubmit={resetMode ? handleResetPassword : handleLogin}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg focus:outline-blue-400"
          />

          {!resetMode && (
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-lg focus:outline-blue-400"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${
              resetMode
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white p-3 rounded-lg transition`}
          >
            {loading
              ? "Memproses..."
              : resetMode
              ? "Kirim Link Reset"
              : "Masuk"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4 space-y-1">
          {!resetMode ? (
            <>
              <p>
                <button
                  onClick={() => setResetMode(true)}
                  className="text-blue-500 hover:underline"
                >
                  Lupa password?
                </button>
              </p>
              <p>
                Belum punya akun?{" "}
                <a href="/register" className="text-blue-500 hover:underline">
                  Daftar di sini
                </a>
              </p>
            </>
          ) : (
            <p>
              <button
                onClick={() => setResetMode(false)}
                className="text-gray-500 hover:underline"
              >
                Kembali ke login
              </button>
            </p>
          )}
        </div>

        {message && (
          <p className="text-center text-sm text-gray-600 mt-4 break-words">
            {message}
          </p>
        )}
      </div>

      <footer className="text-gray-400 text-xs mt-8">
        © 2025 Taskify Cloud — Manage your tasks easily.
      </footer>
    </main>
  );
}
