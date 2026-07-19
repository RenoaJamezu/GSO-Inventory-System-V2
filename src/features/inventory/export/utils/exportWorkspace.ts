import { workspaceTemplate } from "../templates";

import { loadTemplate } from "./loadTemplate";
import { writeWorkspaceRows } from "./writeWorkspaceRows";
import { downloadWorkbook } from "./downloadWorkbook";

import type { ExportWorkspaceParams } from "../types";

export async function exportWorkspace({
  filename,
  accounts,
}: ExportWorkspaceParams) {
  const workbook = await loadTemplate(workspaceTemplate);

  writeWorkspaceRows(workbook, accounts);

  downloadWorkbook(workbook, filename);
}
