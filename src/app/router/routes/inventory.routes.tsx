/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth";
import AppLayout from "@/components/layout/AppLayout";

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);

const InventoryWorkspacePage = lazy(
  () => import("@/features/inventory/inventory-accounts/pages/InventoryWorkspacePage"),
);

const AccountColumnsPage = lazy(
  () => import("@/features/inventory/account-columns/pages/AccountColumnsPage"),
);

const InventoryRecordsPage = lazy(
  () => import("@/features/inventory/inventory-records/pages/InventoryRecordsPage"),
);

export const inventoryRoutes = [
  <Route key="inventory" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Inventory Workspaces */}
      <Route path="/par" element={<InventoryWorkspacePage />} />

      <Route path="/high-cost" element={<InventoryWorkspacePage />} />

      <Route path="/low-cost" element={<InventoryWorkspacePage />} />

      {/* Inventory Record Page */}
      <Route
        path="/par/:accountId/records"
        element={<InventoryRecordsPage />}
      />

      <Route
        path="/high-cost/:accountId/records"
        element={<InventoryRecordsPage />}
      />

      <Route
        path="/low-cost/:accountId/records"
        element={<InventoryRecordsPage />}
      />

      {/* Account Column Page */}
      <Route
        path="/par/:accountId/columns"
        element={<AccountColumnsPage />}
      />

      <Route
        path="/high-cost/:accountId/columns"
        element={<AccountColumnsPage />}
      />

      <Route
        path="/low-cost/:accountId/columns"
        element={<AccountColumnsPage />}
      />
    </Route>
  </Route>,
];
