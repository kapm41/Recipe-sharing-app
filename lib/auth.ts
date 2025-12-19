import { createSupabaseServerClient } from "./supabaseServer";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  const { data, error } = await supabaseAny
    .from("profiles")
    .select("username, full_name, bio, created_at")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

