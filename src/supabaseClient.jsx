import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tbllwzcqhdgztsqybfwg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibGx3emNxaGRnenRzcXliZndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMDY4NzQsImV4cCI6MjA1NzU4Mjg3NH0.xAfedGGwK7595FJ5rk1tbePdPdOk1W-Wr12e-mLvjIM";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
