import type { ActivityLog } from "../../activity.types";

import ActivityItem from "./ActivityItem";

type Props = {
  activities: ActivityLog[];

  onSelect: (activity: ActivityLog) => void;
};

export default function ActivityList({ activities, onSelect }: Props) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}
