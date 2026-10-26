import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export const supabase = createClient(
  "https://vywwuidfiudipupquasw.supabase.co", // Project URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d3d1aWRmaXVkaXB1cHF1YXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMjA5NjAsImV4cCI6MjEwODU5Njk2MH0.RBm_3aCAaH-Ne-ngHq1fDEcA2g1hYvD5CfZWhaJlv5s"               // anon public key
);

export const ADMIN_EMAIL = "imadeyudha26@gmail.com"; // ganti

export const esc = s => String(s ?? "").replace(/[&<>"']/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const rp = n => "Rp " + Number(n || 0).toLocaleString("id-ID");