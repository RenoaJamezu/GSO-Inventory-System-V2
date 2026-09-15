import { ExternalLink, Pencil, Printer, Trash2 } from "lucide-react";

import { Button } from "@/components/ui";

import { PERMISSIONS, usePermissions } from "@/features/auth";

type Props = {
  onEdit: () => void;
  onPrintQr: () => void;
  onPublicView: () => void;
  onDelete: () => void;
};

export default function InventoryRecordActions({
  onEdit,
  onPrintQr,
  onPublicView,
  onDelete,
}: Props) {
  const { can } = usePermissions();

  const canEdit = can(PERMISSIONS.INVENTORY_UPDATE);

  const canDelete = can(PERMISSIONS.INVENTORY_DELETE);

  const canPrint = can(PERMISSIONS.INVENTORY_PRINT);

  return (
    <section
      className="
        border-b border-slate-200
        px-6 py-6
        dark:border-slate-800
      "
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Actions
      </h3>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {canPrint && (
          <Button
            variant="secondary"
            onClick={onPrintQr}
            className="flex items-center justify-center gap-2"
          >
            <Printer size={16} />
            Print QR
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={onPublicView}
          className="flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          Public View
        </Button>

        {canEdit && (
          <Button
            onClick={onEdit}
            className="flex items-center justify-center gap-2"
          >
            <Pencil size={16} />
            Edit Record
          </Button>
        )}

        {canDelete && (
          <Button
            variant="danger"
            onClick={onDelete}
            className="flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete Record
          </Button>
        )}
      </div>
    </section>
  );
}
