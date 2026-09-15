/* eslint-disable react-refresh/only-export-components */

import { lazy } from "react";
import { Route } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";

import {
  PERMISSIONS,
  ProtectedRoute,
  RequirePermission,
} from "@/features/auth";

const SettingsPage = lazy(
  () => import("@/features/settings/pages/SettingsPage"),
);

export const settingsRoutes = [
  <Route key="settings" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route
        element={<RequirePermission permission={PERMISSIONS.SETTINGS_MANAGE} />}
      >
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Route>
  </Route>,
];
