import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { Button } from "@/components/ui";

import type { ActivityLog } from "../../activity.types";
import {
  getChangedFields,
  getActivityUserName,
  formatActivityDate,
  getActionLabel,
  formatEntityName,
} from "../../utils/activity.utils";

type Props = {
  activity: ActivityLog | null;

  onClose: () => void;
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function formatFieldName(field: string) {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ActivityDetailsDialog({ activity, onClose }: Props) {
  if (!activity) {
    return null;
  }

  const changes = getChangedFields(activity);

  return (
    <Dialog open={Boolean(activity)} onClose={onClose} maxWidth="lg">
      <DialogHeader title={""}>Activity Details</DialogHeader>

      <DialogBody>
        <div className="space-y-6">
          <div>
            <p className="text-base font-medium text-slate-900 dark:text-slate-100">
              {getActivityUserName(activity)} {activity.description}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {formatActivityDate(activity.created_at)}
            </p>
          </div>

          <dl className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-950/40">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                User
              </dt>

              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {getActivityUserName(activity)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Role
              </dt>

              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {activity.user?.role ?? "—"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Action
              </dt>

              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {getActionLabel(activity.action)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Module
              </dt>

              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {formatEntityName(activity.entity_type)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Record
              </dt>

              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {activity.entity_id ? `#${activity.entity_id}` : "—"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Email
              </dt>

              <dd className="mt-1 break-all text-sm text-slate-900 dark:text-slate-100">
                {activity.user?.email ?? "—"}
              </dd>
            </div>
          </dl>

          {activity.action === "UPDATE" && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Changes
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Values changed during this activity.
              </p>

              {changes.length === 0 ? (
                <p className="mt-4 rounded-md border border-slate-200 px-4 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  No field changes available.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-950/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Field
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Previous
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          New
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {changes.map((change) => (
                        <tr key={change.field}>
                          <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                            {formatFieldName(change.field)}
                          </td>

                          <td className="whitespace-pre-wrap px-4 py-3 text-slate-600 dark:text-slate-400">
                            {formatValue(change.oldValue)}
                          </td>

                          <td className="whitespace-pre-wrap px-4 py-3 text-slate-900 dark:text-slate-100">
                            {formatValue(change.newValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
