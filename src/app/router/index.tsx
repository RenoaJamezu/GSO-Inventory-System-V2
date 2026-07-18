import { Suspense } from "react";
import { Routes } from "react-router-dom";

import PageLoader from "@/pages/PageLoader";

import { authRoutes } from "./routes/auth.routes";
import { inventoryRoutes } from "./routes/inventory.routes";
import { publicRoutes } from "./routes/public.routes";
import { reportsRoutes } from "./routes/reports.routes";
import { sharedRoutes } from "./routes/shared.routes";
import { settingsRoutes } from "./routes/settings.route";

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {sharedRoutes}

        {authRoutes}

        {publicRoutes}

        {inventoryRoutes}

        {reportsRoutes}

        {settingsRoutes}
      </Routes>
    </Suspense>
  );
}
