import {
  CirclePlus,
  Columns3,
  Download,
  FileDown,
  FolderCog,
  Upload,
  Wrench,
} from "lucide-react";

import { Button, Dropdown, SearchField } from "@/components/ui";

import { PERMISSIONS, usePermissions } from "@/features/auth";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  onAddRecord: () => void;

  onImportExcel: () => void;
  onDownloadTemplate: () => void;
  onExportExcel: () => void;
  onManageColumns: () => void;
  onManageGroups: () => void;
};

export default function InventoryRecordToolbar({
  search,
  onSearchChange,

  onAddRecord,

  onImportExcel,
  onDownloadTemplate,
  onExportExcel,
  onManageColumns,
  onManageGroups,
}: Props) {
  const { can } = usePermissions();

  const canCreate = can(PERMISSIONS.INVENTORY_CREATE);
  const canImport = can(PERMISSIONS.INVENTORY_IMPORT);
  const canExport = can(PERMISSIONS.INVENTORY_EXPORT);

  const canManageColumns = can(PERMISSIONS.INVENTORY_MANAGE_COLUMNS);

  const canManageGroups = can(PERMISSIONS.INVENTORY_MANAGE_GROUPS);

  return (
    <section
      className="
        flex flex-col gap-3
        rounded-lg border
        border-slate-200
        bg-white p-4
        dark:border-slate-800
        dark:bg-slate-900
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div className="w-full lg:max-w-md">
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search inventory records..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canCreate && (
          <Button onClick={onAddRecord} className="flex items-center gap-2">
            <CirclePlus size={17} />
            Add Record
          </Button>
        )}

        <Dropdown>
          <Dropdown.Trigger>
            <Button variant="secondary" className="flex items-center gap-2">
              <Wrench size={16} />
              Tools
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            {canImport && (
              <>
                <Dropdown.Item onClick={onImportExcel}>
                  <Upload size={16} />
                  Import Excel
                </Dropdown.Item>

                <Dropdown.Item onClick={onDownloadTemplate}>
                  <FileDown size={16} />
                  Download Template
                </Dropdown.Item>
              </>
            )}

            {canExport && (
              <Dropdown.Item onClick={onExportExcel}>
                <Download size={16} />
                Export Excel
              </Dropdown.Item>
            )}

            {(canManageColumns || canManageGroups) && <Dropdown.Separator />}

            {canManageColumns && (
              <Dropdown.Item onClick={onManageColumns}>
                <Columns3 size={16} />
                Manage Columns
              </Dropdown.Item>
            )}

            {canManageGroups && (
              <Dropdown.Item onClick={onManageGroups}>
                <FolderCog size={16} />
                Manage Groups
              </Dropdown.Item>
            )}
          </Dropdown.Content>
        </Dropdown>
      </div>
    </section>
  );
}
