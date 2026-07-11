import { useAccountColumns } from "@/features/account-columns";
import { useInventoryAccount } from "@/features/inventory-accounts";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateTemplate } from "../utils/generateTemplate";
import { getRecordAmount } from "../utils/getRecordAmount";
import { groupInventoryRecords } from "../utils/groupInventoryRecords";
import { useInventoryRecordFilters } from "./useInventoryRecordFilters";
import { useInventoryRecordGroups } from "./useInventoryRecordGroups";
import {
  useInventoryRecords,
  useBulkAssignGroup,
  useBulkDeleteInventoryRecords,
  useDeleteInventoryRecord,
} from "./useInventoryRecords";
import { useInventoryRecordSelection } from "./useInventoryRecordSelection";
import { useInventoryRecordView } from "./useInventoryRecordView";

export function useInventoryRecordsPage() {
  const { accountId } = useParams();

  const navigate = useNavigate();

  const id = Number(accountId);

  // Queries
  const account = useInventoryAccount(id);
  const records = useInventoryRecords(id);
  const columns = useAccountColumns(id);
  const groups = useInventoryRecordGroups(id);

  // View state
  const view = useInventoryRecordView();

  // Filters
  const filters = useInventoryRecordFilters({
    records: records.data ?? [],
    groups: groups.data ?? [],
  });

  // Selection
  const selection = useInventoryRecordSelection();

  // Bulk mutations
  const bulkAssign = useBulkAssignGroup();
  const bulkDelete = useBulkDeleteInventoryRecords();

  // Delete
  const deleteRecord = useDeleteInventoryRecord();

  // UI State
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const totalAmount = useMemo(() => {
    if (!columns.data) return 0;

    return filters.filteredRecords.reduce((total, record) => {
      return total + (getRecordAmount(columns.data, record.data) ?? 0);
    }, 0);
  }, [filters.filteredRecords, columns.data]);

  const totalGroups = groups.data?.length ?? 0;

  const groupedRecords = useMemo(
    () =>
      groupInventoryRecords({
        records: filters.filteredRecords,
        groups: groups.data ?? [],
      }),
    [filters.filteredRecords, groups.data],
  );

  const isLoading =
    account.isLoading ||
    records.isLoading ||
    columns.isLoading ||
    groups.isLoading;

  async function assignSelectedGroup() {
    if (!selection.selectedIds.length) return;

    await bulkAssign.mutateAsync({
      ids: selection.selectedIds,
      groupId: selectedGroupId ? Number(selectedGroupId) : null,
    });

    selection.clear();
    setSelectedGroupId("");
  }

  async function deleteSelectedRecords() {
    if (!selection.selectedIds.length) return;

    if (
      !window.confirm(
        `Delete ${selection.selectedIds.length} selected record(s)?`,
      )
    ) {
      return;
    }

    await bulkDelete.mutateAsync(selection.selectedIds);

    selection.clear();
  }

  const printableRecords = useMemo(() => {
    if (!records.data || !columns.data) {
      return [];
    }

    return records.data
      .filter((record) => selection.selectedIds.includes(record.id))
      .map((record) => ({
        qrUuid: record.qr_uuid,
        amount: getRecordAmount(columns.data, record.data),
      }));
  }, [records.data, columns.data, selection.selectedIds]);

  async function deleteRecordById(
    id: number,
    accountId: number,
    afterDelete?: () => void,
  ) {
    if (deleteRecord.isPending) return;

    if (!window.confirm("Delete this inventory record?")) {
      return;
    }

    await deleteRecord.mutateAsync({
      id,
      account_id: accountId,
    });

    afterDelete?.();
  }

  function downloadTemplate() {
    if (!account.data) return;

    generateTemplate(columns.data ?? [], account.data);
  }

  function goToColumns() {
    navigate(`/inventory-accounts/${id}/columns`);
  }

  return {
    id,

    account,
    records,
    columns,
    groups,
    groupedRecords,

    filters,
    selection,
    view,

    bulkAssign,
    bulkDelete,

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
  };
}
