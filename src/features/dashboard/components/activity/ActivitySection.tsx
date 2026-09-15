import { History, RefreshCw } from "lucide-react";
import { useState } from "react";

import type { ActivityLog } from "../../activity.types";

import { useRecentActivity } from "../../hooks/useActivity";

import ActivityDetailsDialog from "./ActivityDetailsDialog";
import ActivityList from "./ActivityList";

function ActivityLoading() {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <div key={index} className="flex animate-pulse gap-3 px-5 py-4">
          <div className="h-9 w-9 shrink-0 rounded-md bg-slate-100 dark:bg-slate-800" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />

            <div className="h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivitySection() {
  const {
    data: activities = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useRecentActivity(10);

  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(
    null,
  );

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-5 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <History
                size={18}
                className="text-emerald-700 dark:text-emerald-400"
              />

              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Recent Activity
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Latest changes made by system users.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="
              inline-flex h-9 items-center
              gap-2 rounded-md border
              border-slate-200 px-3
              text-sm font-medium
              text-slate-600
              transition-colors
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <ActivityLoading />
        ) : isError ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Unable to load activity.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Try again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <History
              size={26}
              className="mx-auto text-slate-300 dark:text-slate-600"
            />

            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              No activity recorded yet
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              User actions will appear here.
            </p>
          </div>
        ) : (
          <ActivityList
            activities={activities}
            onSelect={setSelectedActivity}
          />
        )}
      </section>

      <ActivityDetailsDialog
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </>
  );
}
