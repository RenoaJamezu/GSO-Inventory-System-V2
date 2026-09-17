export const vehicleRecordKeys = {
  root: ["vehicle-records"] as const,

  lists: () => [...vehicleRecordKeys.root, "list"] as const,

  list: () => vehicleRecordKeys.lists(),

  details: () => [...vehicleRecordKeys.root, "detail"] as const,

  detail: (id: number) => [...vehicleRecordKeys.details(), id] as const,
};
