"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 🔹 Update password user aktif (setelah klik link dari email)
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      // 🔹 Logout dari semua sesi lama (keamanan tambahan)
      const { error: signOutError } = await supabase.auth.signOut({
        scope: "global", // hapus semua sesi di seluruh device
      });

      if (signOutError) console.warn("Sign out global gagal:", signOutError);

      setMessage(
        "Password berhasil diperbarui! Kamu akan diarahkan ke login..."
      );
      setPassword("");

      // 🔹 Tunggu sebentar, lalu arahkan ke login
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Error saat reset password:", err);
      setMessage("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-600">
          Reset Password
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Masukkan password baru untuk akunmu.
        </p>

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
          <input
            type="password"
            required
            placeholder="Password baru (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-lg focus:outline-green-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition"
          >
            {loading ? "Memproses..." : "Perbarui Password"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-gray-600 mt-4 break-words">
            {message}
          </p>
        )}
      </div>

      <footer className="text-gray-400 text-xs mt-8">
        © 2025 Taskify Cloud — Secure and simple.
      </footer>
    </main>
  );
}
