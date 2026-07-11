/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth";
import AppLayout from "@/components/layout/AppLayout";

const PPESummaryPage = lazy(
  () => import("@/features/reporting/ppe-summary/pages/PPESummaryPage"),
);

export const reportRoutes = [
  <Route key="reports" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/reports/ppe-summary" element={<PPESummaryPage />} />
    </Route>
  </Route>,
];
