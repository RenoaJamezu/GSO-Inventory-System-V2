import { Button, SearchField } from "@/components/ui";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { CirclePlus } from "lucide-react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  onAddAccount: () => void;
  onAddRecord: () => void;

  onGeneratePPESummary: () => void;
  onExportExcel: () => void;
};

export default function InventoryAccountToolbar({
  search,
  onSearchChange,

  onAddAccount,
  onAddRecord,

  onGeneratePPESummary,
  onExportExcel,
}: Props) {
  return (
    <div className="flex justify-between p-4">
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder="Search accounts..."
      />

      <div className="flex items-center gap-2">
        <Button onClick={onAddRecord} className="flex items-center gap-2" variant="secondary">
          <CirclePlus size={18} /> Add Record
        </Button>

        <Button onClick={onAddAccount} className="flex items-center gap-2">
          <CirclePlus size={18} /> Add Account
        </Button>

        <Dropdown trigger={<Button variant="secondary">Tools ▾</Button>}>
          <DropdownItem onClick={onGeneratePPESummary}>
            📄 Generate PPE Summary
          </DropdownItem>

          <DropdownItem onClick={onExportExcel}>📤 Export Excel</DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}
