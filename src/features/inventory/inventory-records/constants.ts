export function getTheme(inventoryType: string) {
  if (inventoryType === "PAR") {
    return {
      color: "#15803d",
    };
  }

  if (inventoryType === "HIGH_COST") {
    return {
      color: "#eab308",
    };
  }

  return {
    color: "#734f96",
  };
}
