/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth";
import AppLayout from "@/components/layout/AppLayout";

const StockCardPage = lazy(
  () => import("@/features/inventory/stock-card/pages/StockCardPage"),
);

export const stockCardRoutes = [
  <Route key="stockCard" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/stock-card" element={<StockCardPage />} />
    </Route>
  </Route>,
];
