"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";

// Define the shape of the data for the table.
export type CommissionPerCutoffData = {
  network: string;
  name: string;
  totalNetworkBets: number | string;
  totalNetworkWinnings: number | string;
  totalNetworkGGR: number | string;
  totalNetworkGrossCommissions: number | string;
  paymentGatewayFeeDeductions: number | string;
  totalNetCommissions: number | string;
};

export const commissionPerCutoffColumns: ColumnDef<CommissionPerCutoffData>[] =
  [
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
      accessorKey: "totalNetworkBets",
      header: "TOTAL NETWORK BETS",
      cell: ({ row }) => formatCurrency(row.getValue("totalNetworkBets")),
    },
    {
      accessorKey: "totalNetworkWinnings",
      header: "TOTAL NETWORK WINNINGS",
      cell: ({ row }) => formatCurrency(row.getValue("totalNetworkWinnings")),
    },
    {
      accessorKey: "totalNetworkGGR",
      header: "TOTAL NETWORK GGR",
      cell: ({ row }) => formatCurrency(row.getValue("totalNetworkGGR")),
    },
    {
      accessorKey: "totalNetworkGrossCommissions",
      header: "TOTAL NETWORK GROSS COMMISSIONS",
      cell: ({ row }) =>
        formatCurrency(row.getValue("totalNetworkGrossCommissions")),
    },
    {
      accessorKey: "paymentGatewayFeeDeductions",
      header:
        "TOTAL NETWORK DEDUCTIONS Payment Gateway Fee Deductions from GP Commissions",
      cell: ({ row }) =>
        formatCurrency(row.getValue("paymentGatewayFeeDeductions")),
    },
    {
      accessorKey: "totalNetCommissions",
      header: "TOTAL NET COMMISSIONS",
      cell: ({ row }) => formatCurrency(row.getValue("totalNetCommissions")),
    },
  ];

export type PartnerCommissionData = {
  network: string;
  name: string;
  totalBets: number | string;
  totalWinnings: number | string;
  totalGGR: number | string;
  totalGrossCommissions: number | string;
  paymentGatewayFeeDeductions: number | string;
  totalNetCommissions: number | string;
};

export const partnerCommissionColumns: ColumnDef<PartnerCommissionData>[] = [
  {
    accessorKey: "network",
    header: "Network",
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
    accessorKey: "paymentGatewayFeeDeductions",
    header:
      "TOTAL DEDUCTIONS Payment Gateway Fee Deductions from GP Commissions",
    cell: ({ row }) =>
      formatCurrency(row.getValue("paymentGatewayFeeDeductions")),
  },
  {
    accessorKey: "totalNetCommissions",
    header: "TOTAL NET COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("totalNetCommissions")),
  },
];
