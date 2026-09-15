import { supabase } from "@/lib/supabase";

import type { ActivityLog } from "../activity.types";

export async function getRecentActivity(limit = 10): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select(
      `
      id,
      user_id,
      action,
      entity_type,
      entity_id,
      description,
      old_data,
      new_data,
      created_at,
      user:users (
        first_name,
        last_name,
        email,
        role
      )
    `,
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as ActivityLog[];
}
