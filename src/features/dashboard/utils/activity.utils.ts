import type { ActivityAction, ActivityLog } from "../activity.types";

export function getActivityUserName(activity: ActivityLog) {
  if (!activity.user) {
    return "Unknown user";
  }

  const name = [activity.user.first_name, activity.user.last_name]
    .filter(Boolean)
    .join(" ");

  return name || activity.user.email;
}

export function formatActivityDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatEntityName(entityType: string) {
  const labels: Record<string, string> = {
    inventory_accounts: "Inventory Account",
    account_columns: "Account Column",
    inventory_records: "Inventory Record",
    groups: "Inventory Group",
    stock_cards: "Stock Card",
    stock_card_transactions: "Stock Card Transaction",
    vehicle_records: "Vehicle Record",
  };

  return (
    labels[entityType] ??
    entityType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export function getActionLabel(action: ActivityAction) {
  switch (action) {
    case "CREATE":
      return "Created";

    case "UPDATE":
      return "Updated";

    case "SOFT_DELETE":
      return "Deleted";
  }
}

export function getChangedFields(activity: ActivityLog) {
  if (
    activity.action !== "UPDATE" ||
    !activity.old_data ||
    !activity.new_data
  ) {
    return [];
  }

  const ignoredFields = new Set(["updated_at", "created_at"]);

  const keys = new Set([
    ...Object.keys(activity.old_data),
    ...Object.keys(activity.new_data),
  ]);

  return [...keys]
    .filter((key) => !ignoredFields.has(key))
    .filter((key) => {
      const oldValue = activity.old_data?.[key];
      const newValue = activity.new_data?.[key];

      return JSON.stringify(oldValue) !== JSON.stringify(newValue);
    })
    .map((key) => ({
      field: key,
      oldValue: activity.old_data?.[key],
      newValue: activity.new_data?.[key],
    }));
}
