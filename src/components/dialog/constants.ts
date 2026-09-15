export const dialogMaxWidthClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-7xl",
} as const;

export type DialogMaxWidth = keyof typeof dialogMaxWidthClasses;
