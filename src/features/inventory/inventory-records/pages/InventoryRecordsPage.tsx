import { useRef } from "react";
import { useInventoryRecordsPage } from "../hooks/useInventoryRecordsPage";
import { useReactToPrint } from "react-to-print";
import InventoryRecordGroupManagementDialog from "../components/groups/InventoryRecordGroupManagementDialog";
import InventoryRecordBulkPrint from "./InventoryRecordBulkPrint";
import InventoryRecordExcelImportDialog from "../components/import/InventoryRecordExcelImportDialog";
import { Link, useLocation } from "react-router-dom";
import InventoryRecordBulkToolbar from "../components/InventoryRecordBulkToolbar";
import InventoryRecordDialog from "../components/InventoryRecordDialog";
import InventoryRecordStats from "../components/InventoryRecordStats";
import InventoryRecordTable from "../components/InventoryRecordTable";
import InventoryRecordToolbar from "../components/InventoryRecordToolbar";
import InventoryRecordSidePanel from "../components/side-panel/InventoryRecordSidePanel";

export default function InventoryRecordsPage() {
  const { pathname } = useLocation();

  const workspace = pathname.startsWith("/par")
    ? {
        title: "PAR Inventory",
        backLink: "/par",
      }
    : pathname.startsWith("/high-cost")
      ? {
          title: "ICS - High Cost",
          backLink: "/high-cost",
        }
      : {
          title: "ICS - Low Cost",
          backLink: "/low-cost",
        };

  const {
    id,

    account,
    groups,
    columns,

    filters,
    selection,
    view,
    groupedRecords,

    selectedGroupId,
    setSelectedGroupId,

    assignSelectedGroup,
    deleteSelectedRecords,
    printableRecords,
    deleteRecordById,

    downloadTemplate,
    goToColumns,
    openPublicView,

    inventoryType,

    totalAmount,

    isLoading,
  } = useInventoryRecordsPage();

  const bulkPrintRef = useRef<HTMLDivElement>(null);

  const handleBulkPrint = useReactToPrint({
    contentRef: bulkPrintRef,
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <>
      {/* Hidden printable content */}
      <div className="hidden">
        <div ref={bulkPrintRef}>
          <InventoryRecordBulkPrint records={printableRecords} />
        </div>
      </div>

      <div className="space-y-4">
        <header>
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Link
              to="/dashboard"
              className="transition-colors hover:text-emerald-600"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to={workspace.backLink}
              className="transition-colors hover:text-emerald-600"
            >
              {workspace.title}
            </Link>

            <span>/</span>

            <span className="font-medium capitalize text-gray-900">
              {account.data?.account_title}
            </span>
          </nav>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {account.data?.account_title}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {workspace.title} • Manage inventory records for this account.
            </p>
          </div>
        </header>

        <InventoryRecordStats
          totalRecords={filters.filteredRecords.length}
          totalAmount={totalAmount}
        />

        <InventoryRecordToolbar
          search={filters.search}
          onSearchChange={filters.setSearch}
          onAddRecord={view.createRecord}
          onImportExcel={view.openImportDialog}
          onDownloadTemplate={downloadTemplate}
          onExportExcel={() => {}}
          onManageColumns={goToColumns}
          onManageGroups={view.openGroupDialog}
        />

        <InventoryRecordBulkToolbar
          selectedCount={selection.selectedCount}
          groups={groups.data ?? []}
          selectedGroupId={selectedGroupId}
          onGroupChange={setSelectedGroupId}
          onAssign={assignSelectedGroup}
          onPrint={handleBulkPrint}
          onDelete={deleteSelectedRecords}
        />

        <InventoryRecordTable
          groupedRecords={groupedRecords}
          columns={columns.data ?? []}
          selectedIds={selection.selectedIds}
          onSelect={selection.toggle}
          onSelectAll={selection.toggleAll}
          onToggleGroup={selection.toggleGroup}
          isGroupSelected={selection.isGroupSelected}
          isGroupIndeterminate={selection.isGroupIndeterminate}
          onOpenRecord={view.openRecord}
        />
      </div>

      <InventoryRecordDialog
        open={view.dialogOpen}
        accountId={id}
        inventoryType={inventoryType}
        record={view.editingRecord}
        onClose={view.closeDialog}
      />

      <InventoryRecordGroupManagementDialog
        open={view.groupDialogOpen}
        accountId={id}
        onClose={view.closeGroupDialog}
      />

      <InventoryRecordExcelImportDialog
        open={view.importDialogOpen}
        accountId={id}
        inventoryType={inventoryType}
        columns={columns.data ?? []}
        groups={groups.data ?? []}
        onClose={view.closeImportDialog}
      />

      <InventoryRecordSidePanel
        open={view.sidePanelOpen}
        record={view.openedRecord}
        columns={columns.data ?? []}
        accountTitle={account.data?.account_title ?? ""}
        onClose={view.closeSidePanel}
        onEdit={view.editOpenedRecord}
        onPublicView={() => {
          if (!view.openedRecord) return;

          openPublicView(view.openedRecord.qr_uuid);
        }}
        onDelete={() => {
          if (!view.openedRecord) return;

          deleteRecordById(view.openedRecord.id, id, view.removeOpenedRecord);
        }}
      />
    </>
  );
}
