/* eslint-disable react-refresh/only-export-components */

import { lazy } from "react";
import { Route } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";

import {
  PERMISSIONS,
  ProtectedRoute,
  RequirePermission,
} from "@/features/auth";

const StockCardPage = lazy(
  () => import("@/features/inventory/stock-card/pages/StockCardPage"),
);

export const stockCardRoutes = [
  <Route key="stockCard" element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route
        element={<RequirePermission permission={PERMISSIONS.STOCK_CARD_VIEW} />}
      >
        <Route path="/stock-card" element={<StockCardPage />} />
      </Route>
    </Route>
  </Route>,
];
