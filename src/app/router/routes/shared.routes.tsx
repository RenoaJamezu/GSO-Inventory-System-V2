/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export const sharedRoutes = [
  <Route
    key="home"
    path="/"
    element={<Navigate to="/inventory-accounts" replace />}
  />,

  <Route
    key="not-found"
    path="*"
    element={<NotFoundPage />}
  />,
];