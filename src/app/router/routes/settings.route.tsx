/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth";
import AppLayout from "@/components/layout/AppLayout";

const SettingsPage = lazy(
  () => import("@/features/settings/pages/SettingsPage"),
);

export const settingsRoutes = [
  <Route key="reports" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/settings" element={<SettingsPage />} />
    </Route>
  </Route>,
];
