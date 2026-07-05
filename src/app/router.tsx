import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "@/pages/PageLoader";
import GuestRoute from "@/features/auth/components/GuestRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));

const InventoryAccountsPage = lazy(
  () => import("@/features/inventory-accounts/pages/InventoryAccountsPage"),
);

const PPESummaryPage = lazy(
  () => import("@/features/reporting/ppe-summary/pages/PPESummaryPage"),
);

const AccountColumnsPage = lazy(
  () => import("@/features/account-columns/pages/AccountColumnsPage"),
);

const InventoryRecordsPage = lazy(
  () => import("@/features/inventory-records/pages/InventoryRecordsPage"),
);

const InventoryRecordQrCodePage = lazy(
  () => import("@/features/inventory-records/pages/InventoryRecordQrCodePage"),
);

const GroupsPage = lazy(() => import("@/features/groups/pages/GroupsPage"));

const PublicInventoryRecordPage = lazy(
  () => import("@/features/public/pages/PublicInventoryRecordPage"),
);

const PrintQrPage = lazy(
  () => import("@/features/inventory-records/pages/PrintQrPage"),
);

const BulkPrintPage = lazy(
  () => import("@/features/inventory-records/pages/BulkPrintPage"),
);

const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<Navigate to="/inventory-accounts" replace />}
        />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/public/:uuid" element={<PublicInventoryRecordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/inventory-accounts"
            element={<InventoryAccountsPage />}
          />

          <Route path="/reports/ppe-summary" element={<PPESummaryPage />} />

          <Route
            path="/inventory-accounts/:accountId/columns"
            element={<AccountColumnsPage />}
          />

          <Route
            path="/inventory-accounts/:accountId/records"
            element={<InventoryRecordsPage />}
          />

          <Route
            path="/inventory-accounts/:accountId/groups"
            element={<GroupsPage />}
          />

          <Route path="/record/:uuid" element={<InventoryRecordQrCodePage />} />

          <Route path="/print/:uuid" element={<PrintQrPage />} />

          <Route path="/bulk-print" element={<BulkPrintPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
