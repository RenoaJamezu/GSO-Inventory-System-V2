import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ellipsis, GripVertical, Pencil, Trash2 } from "lucide-react";

import { Button, Dropdown } from "@/components/ui";
import { formatCurrency } from "@/lib/utils/format";

import type { InventoryAccount } from "../types";

interface SortableInventoryAccountRowProps {
  account: InventoryAccount;
  index: number;
  canManageAccounts: boolean;
  canReorder: boolean;
  isReordering: boolean;
  onOpen: (accountId: number) => void;
  onEdit: (account: InventoryAccount) => void;
  onDelete: (account: InventoryAccount) => void;
}

export default function SortableInventoryAccountRow({
  account,
  index,
  canManageAccounts,
  canReorder,
  isReordering,
  onOpen,
  onEdit,
  onDelete,
}: SortableInventoryAccountRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: account.id,
    disabled: !canReorder || isReordering,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={() => onOpen(account.id)}
      className={[
        "group cursor-pointer",
        "text-sm text-slate-700",
        "transition-colors",
        "dark:text-slate-300",
        isDragging
          ? [
              "relative z-20",
              "bg-emerald-50",
              "shadow-sm",
              "dark:bg-emerald-950/30",
            ].join(" ")
          : [
              "bg-white",
              "hover:bg-emerald-50/50",
              "dark:bg-slate-900",
              "dark:hover:bg-emerald-950/20",
            ].join(" "),
      ].join(" ")}
    >
      {canManageAccounts && (
        <td
          className="w-12 px-2 py-3.5 text-center"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={!canReorder || isReordering}
            className="
              inline-flex h-8 w-8
              cursor-grab
              touch-none
              items-center justify-center
              rounded-md
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-600/30
              active:cursor-grabbing
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:text-slate-500
              dark:hover:bg-slate-800
              dark:hover:text-slate-200
            "
            aria-label={
              canReorder
                ? `Reorder ${account.account_title}`
                : `Clear search to reorder ${account.account_title}`
            }
          >
            <GripVertical size={18} />
          </button>
        </td>
      )}

      <td className="w-20 px-4 py-3.5 text-center text-slate-500 dark:text-slate-500">
        {index + 1}
      </td>

      <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
        {account.account_title}
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums">
        {formatCurrency(account.book_value)}
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
        {formatCurrency(account.per_inventory_report)}
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums">
        {formatCurrency(account.variance)}
      </td>

      {canManageAccounts && (
        <td
          className="w-16 px-3 py-2"
          onClick={(event) => event.stopPropagation()}
        >
          <Dropdown>
            <Dropdown.Trigger>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isReordering}
                aria-label={`Actions for ${account.account_title}`}
              >
                <Ellipsis size={18} />
              </Button>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Item onClick={() => onEdit(account)}>
                <Pencil size={16} />
                Edit Account
              </Dropdown.Item>

              <Dropdown.Item variant="danger" onClick={() => onDelete(account)}>
                <Trash2 size={16} />
                Delete Account
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </td>
      )}
    </tr>
  );
}
