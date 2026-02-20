import { getSupabaseServiceClient } from "@/lib/supabase-server";

/** Meets chat + recording rows require service role (custom app auth, not Supabase JWT). */
export function meetsDb() {
    return getSupabaseServiceClient();
}
