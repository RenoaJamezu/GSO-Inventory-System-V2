import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "@/pages/PageLoader";

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

        <Route path="/public/:qrUuid" element={<PublicQrPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
