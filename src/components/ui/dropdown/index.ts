import DropdownRoot from "./Dropdown";
import DropdownContent from "./DropdownContent";
import DropdownItem from "./DropdownItem";
import DropdownSeparator from "./DropdownSeparator";
import DropdownTrigger from "./DropdownTrigger";

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Separator: DropdownSeparator,
});

export type { DropdownProps } from "./Dropdown";
export type { DropdownContentProps } from "./DropdownContent";
export type { DropdownItemProps, DropdownItemVariant } from "./DropdownItem";
export type { DropdownSeparatorProps } from "./DropdownSeparator";
export type { DropdownTriggerProps } from "./DropdownTrigger";
