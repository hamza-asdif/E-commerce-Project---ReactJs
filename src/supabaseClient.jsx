import { createClient } from "@supabase/supabase-js";

// استخدام متغيرات بيئية من ملف .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;