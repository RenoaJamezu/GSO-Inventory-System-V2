/* eslint-disable react-refresh/only-export-components */

import { lazy } from "react";
import { Route } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";

import {
  PERMISSIONS,
  ProtectedRoute,
  RequirePermission,
} from "@/features/auth";

const VehicleRecordPage = lazy(
  () => import("@/features/inventory/vehicle-records/pages/VehicleRecordsPage"),
);

export const vehicleRecordRoutes = [
  <Route key="vehicleRecord" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route
        element={<RequirePermission permission={PERMISSIONS.VEHICLE_VIEW} />}
      >
        <Route path="/vehicle-record" element={<VehicleRecordPage />} />
      </Route>
    </Route>
  </Route>,
];
