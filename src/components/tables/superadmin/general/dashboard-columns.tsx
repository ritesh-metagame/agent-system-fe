"use client";

import { ColumnDef } from "@tanstack/react-table";

// Updated type for commission data
export type CommissionOverview = {
  id: string; // OPERATOR, PLATINUM, GOLDEN
  pendingCommission: number | string; // Pending commission values
  releasedAllTime: number | string; // Released all time values
};

export type commissionRunningTally = {
  item: string;
  eGames: number | string;
  sportsBetting: number | string;
};

export type CommissionAvailableForSettlement = {
  item: string;
  availableForPayout: number | string;
  settledAllTime: number | string;
};

export const commissionAvailableForSettlementColumns: ColumnDef<CommissionAvailableForSettlement>[] =
  [
    {
      accessorKey: "item",
      header: "",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("item")}</span>
      ),
    },
    {
      accessorKey: "availableForPayout",
      header: "COMMISSION AVAILABLE FOR PAYOUT",
      cell: ({ row }) => {
        const value = row.getValue("availableForPayout");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "settledAllTime",
      header: "SETTLED ALL TIME",
      cell: ({ row }) => {
        const value = row.getValue("settledAllTime");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
  ];

export const commissionRunningTallyColumns: ColumnDef<commissionRunningTally>[] =
  [
    {
      accessorKey: "item",
      header: "",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("item")}</span>
      ),
    },
    {
      accessorKey: "eGames",
      header: "EGAMES",
      cell: ({ row }) => {
        const value = row.getValue("eGames");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "sportsBetting",
      header: "SPORTS BETTING",
      cell: ({ row }) => {
        const value = row.getValue("sportsBetting");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
  ];

export const commissionOverviewColumns: ColumnDef<CommissionOverview>[] = [
  {
    accessorKey: "id",
    header: "", // Empty header for first column
    cell: ({ row }) => <span className="font-bold">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "pendingCommission",
    header: "PENDING COMMISSION",
    cell: ({ row }) => {
      // Format numbers with commas if needed
      const value = row.getValue("pendingCommission");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
  {
    accessorKey: "releasedAllTime",
    header: "RELEASED ALL TIME",
    cell: ({ row }) => {
      // Format numbers with commas if needed
      const value = row.getValue("releasedAllTime");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
];

export type TotalCommissionPayoutsBreakdown = {
  metric: string; // Total Deposits, Total Withdrawals, etc.
  amountPendingSettlement: number | string; // Amount based on latest completed commission periods pending settlement
  settledAllTime: number | string; // Settled All Time
};

export const totalCommissionPayoutsBreakdownColumns: ColumnDef<TotalCommissionPayoutsBreakdown>[] =
  [
    {
      accessorKey: "metric",
      header: "",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("metric")}</span>
      ),
    },
    {
      accessorKey: "pendingSettlement",
      header: "AMOUNT",
      cell: ({ row }) => {
        const value = row.getValue("pendingSettlement");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "allTime",
      header: "SETTLED ALL TIME",
      cell: ({ row }) => {
        const value = row.getValue("allTime");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
  ];

export type NetworkStatistics = {
  role: string;
  approved: number | string;
  pending: number | string;
  declined: number | string;
};

export const networkStatisticsColumn: ColumnDef<NetworkStatistics>[] = [
  {
    accessorKey: "role",
    header: "", // Empty header for first column
    cell: ({ row }) => (
      <>
        <h1 className="font-bold">{row.getValue("role")}</h1>
      </>
    ), // Display the actual ID value
  },
  {
    accessorKey: "approved",
    header: "APPROVED",
  },
  {
    accessorKey: "pending",
    header: "PENDING",
  },
  {
    accessorKey: "declined",
    header: "DECLINED",
  },
];

export type FinancialOverview = {
  item: string; // TOTAL BETS, TOTAL WINNINGS, etc.
  pendingCommission: number | string; // Pending commission values
  releasedAllTime: number | string; // Released all time values
  totalSummary: number | string; // SUMMARY values
};

export const financialOverviewColumns: ColumnDef<FinancialOverview>[] = [
  {
    accessorKey: "item",
    header: "ITEM",
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("item")}</span>
    ),
  },
  {
    accessorKey: "pendingCommission",
    header: "PENDING COMMISSION",
    cell: ({ row }) => {
      const value = row.getValue("pendingCommission");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
  {
    accessorKey: "releasedAllTime",
    header: "RELEASED ALL TIME",
    cell: ({ row }) => {
      const value = row.getValue("releasedAllTime");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
  {
    accessorKey: "totalSummary",
    header: "SUMMARY",
    cell: ({ row }) => {
      const value = row.getValue("totalSummary");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
];

export type CategoryFinancialOverview = {
  item: string; // TOTAL BETS, TOTAL WINNINGS, etc.
  dailyOverview: number | string | "N/A"; // Daily overview values
  pendingCommission: number | string; // Pending commission values
  releasedAllTime: number | string; // Released all time values
  totalSummary: number | string; // SUMMARY values
};

export const categoryFinancialOverviewColumns: ColumnDef<CategoryFinancialOverview>[] =
  [
    {
      accessorKey: "item",
      header: "ITEM",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("item")}</span>
      ),
    },
    {
      accessorKey: "dailyOverview",
      header: "DAILY OVERVIEW",
      cell: ({ row }) => {
        const value = row.getValue("dailyOverview");
        if (value === "N/A") return value;
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "pendingCommission",
      header: "PENDING COMMISSION",
      cell: ({ row }) => {
        const value = row.getValue("pendingCommission");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "releasedAllTime",
      header: "RELEASED ALL TIME",
      cell: ({ row }) => {
        const value = row.getValue("releasedAllTime");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "totalSummary",
      header: "SUMMARY",
      cell: ({ row }) => {
        const value = row.getValue("totalSummary");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
  ];

export type SportsBettingOverview = {
  item: string; // TOTAL BETS, TOTAL GROSS COMMISSIONS, etc.
  dailyOverview: number | string | "N/A"; // Daily overview values
  pendingCommission: number | string; // Pending commission values
  releasedAllTime: number | string; // Released all time values
  totalSummary: number | string; // SUMMARY values
};

export const sportsBettingOverviewColumns: ColumnDef<SportsBettingOverview>[] =
  [
    {
      accessorKey: "item",
      header: "ITEM",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("item")}</span>
      ),
    },
    {
      accessorKey: "dailyOverview",
      header: "DAILY OVERVIEW",
      cell: ({ row }) => {
        const value = row.getValue("dailyOverview");
        if (value === "N/A") return value;
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "pendingCommission",
      header: "PENDING COMMISSION",
      cell: ({ row }) => {
        const value = row.getValue("pendingCommission");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "releasedAllTime",
      header: "RELEASED ALL TIME",
      cell: ({ row }) => {
        const value = row.getValue("releasedAllTime");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "totalSummary",
      header: "SUMMARY",
      cell: ({ row }) => {
        const value = row.getValue("totalSummary");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
  ];

export type TopPerformersOverview = {
  item: string; // Operator name, e.g., ETA-001
  playerUserId: string; // Player user ID, e.g., 1234567890
  operator: string; // Operator name, e.g., ETA-001
  basedOnPreviouslyCompletedMonth: string; // Based on previously completed month, e.g., 2023-09
  allTime: string; // All time, e.g., 2023-09-01
};

export const topPerformersColumns: ColumnDef<TopPerformersOverview>[] = [
  {
    accessorKey: "item", // Correct key
    header: "",
    cell: ({ row }) => {
      return <b>{row.getValue("item")}</b>;
    },
  },
  {
    accessorKey: "playerUserId",
    header: "PLAYER USER ID",
    cell: ({ row }) => {
      const value = row.getValue("playerUserId");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
  {
    accessorKey: "operator",
    header: "OPERATOR",
    cell: ({ row }) => {
      const value = row.getValue("operator");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
  {
    accessorKey: "basedOnPreviouslyCompletedMonth",
    header: "BASED ON PREVIOUSLY COMPLETED MONTH",
    cell: ({ row }) => {
      const value = row.getValue("basedOnPreviouslyCompletedMonth");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
  {
    accessorKey: "allTime",
    header: "ALL TIME",
    cell: ({ row }) => {
      const value = row.getValue("allTime");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
];

export type TopPlayersDepositsOverview = {
  playerName: string; // Player name, e.g., Juan dela Cruz
  depositsMade: number | string; // Deposits made as of available cutoff period
  totalDeposits: number | string; // Total deposits to date
  operatorName: string; // Operator name
};

export const topPlayersDepositsColumns: ColumnDef<TopPlayersDepositsOverview>[] =
  [
    {
      accessorKey: "playerName",
      header: "PLAYER NAME",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("playerName")}</span>
      ),
    },
    {
      accessorKey: "depositsMade",
      header: "DEPOSITS MADE AS OF AVAILABLE CUTOFF PERIOD",
      cell: ({ row }) => {
        const value = row.getValue("depositsMade");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "totalDeposits",
      header: "TOTAL DEPOSITS TO DATE",
      cell: ({ row }) => {
        const value = row.getValue("totalDeposits");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
    {
      accessorKey: "operatorName",
      header: "OPERATOR NAME",
      cell: ({ row }) => row.getValue("operatorName"),
    },
  ];

// GGR Table
export type TopPlayersGGROverview = {
  playerName: string; // Player name
  ggrMade: number | string; // GGR made as of available cutoff period
  totalGGR: number | string; // Total GGR to date
  operatorName: string; // Operator name
};

export const topPlayersGGRColumns: ColumnDef<TopPlayersGGROverview>[] = [
  {
    accessorKey: "playerName",
    header: "PLAYER NAME",
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("playerName")}</span>
    ),
  },
  {
    accessorKey: "ggrMade",
    header: "GGR MADE AS OF AVAILABLE CUTOFF PERIOD",
    cell: ({ row }) => {
      const value = row.getValue("ggrMade");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
  {
    accessorKey: "totalGGR",
    header: "TOTAL GGR TO DATE",
    cell: ({ row }) => {
      const value = row.getValue("totalGGR");
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },
  {
    accessorKey: "operatorName",
    header: "OPERATOR NAME",
    cell: ({ row }) => row.getValue("operatorName"),
  },
];
