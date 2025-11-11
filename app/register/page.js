"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Gunakan signUp (email+password). Jika Supabase butuh verifikasi email, user akan menerima email.
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        {
          // Redirect setelah user klik email verification (jika diaktifkan)
          // Redirect ke root ("/") sehingga app bisa mendeteksi session
          emailRedirectTo: `${window.location.origin}/`,
        }
      );

      setLoading(false);

      if (error) {
        // tampilkan pesan error detil supaya mudah debug
        setMessage(
          "Gagal mendaftar: " + (error.message ?? JSON.stringify(error))
        );
        console.error("Supabase signUp error:", error);
        return;
      }

      // Jika data.user ada, registrasi langsung membuat user (tergantung konfigurasi Supabase)
      if (data?.user) {
        setMessage(
          "Pendaftaran berhasil! Kamu sudah terdaftar. Mengalihkan ke login..."
        );
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

      // Kalau tidak ada data.user, biasanya Supabase mengirim email verifikasi (magic link).
      setMessage(
        "Pendaftaran berhasil — cek email untuk verifikasi (jika diminta). Setelah verifikasi, silakan login."
      );
      setEmail("");
      setPassword("");
    } catch (err) {
      setLoading(false);
      setMessage("Terjadi error saat pendaftaran. Cek console untuk detail.");
      console.error("Unexpected error during signUp:", err);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-600">
          Daftar Akun
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Buat akun baru untuk mulai menggunakan Taskify Cloud
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg focus:outline-green-400"
          />
          <input
            type="password"
            required
            placeholder="Password (>= 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-lg focus:outline-green-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Masuk di sini
          </a>
        </p>

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
