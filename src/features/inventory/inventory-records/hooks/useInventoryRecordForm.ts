import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useAccountColumns } from "@/features/inventory/account-columns";

import {
  createInventoryRecordSchema,
  type InventoryRecordFormValues,
} from "../schemas/inventoryRecord.schema";
import type { InventoryRecord, InventoryType } from "../types";

import { useInventoryRecordGroups } from "./useInventoryRecordGroups";
import {
  useCreateInventoryRecord,
  useUpdateInventoryRecord,
} from "./useInventoryRecords";

type Props = {
  accountId: number;
  inventoryType: InventoryType;
  record?: InventoryRecord | null;
  onSuccess: () => void;
};

function getDefaultValue(dataType: string): unknown {
  switch (dataType) {
    case "number":
      return undefined;

    case "boolean":
      return false;

    default:
      return "";
  }
}

export function useInventoryRecordForm({
  accountId,
  inventoryType,
  record,
  onSuccess,
}: Props) {
  const { data: columns = [] } = useAccountColumns(accountId);
  const { data: groups = [] } = useInventoryRecordGroups(accountId);

  const schema = useMemo(() => createInventoryRecordSchema(columns), [columns]);

  const createMutation = useCreateInventoryRecord();
  const updateMutation = useUpdateInventoryRecord();

  const isEdit = Boolean(record);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const [groupId, setGroupId] = useState<number | null>(
    record?.group_id ?? null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!columns.length) {
      return;
    }

    const values = Object.fromEntries(
      columns.map((column) => {
        const storedValue = record?.data?.[column.field_key];

        return [
          column.field_key,
          storedValue ?? getDefaultValue(column.data_type),
        ];
      }),
    );

    reset(values);
  }, [columns, record, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      if (record) {
        await updateMutation.mutateAsync({
          id: record.id,
          account_id: accountId,
          inventory_type: inventoryType,
          values: {
            group_id: groupId,
            data: values,
          },
        });
      } else {
        await createMutation.mutateAsync({
          account_id: accountId,
          inventory_type: inventoryType,
          group_id: groupId,
          data: values,
        });
      }

      await onSuccess();
    } catch (error) {
      console.error("Failed saving inventory record", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to save inventory record.",
      );
    }
  });

  return {
    columns,
    groups,
    control,
    errors,
    groupId,
    setGroupId,
    onSubmit,
    isEdit,
    isSubmitting,
    submitError,
  };
}
