/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth";
import AppLayout from "@/components/layout/AppLayout";

const ReportsPage = lazy(
  () => import("@/features/reports/pages/ReportsPage"),
);

export const reportsRoutes = [
  <Route key="reports" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/report" element={<ReportsPage />} />
    </Route>
  </Route>,
];
