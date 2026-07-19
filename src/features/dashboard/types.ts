export interface DashboardSummary {
  par: DashboardInventorySummary;
  highCost: DashboardInventorySummary;
  lowCost: DashboardInventorySummary;
}

export interface DashboardInventorySummary {
  total: number;
  records: number;
}
