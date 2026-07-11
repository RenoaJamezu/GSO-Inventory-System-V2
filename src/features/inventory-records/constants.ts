export function getTheme(amount: number) {
  if (amount >= 50000) {
    return {
      color: "#15803d",
    };
  }

  if (amount >= 15000) {
    return {
      color: "#eab308",
    };
  }

  return {
    color: "#734f96",
  };
}
