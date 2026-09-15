import { Plus } from "lucide-react";

import { Button, SearchField } from "@/components/ui";

import { PERMISSIONS, usePermissions } from "@/features/auth";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
};

export default function StockCardToolbar({
  search,
  onSearchChange,
  onCreate,
}: Props) {
  const { can } = usePermissions();

  const canCreate = can(PERMISSIONS.STOCK_CARD_CREATE);

  return (
    <div
      className="
        flex flex-col gap-3
        p-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="w-full sm:max-w-md">
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search item or stock no..."
        />
      </div>

      {canCreate && (
        <Button onClick={onCreate} className="flex items-center gap-2">
          <Plus size={17} />
          Add Item
        </Button>
      )}
    </div>
  );
}
