export const publicRecordKeys = {
  root: ["public-records"] as const,

  details: () => [...publicRecordKeys.root, "detail"] as const,

  detail: (uuid: string) => [...publicRecordKeys.details(), uuid] as const,
};
