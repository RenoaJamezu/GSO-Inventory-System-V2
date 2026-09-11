export const vehicleRecordKeys = {
  all: ["vehicle-records"] as const,

  list: () => [...vehicleRecordKeys.all, "list"] as const,

  detail: (id: number) => [...vehicleRecordKeys.all, "detail", id] as const,
};
