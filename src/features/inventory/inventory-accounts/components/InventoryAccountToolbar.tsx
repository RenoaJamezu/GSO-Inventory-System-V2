import { CirclePlus, Download, Wrench } from "lucide-react";

import { Button, SearchField } from "@/components/ui";

import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

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
  // onAddRecord,
  // onGeneratePPESummary,
  onExportExcel,
}: Props) {
  return (
    <div
      className="
        flex flex-col gap-3
        border-b border-slate-200
        p-4
        dark:border-slate-800
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder="Search account titles..."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onAddAccount} className="flex items-center gap-2">
          <CirclePlus size={17} />
          Add Account
        </Button>

        <Dropdown
          trigger={
            <Button variant="secondary" className="flex items-center gap-2">
              <Wrench size={16} />
              Tools
            </Button>
          }
        >
          <DropdownItem onClick={onExportExcel}>
            <Download size={16} />
            Export Excel
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}
