import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useReactToPrint } from "react-to-print";

import { PageHeader } from "@/components/ui";

import { useInventoryRecordsPage } from "../hooks/useInventoryRecordsPage";

import InventoryRecordGroupManagementDialog from "../components/groups/InventoryRecordGroupManagementDialog";
import InventoryRecordBulkPrint from "./InventoryRecordBulkPrint";
import InventoryRecordExcelImportDialog from "../components/import/InventoryRecordExcelImportDialog";
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
    exportRecordsToExcel,
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
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading inventory records...
      </div>
    );
  }

  const accountTitle = account.data?.account_title ?? "Inventory Records";

  return (
    <>
      {/* Hidden printable content */}
      <div className="hidden">
        <div ref={bulkPrintRef}>
          <InventoryRecordBulkPrint records={printableRecords} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm"
        >
          <Link
            to="/dashboard"
            className="
              text-slate-500 transition-colors
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

          <Link
            to={workspace.backLink}
            className="
              text-slate-500 transition-colors
              hover:text-emerald-700
              dark:text-slate-400
              dark:hover:text-emerald-400
            "
          >
            {workspace.title}
          </Link>

          <ChevronRight
            size={15}
            className="text-slate-400 dark:text-slate-600"
          />

          <span className="font-medium text-slate-700 dark:text-slate-200">
            {accountTitle}
          </span>
        </nav>

        <PageHeader
          title={accountTitle}
          description={`${workspace.title} • Manage inventory records for this account.`}
        />

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
          onExportExcel={exportRecordsToExcel}
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
        accountTitle={accountTitle}
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
