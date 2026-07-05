import { Navigate, Outlet } from "react-router-dom";
import { useAuth, useCurrentUser } from "@/features/auth";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  const { data: currentUser, isLoading: loadingUser, error } = useCurrentUser();

  useEffect(() => {
    if (!loading && !loadingUser && currentUser && !currentUser.is_active) {
      supabase.auth.signOut();
    }
  }, [loading, loadingUser, currentUser]);

  if (loading || loadingUser) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (error || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser.is_active) {
    return <div>Signing out...</div>;
  }

  return <Outlet />;
}
