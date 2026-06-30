import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "@/pages/PageLoader";
import AccountColumnsPage from "@/features/account-columns/pages/AccountColumnsPage";

const InventoryAccountsPage = lazy(
  () => import("@/features/inventory-accounts/pages/InventoryAccountsPage"),
);

const PublicQrPage = lazy(() => import("@/pages/PublicQrPage"));

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

        <Route path="/public/:qrUuid" element={<PublicQrPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
