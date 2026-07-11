/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth";
import AppLayout from "@/components/layout/AppLayout";

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);

const InventoryAccountsPage = lazy(
  () => import("@/features/inventory-accounts/pages/InventoryAccountsPage"),
);

const AccountColumnsPage = lazy(
  () => import("@/features/account-columns/pages/AccountColumnsPage"),
);

const InventoryRecordsPage = lazy(
  () => import("@/features/inventory-records/pages/InventoryRecordsPage"),
);

export const inventoryRoutes = [
  <Route key="inventory" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />

      <Route path="/inventory-accounts" element={<InventoryAccountsPage />} />

      <Route
        path="/inventory-accounts/:accountId/columns"
        element={<AccountColumnsPage />}
      />

      <Route
        path="/inventory-accounts/:accountId/records"
        element={<InventoryRecordsPage />}
      />
    </Route>
  </Route>,
];
