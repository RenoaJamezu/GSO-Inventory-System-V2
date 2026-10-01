import { useCallback, useMemo, useState } from "react";

export function useVehicleRecordSelection() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggle = useCallback((id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }, []);

  const toggleAll = useCallback((visibleIds: number[]) => {
    setSelectedIds((current) => {
      const allSelected =
        visibleIds.length > 0 && visibleIds.every((id) => current.includes(id));

      if (allSelected) {
        return current.filter((id) => !visibleIds.includes(id));
      }

      return [...new Set([...current, ...visibleIds])];
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    selectedIds,
    selectedSet,
    selectedCount: selectedIds.length,
    toggle,
    toggleAll,
    clear,
  };
}
