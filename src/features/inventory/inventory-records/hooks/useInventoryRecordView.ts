import { useState } from "react";
import type { InventoryRecord, Group } from "../types";

export function useInventoryRecordView() {
  // Inventory Record
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InventoryRecord | null>(
    null,
  );

  // Side Panel
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [openedRecord, setOpenedRecord] = useState<InventoryRecord | null>(
    null,
  );

  // Groups
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  // Import
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // --------------------------
  // Inventory Record
  // --------------------------

  function createRecord() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function editRecord(record: InventoryRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingRecord(null);
  }

  // --------------------------
  // Side Panel
  // --------------------------

  function openRecord(record: InventoryRecord) {
    setOpenedRecord(record);
    setSidePanelOpen(true);
  }

  function closeSidePanel() {
    setOpenedRecord(null);
    setSidePanelOpen(false);
  }

  function editOpenedRecord() {
    if (!openedRecord) return;

    setSidePanelOpen(false);
    setEditingRecord(openedRecord);
    setDialogOpen(true);
  }

  function removeOpenedRecord() {
    setOpenedRecord(null);
    setSidePanelOpen(false);
  }

  // --------------------------
  // Groups
  // --------------------------

  function openGroupDialog() {
    setEditingGroup(null);
    setGroupDialogOpen(true);
  }

  function editGroup(group: Group) {
    setEditingGroup(group);
    setGroupDialogOpen(true);
  }

  function closeGroupDialog() {
    setEditingGroup(null);
    setGroupDialogOpen(false);
  }

  // --------------------------
  // Import
  // --------------------------

  function openImportDialog() {
    setImportDialogOpen(true);
  }

  function closeImportDialog() {
    setImportDialogOpen(false);
  }

  return {
    // Inventory Record
    dialogOpen,
    editingRecord,
    createRecord,
    editRecord,
    closeDialog,

    // Side Panel
    sidePanelOpen,
    openedRecord,
    openRecord,
    closeSidePanel,
    editOpenedRecord,
    removeOpenedRecord,

    // Groups
    groupDialogOpen,
    editingGroup,
    openGroupDialog,
    editGroup,
    closeGroupDialog,

    // Import
    importDialogOpen,
    openImportDialog,
    closeImportDialog,
  };
}
