// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchActiveUser() {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error || !user) {
      return null;
    }

    let avatar_url = user.avatar_url;
    if (user.avatar_path) {
      const { data: publicData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(user.avatar_path);
      avatar_url = publicData?.publicUrl || avatar_url || null;
    }

    return { ...user, avatar_url };
  } catch (err) {
    console.error("fetchActiveUser error:", err);
    return null;
  }
}
