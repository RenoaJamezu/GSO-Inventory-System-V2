export type UserRole = "ADMIN" | "STAFF" | "VIEWER";

export type UserOffice = "GSO";

export interface CurrentUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  office: UserOffice;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
