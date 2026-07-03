import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "@/pages/PageLoader";

const InventoryAccountsPage = lazy(
  () => import("@/features/inventory-accounts/pages/InventoryAccountsPage"),
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
        <Route
          path="/"
          element={<Navigate to="/inventory-accounts" replace />}
        />

        <Route path="/inventory-accounts" element={<InventoryAccountsPage />} />

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

        <Route path="/public/:uuid" element={<PublicInventoryRecordPage />} />

        <Route path="/print/:uuid" element={<PrintQrPage />} />

        <Route path="/bulk-print" element={<BulkPrintPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
