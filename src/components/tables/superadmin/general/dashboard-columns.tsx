"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";

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
        return formatCurrency(value as any);
      },
    },
    {
      accessorKey: "settledAllTime",
      header: "SETTLED ALL TIME",
      cell: ({ row }) => {
        const value = row.getValue("settledAllTime");
        return formatCurrency(value as any);
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
        return formatCurrency(value as any);
      },
    },
    {
      accessorKey: "sportsBetting",
      header: "SPORTS BETTING",
      cell: ({ row }) => {
        const value = row.getValue("sportsBetting");
        return formatCurrency(value as any);
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

export type TotalCommissionPayoutsBreakdown2 = {
  label: string; // Total Deposits, Total Withdrawals, etc.
  amountPendingSettlement: number | string; // Amount based on latest completed commission periods pending settlement
  settledAllTime: number | string; // Settled All Time
};

export const totalCommissionPayoutsBreakdownColumns2: ColumnDef<TotalCommissionPayoutsBreakdown2>[] =
  [
    {
      accessorKey: "label",
      header: "",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("label")}</span>
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
      accessorKey: "settledAllTime",
      header: "SETTLED ALL TIME",
      cell: ({ row }) => {
        const value = row.getValue("settledAllTime");
        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
  ];

export type TotalCommissionPayoutsBreakdown1 = {
  label: string; // Total Deposits, Total Withdrawals, etc.
  amountPendingSettlement: number | string; // Amount based on latest completed commission periods pending settlement
  allTime: number | string; // Settled All Time
};

export const totalCommissionPayoutsBreakdownColumns1: ColumnDef<TotalCommissionPayoutsBreakdown1>[] =
  [
    {
      accessorKey: "label",
      header: "",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("label")}</span>
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

export type PaymentGatewayFees = {
  type: string; // e.g., "Payment Gateway Fees"
  amount: number | string; // Amount in PHP
};

export const paymentGatewayFeesColumns: ColumnDef<PaymentGatewayFees>[] = [
  {
    accessorKey: "type",
    header: "",
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("type")}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ row }) => {
      const value = row.getValue("amount");
      return typeof value === "number"
        ? value.toLocaleString()
        : formatCurrency(value as any);
    },
  },
];

export type LicenseCommissionBreakdown = {
  label: string;
  pendingSettlement: string | number;
  settledAllTime: string | number;
};

export const licenseCommissionBreakdownColumns: ColumnDef<LicenseCommissionBreakdown>[] =
  [
    {
      accessorKey: "label",
      header: "",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("label")}</span>
      ),
    },
    {
      accessorKey: "pendingSettlement",
      header: "AMOUNT PENDING SETTLEMENT",
      cell: ({ row }) => {
        const value = row.getValue("pendingSettlement");
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

// 1) Define the row shape
export type PlayerActivityRow = {
  label: string; // e.g. "PLAYERS"
  active: number;
  inactive: number;
  totalApprovedPlayers: number; // must match the row in E12, as per your note
};

// 2) Define columns for the “PLAYER ACTIVITY” table
export const playerActivityColumns: ColumnDef<PlayerActivityRow>[] = [
  {
    accessorKey: "label",
    header: "PLAYER ACTIVITY",
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("label")}</span>
    ),
  },
  {
    accessorKey: "active",
    header: "ACTIVE",
    cell: ({ row }) => {
      const value = row.getValue("active") as number;
      return value.toLocaleString();
    },
  },
  {
    accessorKey: "inactive",
    header: "INACTIVE",
    cell: ({ row }) => {
      const value = row.getValue("inactive") as number;
      return value.toLocaleString();
    },
  },
  {
    accessorKey: "totalApprovedPlayers",
    header: "TOTAL APPROVED PLAYERS",
    cell: ({ row }) => {
      const value = row.getValue("totalApprovedPlayers") as number;
      return value.toLocaleString();
    },
  },
];
