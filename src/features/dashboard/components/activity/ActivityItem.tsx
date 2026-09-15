import { FilePenLine, FilePlus2, Trash2 } from "lucide-react";

import type { ActivityLog } from "../../activity.types";
import {
  getActivityUserName,
  formatEntityName,
  formatActivityDate,
} from "../../utils/activity.utils";

type Props = {
  activity: ActivityLog;

  onClick: (activity: ActivityLog) => void;
};

function getActionAppearance(action: ActivityLog["action"]) {
  switch (action) {
    case "CREATE":
      return {
        icon: FilePlus2,

        iconClass:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
      };

    case "UPDATE":
      return {
        icon: FilePenLine,

        iconClass:
          "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
      };

    case "SOFT_DELETE":
      return {
        icon: Trash2,

        iconClass:
          "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
      };
  }
}

export default function ActivityItem({ activity, onClick }: Props) {
  const appearance = getActionAppearance(activity.action);

  const Icon = appearance.icon;

  const userName = getActivityUserName(activity);

  return (
    <button
      type="button"
      onClick={() => onClick(activity)}
      className="
        flex w-full items-start gap-3
        px-4 py-4 text-left
        transition-colors
        hover:bg-slate-50
        focus:outline-none
        focus-visible:bg-slate-50
        sm:px-5
        dark:hover:bg-slate-800/50
        dark:focus-visible:bg-slate-800/50
      "
    >
      <div
        className={`
          mt-0.5 flex h-9 w-9
          shrink-0 items-center
          justify-center rounded-md
          ${appearance.iconClass}
        `}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-5 text-slate-800 dark:text-slate-200">
          <span className="font-semibold">{userName}</span>{" "}
          {activity.description}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>{formatEntityName(activity.entity_type)}</span>

          {activity.entity_id && (
            <>
              <span
                aria-hidden="true"
                className="text-slate-300 dark:text-slate-600"
              >
                •
              </span>

              <span>Record #{activity.entity_id}</span>
            </>
          )}

          <span
            aria-hidden="true"
            className="text-slate-300 dark:text-slate-600"
          >
            •
          </span>

          <time dateTime={activity.created_at}>
            {formatActivityDate(activity.created_at)}
          </time>
        </div>
      </div>
    </button>
  );
}
