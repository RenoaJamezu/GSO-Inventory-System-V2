import { useState } from "react";

import type { VehicleRecord } from "../types";

export function useVehicleRecordView() {
  // Add / Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState<VehicleRecord | null>(
    null,
  );

  // Side panel
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const [openedVehicle, setOpenedVehicle] = useState<VehicleRecord | null>(
    null,
  );

  // --------------------------
  // Vehicle Dialog
  // --------------------------

  function createVehicle() {
    setEditingVehicle(null);
    setDialogOpen(true);
  }

  function editVehicle(vehicle: VehicleRecord) {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingVehicle(null);
  }

  // --------------------------
  // Side Panel
  // --------------------------

  function openVehicle(vehicle: VehicleRecord) {
    setOpenedVehicle(vehicle);
    setSidePanelOpen(true);
  }

  function closeSidePanel() {
    setOpenedVehicle(null);
    setSidePanelOpen(false);
  }

  function editOpenedVehicle() {
    if (!openedVehicle) return;

    setSidePanelOpen(false);
    setEditingVehicle(openedVehicle);
    setDialogOpen(true);
  }

  function removeOpenedVehicle() {
    setOpenedVehicle(null);
    setSidePanelOpen(false);
  }

  return {
    // Dialog
    dialogOpen,
    editingVehicle,
    createVehicle,
    editVehicle,
    closeDialog,

    // Side panel
    sidePanelOpen,
    openedVehicle,
    openVehicle,
    closeSidePanel,
    editOpenedVehicle,
    removeOpenedVehicle,
  };
}
