import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nrikftavaspcypsajsfd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yaWtmdGF2YXNwY3lwc2Fqc2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjM3MTEsImV4cCI6MjA4Njk5OTcxMX0.B0_pWSyFmTPsQn5p-OGseCwQKxQtAHh7Kq34KKxNGVU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
