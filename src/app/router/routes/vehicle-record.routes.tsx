/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth";
import AppLayout from "@/components/layout/AppLayout";

const VehicleRecordPage = lazy(
  () => import("@/features/inventory/vehicle-records/pages/VehicleRecordsPage"),
);

export const vehicleRecordRoutes = [
  <Route key="stockCard" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/vehicle-record" element={<VehicleRecordPage />} />
    </Route>
  </Route>,
];
