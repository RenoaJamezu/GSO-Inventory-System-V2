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

export default function VehicleRecordsPage() {
  const vehiclesQuery = useVehicleRecords();

  const vehicles = vehiclesQuery.data ?? [];

  const view = useVehicleRecordView();

  const filters = useVehicleRecordFilters({
    vehicles,
  });

  const deleteMutation = useDeleteVehicleRecord();

  async function deleteOpenedVehicle() {
    if (!view.openedVehicle) return;

    if (deleteMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(
      `Delete vehicle "${view.openedVehicle.plate_no}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(view.openedVehicle.id);

      view.removeOpenedVehicle();
    } catch (error) {
      console.error(error);

      alert("Failed to delete vehicle.");
    }
  }

  if (vehiclesQuery.isLoading) {
    return <div className="p-6">Loading vehicle records...</div>;
  }

  if (vehiclesQuery.error) {
    return <div className="p-6">Failed to load vehicle records.</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <header>
          <h1 className="text-3xl font-bold">Vehicle Records</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor municipal vehicle records.
          </p>
        </header>

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

        <div className="text-sm text-gray-500">
          Showing {filters.filteredVehicles.length} of {vehicles.length} vehicle
          {vehicles.length === 1 ? "" : "s"}
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
        onDelete={deleteOpenedVehicle}
      />
    </>
  );
}
