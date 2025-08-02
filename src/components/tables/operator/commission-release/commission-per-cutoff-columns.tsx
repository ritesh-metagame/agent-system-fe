"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";

// Define the data structure for the Operator Network table
export type OperatorNetworkData = {
  network: string;
  name: string;
  totalBets: number | string;
  totalWinnings: number | string;
  totalGGR: number | string;
  totalGrossCommissions: number | string;
  totalDeductions: number | string;
  totalNetCommissions: number | string;
};

// Operator Network Table Columns
export const operatorNetworkColumns: ColumnDef<OperatorNetworkData>[] = [
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => row.original.network || "Operator",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "totalBets",
    header: "TOTAL NETWORK BETS",
    cell: ({ row }) => formatCurrency(row.getValue("totalBets")),
  },
  {
    accessorKey: "totalWinnings",
    header: "TOTAL NETWORK WINNINGS",
    cell: ({ row }) => formatCurrency(row.getValue("totalWinnings")),
  },
  {
    accessorKey: "totalGGR",
    header: "TOTAL NETWORK GGR",
    cell: ({ row }) => formatCurrency(row.getValue("totalGGR")),
  },
  {
    accessorKey: "totalGrossCommissions",
    header: "TOTAL NETWORK GROSS COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("totalGrossCommissions")),
  },
  {
    accessorKey: "totalDeductions",
    header:
      "TOTAL NETWORK DEDUCTIONS (Payment Gateway Fee Deductions from GP Commissions)",
    cell: ({ row }) => formatCurrency(row.getValue("totalDeductions")),
  },
  {
    accessorKey: "totalNetCommissions",
    header: "TOTAL NET COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("totalNetCommissions")),
  },
];

// Define the data structure for the Platinum Partner table
export type PlatinumPartnerData = {
  network: string;
  name: string;
  totalBets: number | string;
  totalWinnings: number | string;
  totalGGR: number | string;
  totalGrossCommissions: number | string;
  totalDeductions: number | string;
  totalNetCommissions: number | string;
};

// Platinum Partner Table Columns
export const platinumPartnerColumns: ColumnDef<PlatinumPartnerData>[] = [
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => row.original.network || "Platinum",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "totalBets",
    header: "TOTAL BETS",
    cell: ({ row }) => formatCurrency(row.getValue("totalBets")),
  },
  {
    accessorKey: "totalWinnings",
    header: "TOTAL WINNINGS",
    cell: ({ row }) => formatCurrency(row.getValue("totalWinnings")),
  },
  {
    accessorKey: "totalGGR",
    header: "TOTAL GGR",
    cell: ({ row }) => formatCurrency(row.getValue("totalGGR")),
  },
  {
    accessorKey: "totalGrossCommissions",
    header: "TOTAL GROSS COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("totalGrossCommissions")),
  },
  {
    accessorKey: "totalDeductions",
    header:
      "TOTAL DEDUCTIONS (Payment Gateway Fee Deductions from GP Commissions)",
    cell: ({ row }) => formatCurrency(row.getValue("totalDeductions")),
  },
  {
    accessorKey: "totalNetCommissions",
    header: "TOTAL NET COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("totalNetCommissions")),
  },
];

// Define the data structure for the Golden Partner table
export type GoldenPartnerData = {
  network: string;
  name: string;
  totalBets: number | string;
  totalWinnings: number | string;
  totalGGR: number | string;
  totalGrossCommissions: number | string;
  totalDeductions: number | string;
  totalNetCommissions: number | string;
};

// Golden Partner Table Columns
export const goldenPartnerColumns: ColumnDef<GoldenPartnerData>[] = [
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => row.original.network || "Golden",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "totalBets",
    header: "TOTAL BETS",
    cell: ({ row }) => formatCurrency(row.getValue("totalBets")),
  },
  {
    accessorKey: "totalWinnings",
    header: "TOTAL WINNINGS",
    cell: ({ row }) => formatCurrency(row.getValue("totalWinnings")),
  },
  {
    accessorKey: "totalGGR",
    header: "TOTAL GGR",
    cell: ({ row }) => formatCurrency(row.getValue("totalGGR")),
  },
  {
    accessorKey: "totalGrossCommissions",
    header: "TOTAL GROSS COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("totalGrossCommissions")),
  },
  {
    accessorKey: "totalDeductions",
    header:
      "TOTAL DEDUCTIONS (Payment Gateway Fee Deductions from GP Commissions)",
    cell: ({ row }) => formatCurrency(row.getValue("totalDeductions")),
  },
  {
    accessorKey: "totalNetCommissions",
    header: "TOTAL NET COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("totalNetCommissions")),
  },
];
