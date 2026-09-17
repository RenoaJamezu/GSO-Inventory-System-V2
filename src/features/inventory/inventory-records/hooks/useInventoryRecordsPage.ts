import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useAccountColumns } from "@/features/inventory/account-columns";
import { useInventoryAccount } from "@/features/inventory/inventory-accounts";
import { useAccountColumnGroups } from "@/features/inventory/table-merges";

import { exportInventoryRecords } from "../utils/exportInventoryRecords";
import { generateTemplate } from "../utils/generateTemplate";
import { getInventoryRouteContext } from "../utils/getInventoryRouteContext";
import { getRecordAmount } from "../utils/getRecordAmount";

import { useInventoryRecordFilters } from "./useInventoryRecordFilters";
import { useInventoryRecordGroups } from "./useInventoryRecordGroups";
import {
  useBulkAssignGroup,
  useBulkDeleteInventoryRecords,
  useDeleteInventoryRecord,
  useInventoryRecords,
} from "./useInventoryRecords";
import { useInventoryRecordSelection } from "./useInventoryRecordSelection";
import { useInventoryRecordView } from "./useInventoryRecordView";
import { useInventoryTableLayout } from "./useInventoryTableLayout";

export function useInventoryRecordsPage() {
  const { accountId } = useParams();
  const { pathname } = useLocation();

  const routeContext = getInventoryRouteContext(pathname);

  if (!routeContext) {
    throw new Error(`Unsupported inventory route: ${pathname}`);
  }

  const { inventoryType, workspace } = routeContext;

  const navigate = useNavigate();
  const id = Number(accountId);

  const account = useInventoryAccount(id);
  const records = useInventoryRecords(id, inventoryType);
  const columns = useAccountColumns(id);
  const groups = useInventoryRecordGroups(id);
  const columnGroups = useAccountColumnGroups(id);

  const view = useInventoryRecordView();

  const filters = useInventoryRecordFilters({
    records: records.data ?? [],
    groups: groups.data ?? [],
  });

  const selection = useInventoryRecordSelection();

  const bulkAssign = useBulkAssignGroup();
  const bulkDelete = useBulkDeleteInventoryRecords();
  const deleteRecord = useDeleteInventoryRecord();

  const [selectedGroupId, setSelectedGroupId] = useState("");

  const totalAmount = useMemo(() => {
    if (!columns.data) {
      return 0;
    }

    return filters.filteredRecords.reduce((total, record) => {
      return total + (getRecordAmount(columns.data, record.data) ?? 0);
    }, 0);
  }, [filters.filteredRecords, columns.data]);

  const totalGroups = groups.data?.length ?? 0;

  const tableLayout = useInventoryTableLayout({
    columns: columns.data ?? [],
    records: filters.filteredRecords,
    groups: groups.data ?? [],
    columnGroups: columnGroups.data ?? [],
  });

  const isLoading =
    account.isLoading ||
    records.isLoading ||
    columns.isLoading ||
    groups.isLoading ||
    columnGroups.isLoading;

  async function assignSelectedGroup() {
    if (!selection.selectedIds.length || bulkAssign.isPending) {
      return;
    }

    await bulkAssign.mutateAsync({
      ids: selection.selectedIds,
      account_id: id,
      inventory_type: inventoryType,
      group_id: selectedGroupId ? Number(selectedGroupId) : null,
    });

    selection.clear();
    setSelectedGroupId("");
  }

  async function deleteSelectedRecords() {
    if (!selection.selectedIds.length || bulkDelete.isPending) {
      return;
    }

    await bulkDelete.mutateAsync({
      ids: selection.selectedIds,
      account_id: id,
      inventory_type: inventoryType,
    });

    selection.clear();
  }

  const printableRecords = useMemo(() => {
    if (!records.data) {
      return [];
    }

    const selectedSet = new Set(selection.selectedIds);

    return records.data
      .filter((record) => selectedSet.has(record.id))
      .map((record) => ({
        qrUuid: record.qr_uuid,
        inventoryType: record.inventory_type,
      }));
  }, [records.data, selection.selectedIds]);

  async function deleteRecordById(recordId: number, afterDelete?: () => void) {
    if (deleteRecord.isPending) {
      return;
    }

    await deleteRecord.mutateAsync({
      id: recordId,
      account_id: id,
      inventory_type: inventoryType,
    });

    afterDelete?.();
  }

  function downloadTemplate() {
    if (!account.data) {
      return;
    }

    generateTemplate(columns.data ?? [], account.data);
  }

  function goToColumns() {
    navigate(`/${workspace}/${id}/columns`);
  }

  function openPublicView(uuid: string) {
    window.open(`/public/${uuid}`, "_blank", "noopener,noreferrer");
  }

  function exportRecordsToExcel() {
    if (!account.data) {
      return;
    }

    exportInventoryRecords({
      layout: tableLayout,
      accountTitle: account.data.account_title,
    });
  }

  return {
    id,
    account,
    records,
    columns,
    groups,
    tableLayout,
    filters,
    selection,
    view,
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
    totalAmount,
    totalGroups,
    inventoryType,
    isLoading,
  };
}
