import { createClient } from "@supabase/supabase-js";

// استخدام متغيرات بيئية (في الإنتاج)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://tbllwzcqhdgztsqybfwg.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibGx3emNxaGRnenRzcXliZndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMDY4NzQsImV4cCI6MjA1NzU4Mjg3NH0.xAfedGGwK7595FJ5rk1tbePdPdOk1W-Wr12e-mLvjIM";

// تصدير الثوابت أيضًا لاستخدامها في ملفات أخرى
export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_KEY = supabaseKey;
export const SUPABASE_API_URL = `${supabaseUrl}/rest/v1/products`;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
