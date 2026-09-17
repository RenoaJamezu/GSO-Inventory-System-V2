import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useReactToPrint } from "react-to-print";

import { ConfirmDialog } from "@/components/dialog";
import { PageHeader } from "@/components/ui";

import InventoryRecordGroupManagementDialog from "../components/groups/InventoryRecordGroupManagementDialog";
import InventoryRecordExcelImportDialog from "../components/import/InventoryRecordExcelImportDialog";
import InventoryRecordBulkToolbar from "../components/InventoryRecordBulkToolbar";
import InventoryRecordDialog from "../components/InventoryRecordDialog";
import InventoryRecordStats from "../components/InventoryRecordStats";
import InventoryRecordTable from "../components/InventoryRecordTable";
import InventoryRecordToolbar from "../components/InventoryRecordToolbar";
import InventoryRecordSidePanel from "../components/side-panel/InventoryRecordSidePanel";
import { useInventoryRecordsPage } from "../hooks/useInventoryRecordsPage";

import InventoryRecordBulkPrint from "./InventoryRecordBulkPrint";

export default function InventoryRecordsPage() {
  const {
    id,
    account,
    groups,
    columns,
    filters,
    selection,
    view,
    tableLayout,
    bulkAssign,
    bulkDelete,
    deleteRecord,
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
    routeContext,
    inventoryType,
    totalAmount,
    isLoading,
  } = useInventoryRecordsPage();

  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);

  const bulkPrintRef = useRef<HTMLDivElement>(null);

  const handleBulkPrint = useReactToPrint({
    contentRef: bulkPrintRef,
  });

  function requestBulkDelete() {
    if (!selection.selectedCount || bulkDelete.isPending) {
      return;
    }

    setIsBulkDeleteOpen(true);
  }

  function closeBulkDeleteDialog() {
    if (bulkDelete.isPending) {
      return;
    }

    setIsBulkDeleteOpen(false);
  }

  async function confirmBulkDelete() {
    try {
      await deleteSelectedRecords();
      setIsBulkDeleteOpen(false);
    } catch (error) {
      console.error("Failed deleting selected inventory records", error);
    }
  }

  function requestRecordDelete() {
    if (!view.openedRecord || deleteRecord.isPending) {
      return;
    }

    setRecordIdToDelete(view.openedRecord.id);
  }

  function closeRecordDeleteDialog() {
    if (deleteRecord.isPending) {
      return;
    }

    setRecordIdToDelete(null);
  }

  async function confirmRecordDelete() {
    if (recordIdToDelete === null) {
      return;
    }

    try {
      await deleteRecordById(recordIdToDelete, view.removeOpenedRecord);
      setRecordIdToDelete(null);
    } catch (error) {
      console.error("Failed deleting inventory record", error);
    }
  }

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
      <div className="hidden">
        <div ref={bulkPrintRef}>
          <InventoryRecordBulkPrint records={printableRecords} />
        </div>
      </div>

      <div className="space-y-6">
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
            to={routeContext.backLink}
            className="
              text-slate-500 transition-colors
              hover:text-emerald-700
              dark:text-slate-400
              dark:hover:text-emerald-400
            "
          >
            {routeContext.title}
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
          description={`${routeContext.title} • Manage inventory records for this account.`}
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
          isAssigning={bulkAssign.isPending}
          isDeleting={bulkDelete.isPending}
          onGroupChange={setSelectedGroupId}
          onAssign={assignSelectedGroup}
          onPrint={handleBulkPrint}
          onDelete={requestBulkDelete}
        />

        <InventoryRecordTable
          layout={tableLayout}
          accountId={id}
          inventoryType={inventoryType}
          isDragDisabled={
            Boolean(filters.search.trim()) || filters.groupId !== null
          }
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
          if (!view.openedRecord) {
            return;
          }

          openPublicView(view.openedRecord.qr_uuid);
        }}
        onDelete={requestRecordDelete}
      />

      <ConfirmDialog
        open={isBulkDeleteOpen}
        title="Delete Selected Records"
        description={`Are you sure you want to delete ${selection.selectedCount} selected record${
          selection.selectedCount === 1 ? "" : "s"
        }? This action will remove them from the active inventory.`}
        confirmText="Delete Records"
        loading={bulkDelete.isPending}
        loadingText="Deleting..."
        onClose={closeBulkDeleteDialog}
        onConfirm={confirmBulkDelete}
      />

      <ConfirmDialog
        open={recordIdToDelete !== null}
        title="Delete Inventory Record"
        description="Are you sure you want to delete this inventory record? This action will remove it from the active inventory."
        confirmText="Delete Record"
        loading={deleteRecord.isPending}
        loadingText="Deleting..."
        onClose={closeRecordDeleteDialog}
        onConfirm={confirmRecordDelete}
      />
    </>
  );
}
