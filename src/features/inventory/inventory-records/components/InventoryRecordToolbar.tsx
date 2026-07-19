import { Button, SearchField } from "@/components/ui";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui/dropdown";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  onAddRecord: () => void;

  onImportExcel: () => void;
  onDownloadTemplate: () => void;
  onManageColumns: () => void;
  onManageGroups: () => void;
};

export default function InventoryRecordToolbar({
  search,
  onSearchChange,

  onAddRecord,

  onImportExcel,
  onDownloadTemplate,
  onManageColumns,
  onManageGroups,
}: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="w-full lg:max-w-md">
          <SearchField
            value={search}
            onChange={onSearchChange}
            placeholder="Search inventory records..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={onAddRecord}>Add Record</Button>

          <Dropdown trigger={<Button variant="secondary">Tools ▾</Button>}>
            <DropdownItem onClick={onImportExcel}>📥 Import Excel</DropdownItem>

            <DropdownItem onClick={onDownloadTemplate}>
              📄 Download Template
            </DropdownItem>

            <DropdownDivider />

            <DropdownItem onClick={onManageColumns}>
              📑 Manage Columns
            </DropdownItem>

            <DropdownItem onClick={onManageGroups}>
              📂 Manage Groups
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </section>
  );
}
