import { CirclePlus, Download, Wrench } from "lucide-react";

import { Button, SearchField } from "@/components/ui";
import { Dropdown } from "@/components/ui/dropdown";

import { PERMISSIONS, usePermissions } from "@/features/auth";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddAccount: () => void;
  onExportExcel: () => void;
};

export default function InventoryAccountToolbar({
  search,
  onSearchChange,
  onAddAccount,
  onExportExcel,
}: Props) {
  const { can } = usePermissions();

  const canManageAccounts = can(PERMISSIONS.INVENTORY_MANAGE_ACCOUNTS);

  return (
    <div
      className="
        flex flex-col gap-3
        border-b border-slate-200
        p-4
        dark:border-slate-800

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div className="w-full lg:max-w-xl">
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search account titles..."
        />
      </div>

      <div
        className="
          flex flex-col gap-2

          sm:flex-row
          sm:items-center

          lg:shrink-0
        "
      >
        <Dropdown>
          <Dropdown.Trigger>
            <Button
              variant="secondary"
              className="
                flex w-full
                items-center justify-center gap-2
                whitespace-nowrap
                sm:w-auto
              "
            >
              <Wrench size={16} />
              Tools
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item onClick={onExportExcel}>
              <Download size={16} />
              Export All
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>

        {canManageAccounts && (
          <Button
            onClick={onAddAccount}
            className="
              flex w-full
              items-center justify-center gap-2
              whitespace-nowrap
              sm:w-auto
            "
          >
            <CirclePlus size={17} />
            Add Account
          </Button>
        )}
      </div>
    </div>
  );
}
