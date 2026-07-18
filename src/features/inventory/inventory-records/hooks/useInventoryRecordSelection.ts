import { useCallback, useMemo, useState } from "react";

export function useInventoryRecordSelection() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggle = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const toggleAll = useCallback((visibleIds: number[]) => {
    setSelectedIds((prev) => {
      const visibleSelected = visibleIds.every((id) => prev.includes(id));

      if (visibleSelected) {
        return prev.filter((id) => !visibleIds.includes(id));
      }

      const merged = new Set(prev);

      visibleIds.forEach((id) => merged.add(id));

      return [...merged];
    });
  }, []);

  const toggleGroup = useCallback((groupIds: number[]) => {
    setSelectedIds((prev) => {
      const allSelected = groupIds.every((id) => prev.includes(id));

      if (allSelected) {
        return prev.filter((id) => !groupIds.includes(id));
      }

      const merged = new Set(prev);

      groupIds.forEach((id) => merged.add(id));

      return [...merged];
    });
  }, []);

  const isGroupSelected = useCallback(
    (groupIds: number[]) =>
      groupIds.length > 0 && groupIds.every((id) => selectedSet.has(id)),
    [selectedSet],
  );

  const isGroupIndeterminate = useCallback(
    (groupIds: number[]) => {
      const count = groupIds.filter((id) => selectedSet.has(id)).length;

      return count > 0 && count < groupIds.length;
    },
    [selectedSet],
  );

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    selectedIds,
    selectedSet,
    selectedCount: selectedIds.length,

    toggle,
    toggleAll,
    toggleGroup,

    isGroupSelected,
    isGroupIndeterminate,

    clear,
  };
}
