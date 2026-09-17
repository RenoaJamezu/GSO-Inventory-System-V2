export const dashboardKeys = {
  root: ["dashboard"] as const,

  summary: () => [...dashboardKeys.root, "summary"] as const,
};

export const activityKeys = {
  root: ["activity"] as const,

  recent: (limit: number) => [...activityKeys.root, "recent", limit] as const,
};
