import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createVehicleRecord,
  deleteVehicleRecord,
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
  return useQuery({
    queryKey: vehicleRecordKeys.detail(id ?? 0),

    queryFn: () => getVehicleRecord(id!),

    enabled: id !== null,
  });
}

export function useCreateVehicleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVehicleRecord,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vehicleRecordKeys.all,
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
        queryKey: vehicleRecordKeys.all,
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
        queryKey: vehicleRecordKeys.all,
      });
    },
  });
}
