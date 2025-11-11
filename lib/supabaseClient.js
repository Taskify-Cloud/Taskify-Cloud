import { createClient } from "@supabase/supabase-js";

// Ganti sesuai data dari Supabase kamu
const supabaseUrl = "https://mtwwlyjunhzyxogejbqw.supabase.co"; // ← ini dari Project Settings > API > Project URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d3dseWp1bmh6eXhvZ2VqYnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjUxMzAsImV4cCI6MjA3NzI0MTEzMH0.NzVbShoKtMRJgi2CPCpdz8vtye1WlPfaqzN1PSMhMxU"; // ← ini dari Project Settings > API > anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
