import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAccountColumns } from "@/features/account-columns";

import {
  useCreateInventoryRecord,
  useUpdateInventoryRecord,
} from "./useInventoryRecords";

import {
  createInventoryRecordSchema,
  type InventoryRecordFormValues,
} from "../schemas/InventoryRecordSchema";

import type { InventoryRecord } from "../types";
import { useInventoryRecordGroups } from "./useInventoryRecordGroups";

type Props = {
  open: boolean;
  accountId: number;
  record?: InventoryRecord | null;
  onSuccess: () => void;
};

export function useInventoryRecordForm({
  open,
  accountId,
  record,
  onSuccess,
}: Props) {
  const { data: columns = [] } = useAccountColumns(accountId);
  const { data: groups = [] } = useInventoryRecordGroups(accountId);

  const schema = useMemo(() => createInventoryRecordSchema(columns), [columns]);

  const createMutation = useCreateInventoryRecord();
  const updateMutation = useUpdateInventoryRecord();

  const isEdit = Boolean(record);

  const [groupId, setGroupId] = useState<number | null>(null);

  const { control, reset, handleSubmit } = useForm<InventoryRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!open) return;

    if (!columns.length) return;

    if (record) {
      reset(
        Object.fromEntries(
          columns.map((column) => [
            column.field_key,
            record.data?.[column.field_key] ?? "",
          ]),
        ),
      );

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGroupId(record.group_id);

      return;
    }

    const values: Record<string, unknown> = {};

    columns.forEach((column) => {
      values[column.field_key] = column.data_type === "boolean" ? false : "";
    });

    reset(values);
    setGroupId(null);
  }, [open, columns, record, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (isEdit && record) {
      await updateMutation.mutateAsync({
        id: record.id,
        values: {
          group_id: groupId,
          data: values,
        },
      });
    } else {
      await createMutation.mutateAsync({
        account_id: accountId,
        group_id: groupId,
        data: values,
      });
    }

    reset();
    setGroupId(null);
    await onSuccess();
  });

  return {
    columns,
    groups,

    control,

    groupId,
    setGroupId,

    onSubmit,

    isEdit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
