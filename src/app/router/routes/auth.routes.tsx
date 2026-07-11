/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

import { GuestRoute } from "@/features/auth";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));

export const authRoutes = [
  <Route key="guest" element={<GuestRoute />}>
    <Route
      path="/login"
      element={<LoginPage />}
    />
  </Route>,
];