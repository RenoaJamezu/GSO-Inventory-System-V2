import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  bulkDeleteVehicleRecords,
  createVehicleRecord,
  deleteVehicleRecord,
  getAvailableMotorVehicleInventoryRecords,
  getVehicleRecord,
  getVehicleRecords,
  updateVehicleRecord,
} from "../api/vehicleRecords.api";
import { vehicleRecordKeys } from "../queryKeys";

export function useVehicleRecords() {
  return useQuery({
    queryKey: vehicleRecordKeys.list(),
    queryFn: getVehicleRecords,
  });
}

export function useVehicleRecord(id: number | null) {
  const isValidId = id !== null && Number.isFinite(id) && id > 0;

  return useQuery({
    queryKey: vehicleRecordKeys.detail(id ?? 0),
    queryFn: () => getVehicleRecord(id as number),
    enabled: isValidId,
  });
}

export function useCreateVehicleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVehicleRecord,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vehicleRecordKeys.lists(),
      });
    },
  });
}

export function useUpdateVehicleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVehicleRecord,

    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({
        queryKey: vehicleRecordKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: vehicleRecordKeys.detail(vehicle.id),
      });
    },
  });
}

export function useDeleteVehicleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVehicleRecord,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vehicleRecordKeys.lists(),
      });
    },
  });
}

export function useAvailableMotorVehicleInventoryRecords(
  currentInventoryRecordId?: number | null,
) {
  return useQuery({
    queryKey: [
      "vehicle-records",
      "available-motor-vehicles",
      currentInventoryRecordId ?? null,
    ],
    queryFn: () =>
      getAvailableMotorVehicleInventoryRecords(currentInventoryRecordId),
  });
}

export function useBulkDeleteVehicleRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteVehicleRecords,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vehicleRecordKeys.lists(),
      });
    },
  });
}
