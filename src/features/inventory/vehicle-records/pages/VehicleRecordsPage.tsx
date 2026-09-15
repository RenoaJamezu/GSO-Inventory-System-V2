import { useState } from "react";
import { Link } from "react-router-dom";

import { ChevronRight } from "lucide-react";

import { ConfirmDialog } from "@/components/dialog";
import { PageHeader } from "@/components/ui";

import { useVehicleRecordFilters } from "../hooks/useVehicleRecordFilters";

import {
  useDeleteVehicleRecord,
  useVehicleRecords,
} from "../hooks/useVehicleRecords";

import { useVehicleRecordView } from "../hooks/useVehicleRecordView";

import VehicleRecordDialog from "../components/VehicleRecordDialog";
import VehicleRecordsTable from "../components/VehicleRecordsTable";
import VehicleRecordToolbar from "../components/VehicleRecordToolbar";

import VehicleRecordSidePanel from "../components/side-panel/VehicleRecordSidePanel";
import { PERMISSIONS, usePermissions } from "@/features/auth";

export default function VehicleRecordsPage() {
  const vehiclesQuery = useVehicleRecords();

  const vehicles = vehiclesQuery.data ?? [];

  const view = useVehicleRecordView();

  const filters = useVehicleRecordFilters({
    vehicles,
  });

  const deleteMutation = useDeleteVehicleRecord();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { can } = usePermissions();

  const canDelete = can(PERMISSIONS.VEHICLE_DELETE);

  function requestDeleteOpenedVehicle() {
    if (!canDelete) return;

    if (!view.openedVehicle) {
      return;
    }

    setDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    if (deleteMutation.isPending) {
      return;
    }

    setDeleteDialogOpen(false);
  }

  async function confirmDeleteVehicle() {
    if (!canDelete) return;

    if (!view.openedVehicle) {
      return;
    }

    if (deleteMutation.isPending) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(view.openedVehicle.id);

      setDeleteDialogOpen(false);
      view.removeOpenedVehicle();
    } catch (error) {
      console.error("Failed deleting vehicle record", error);
    }
  }

  if (vehiclesQuery.isLoading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading vehicle records...
      </div>
    );
  }

  if (vehiclesQuery.error) {
    return (
      <div
        className="
          rounded-lg border
          border-red-200
          bg-red-50
          px-5 py-4
          text-sm text-red-700

          dark:border-red-900
          dark:bg-red-950/30
          dark:text-red-300
        "
      >
        Failed to load vehicle records.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm"
        >
          <Link
            to="/dashboard"
            className="
              text-slate-500
              transition-colors
              hover:text-emerald-700

              dark:text-slate-400
              dark:hover:text-emerald-400
            "
          >
            Dashboard
          </Link>

          <ChevronRight
            size={15}
            className="text-slate-400 dark:text-slate-600"
          />

          <span className="font-medium text-slate-700 dark:text-slate-200">
            Vehicle Records
          </span>
        </nav>

        <PageHeader
          title="Vehicle Records"
          description="Manage and monitor municipal vehicles, assignments, acquisition information, and registration expiration."
        />

        <VehicleRecordToolbar
          search={filters.search}
          onSearchChange={filters.setSearch}
          year={filters.year}
          onYearChange={filters.setYear}
          month={filters.month}
          onMonthChange={filters.setMonth}
          sort={filters.sort}
          onSortChange={filters.setSort}
          years={filters.years}
          onAdd={view.createVehicle}
        />

        <div
          className="
            flex flex-wrap
            items-center
            justify-between
            gap-2
            text-sm
            text-slate-500

            dark:text-slate-400
          "
        >
          <p>
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {filters.filteredVehicles.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {vehicles.length}
            </span>{" "}
            vehicle
            {vehicles.length === 1 ? "" : "s"}
          </p>

          {(filters.search || filters.year || filters.month) && (
            <span>Filters applied</span>
          )}
        </div>

        <VehicleRecordsTable
          vehicles={filters.filteredVehicles}
          onOpenVehicle={view.openVehicle}
          onEditVehicle={view.editVehicle}
        />
      </div>

      <VehicleRecordDialog
        open={view.dialogOpen}
        vehicle={view.editingVehicle}
        onClose={view.closeDialog}
      />

      <VehicleRecordSidePanel
        open={view.sidePanelOpen}
        vehicle={view.openedVehicle}
        onClose={view.closeSidePanel}
        onEdit={view.editOpenedVehicle}
        onDelete={requestDeleteOpenedVehicle}
      />

      {canDelete && (
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Vehicle Record"
          description={`Are you sure you want to delete vehicle "${view.openedVehicle?.plate_no ?? ""}"?`}
          confirmText="Delete Vehicle"
          loading={deleteMutation.isPending}
          loadingText="Deleting..."
          onClose={closeDeleteDialog}
          onConfirm={confirmDeleteVehicle}
        />
      )}
    </>
  );
}
