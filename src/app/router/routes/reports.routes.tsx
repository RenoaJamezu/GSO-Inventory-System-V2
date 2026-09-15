/* eslint-disable react-refresh/only-export-components */

import { lazy } from "react";
import { Route } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";

import {
  PERMISSIONS,
  ProtectedRoute,
  RequirePermission,
} from "@/features/auth";

const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));

export const reportsRoutes = [
  <Route key="reports" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route
        element={<RequirePermission permission={PERMISSIONS.REPORTS_VIEW} />}
      >
        <Route path="/report" element={<ReportsPage />} />
      </Route>
    </Route>
  </Route>,
];
