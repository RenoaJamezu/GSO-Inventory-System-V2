import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useInventoryAccount } from "@/features/inventory-accounts";

import GroupsTable from "../components/GroupsTable";
import GroupDialog from "../components/GroupDialog";

import { useGroups } from "../hooks/useGroups";

import type { Group } from "../types";

export default function GroupsPage() {
  const { accountId } = useParams();

  const id = Number(accountId);

  const { data: account, isLoading: accountLoading } = useInventoryAccount(id);

  const { data: groups = [], isLoading: groupsLoading } = useGroups(id);

  const [open, setOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  if (accountLoading || groupsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const handleCreate = () => {
    setSelectedGroup(null);
    setOpen(true);
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Link to="/inventory-accounts" className="text-blue-600 hover:underline">
        ← Back
      </Link>

      <div className="mt-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {account?.account_title}
          </h1>

          <p className="text-gray-500">Manage inventory groups</p>
        </div>

        <button
          onClick={handleCreate}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Add Group
        </button>
      </div>

      <GroupsTable groups={groups} onEdit={handleEdit} />

      <GroupDialog
        open={open}
        accountId={id}
        group={selectedGroup}
        onClose={handleClose}
      />
    </div>
  );
}
