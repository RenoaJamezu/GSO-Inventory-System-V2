export type ActivityAction = "CREATE" | "UPDATE" | "SOFT_DELETE";

export type ActivityUser = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

export type ActivityLog = {
  id: number;

  user_id: string | null;

  action: ActivityAction;

  entity_type: string;
  entity_id: string | null;

  description: string;

  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;

  created_at: string;

  user: ActivityUser | null;
};
