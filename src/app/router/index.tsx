import { Suspense } from "react";
import { Routes } from "react-router-dom";

import PageLoader from "@/pages/PageLoader";

import { authRoutes } from "./routes/auth.routes";
import { inventoryRoutes } from "./routes/inventory.routes";
import { publicRoutes } from "./routes/public.routes";
import { sharedRoutes } from "./routes/shared.routes";
import { settingsRoutes } from "./routes/settings.route";
import { stockCardRoutes } from "./routes/stock-card.routes";
import { vehicleRecordRoutes } from "./routes/vehicle-record.routes"

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {sharedRoutes}

        {authRoutes}

        {publicRoutes}

        {inventoryRoutes}

        {stockCardRoutes}

        {vehicleRecordRoutes}

        {settingsRoutes}
      </Routes>
    </Suspense>
  );
}
