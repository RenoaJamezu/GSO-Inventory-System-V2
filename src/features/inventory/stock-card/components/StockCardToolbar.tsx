import { Plus } from "lucide-react";

import { Button, SearchField } from "@/components/ui";

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
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-md">
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search item or stock no..."
        />
      </div>

      <Button onClick={onCreate}>
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}
