/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

const PublicInventoryRecordPage = lazy(
  () => import("@/features/public/pages/PublicInventoryRecordPage"),
);

export const publicRoutes = [
  <Route
    key="public-record"
    path="/public/:uuid"
    element={<PublicInventoryRecordPage />}
  />,
];