import { useRef } from "react";
import { useInventoryRecordsPage } from "../hooks/useInventoryRecordsPage";
import { useReactToPrint } from "react-to-print";
import InventoryRecordGroupManagementDialog from "../components/groups/InventoryRecordGroupManagementDialog";
import InventoryRecordBulkToolbar from "../components/InventoryRecordBulkToolbar";
import InventoryRecordDialog from "../components/InventoryRecordDialog";
import InventoryRecordsPageHeader from "../components/InventoryRecordsPageHeader";
import InventoryRecordStats from "../components/InventoryRecordStats";
import InventoryRecordToolbar from "../components/InventoryRecordToolbar";
import InventoryRecordSidePanel from "../components/side-panel/InventoryRecordSidePanel";
import InventoryRecordTable from "../components/InventoryRecordTable";
import InventoryRecordBulkPrint from "./InventoryRecordBulkPrint";
import InventoryRecordExcelImportDialog from "../components/import/InventoryRecordExcelImportDialog";

export default function InventoryRecordsPage() {
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

    totalAmount,
    totalGroups,

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

      <div>
        <InventoryRecordsPageHeader
          accountTitle={account.data?.account_title ?? ""}
        />

        <InventoryRecordStats
          totalRecords={filters.filteredRecords.length}
          totalAmount={totalAmount}
          totalGroups={totalGroups}
        />

        <InventoryRecordToolbar
          search={filters.search}
          onSearchChange={filters.setSearch}
          onAddRecord={view.createRecord}
          onImportExcel={view.openImportDialog}
          onDownloadTemplate={downloadTemplate}
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
        onDelete={() => {
          if (!view.openedRecord) return;

          deleteRecordById(view.openedRecord.id, id, view.removeOpenedRecord);
        }}
      />
    </>
  );
}
