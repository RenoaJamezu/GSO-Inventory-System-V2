import { matchPath } from "react-router-dom";

import { pageTitles } from "./pageTitles";

export function getPageTitle(pathname: string): string {
  for (const [pattern, title] of Object.entries(pageTitles)) {
    if (matchPath(pattern, pathname)) {
      return title;
    }
  }

  return "Inventory Management System";
}
