import { ColumnDef } from "@tanstack/react-table";

/**
 * Cutoff Period Table
 */
export type CutoffPeriodData = {
  commissionPendingSettlement: string;
  commissionSettled: string;
};

export const cutoffPeriodColumns: ColumnDef<CutoffPeriodData>[] = [
  {
    accessorKey: "commissionPendingSettlement",
    header: "COMMISSION PENDING SETTLEMENT",
  },
  {
    accessorKey: "commissionSettled",
    header: "COMMISSION SETTLED",
  },
];

/**
 * Network Overview Table
 */
export type NetworkOverviewData = {
  network: string;
  approved: number | string;
  pending: number | string;
  suspended: number | string;
  summary: number | string;
};

export const networkOverviewColumns: ColumnDef<NetworkOverviewData>[] = [
  {
    accessorKey: "network",
    header: "NETWORK",
    cell: ({ row }) => (
      <>
        <h1 className="font-bold">{row.getValue("network")}</h1>
      </>
    ),
  },
  { accessorKey: "approved", header: "APPROVED" },
  { accessorKey: "pending", header: "PENDING" },
  { accessorKey: "suspended", header: "SUSPENDED" },
  { accessorKey: "summary", header: "SUMMARY" },
];

/**
 * Overall Summary (E-Games & Sportsbetting) Table
 */
export type OverallSummaryData = {
  item: string;
  pendingSettlement: number | string;
  previousSettled: number | string;
  summary: number | string;
};

export const overallSummaryColumns: ColumnDef<OverallSummaryData>[] = [
  {
    accessorKey: "item",
    header: "ITEM",
    cell: ({ row }) => (
      <>
        <h1 className="font-bold">{row.getValue("item")}</h1>
      </>
    ),
  },
  {
    accessorKey: "pendingSettlement",
    header: "PENDING SETTLEMENT",
    cell: ({ row }) => {
      const value = row.getValue("pendingSettlement");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
  {
    accessorKey: "previousSettled",
    header: "PREVIOUS SETTLED (Cumulative)",
    cell: ({ row }) => {
      const value = row.getValue("previousSettled");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
  {
    accessorKey: "summary",
    header: "SUMMARY",
    cell: ({ row }) => {
      const value = row.getValue("summary");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
];

/**
 * E-Games Table
 */
export type EGamesData = {
  item: string;
  dailyOverview: number | string;
  pendingSettlement: number | string;
  previousSettled: number | string;
  summary: number | string;
};

export const eGamesColumns: ColumnDef<EGamesData>[] = [
  {
    accessorKey: "item",
    header: "ITEM",
    cell: ({ row }) => (
      <>
        <h1 className="font-bold">{row.getValue("item")}</h1>
      </>
    ),
  },
  {
    accessorKey: "dailyOverview",
    header: "DAILY OVERVIEW",
    cell: ({ row }) => {
      const value = row.getValue("dailyOverview");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
  {
    accessorKey: "pendingSettlement",
    header: "PENDING SETTLEMENT",
    cell: ({ row }) => {
      const value = row.getValue("pendingSettlement");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
  {
    accessorKey: "previousSettled",
    header: "PREVIOUS SETTLED ",
    cell: ({ row }) => {
      const value = row.getValue("previousSettled");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
  {
    accessorKey: "summary",
    header: "SUMMARY",
    cell: ({ row }) => {
      const value = row.getValue("summary");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
];

/**
 * Sportsbetting Table
 */
export type SportsbettingData = {
  item: string;
  dailyOverview: number | string;
  pendingSettlement: number | string;
  previousSettled: number | string;
  summary: number | string;
};

export const sportsbettingColumns: ColumnDef<SportsbettingData>[] = [
  {
    accessorKey: "item",
    header: "ITEM",
    cell: ({ row }) => (
      <>
        <h1 className="font-bold">{row.getValue("item")}</h1>
      </>
    ),
  },
  {
    accessorKey: "dailyOverview",
    header: "DAILY OVERVIEW",
    cell: ({ row }) => {
      const value = row.getValue("dailyOverview");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
  {
    accessorKey: "pendingSettlement",
    header: "PENDING SETTLEMENT",
    cell: ({ row }) => {
      const value = row.getValue("pendingSettlement");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
  {
    accessorKey: "previousSettled",
    header: "PREVIOUS SETTLED ",
    cell: ({ row }) => {
      const value = row.getValue("previousSettled");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
  {
    accessorKey: "summary",
    header: "SUMMARY",
    cell: ({ row }) => {
      const value = row.getValue("summary");
      return ["0", 0, "$0", "$0.00"].includes(value as any) ? "_" : value;
    },
  },
];

/**
 * Export all table column definitions
 */
export const tableColumns = {
  cutoffPeriodColumns,
  networkOverviewColumns,
  overallSummaryColumns,
  eGamesColumns,
  sportsbettingColumns,
};
