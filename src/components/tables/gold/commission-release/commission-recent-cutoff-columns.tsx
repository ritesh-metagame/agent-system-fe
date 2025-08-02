"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";

// Define the shape of the data for the table.
export type GoldCommissionRecentCutoffData = {
  platinumPartner: string;
  totalBets: number | string;
  totalWinnings: number | string;
  gGR: number | string;
  grossCommissions: number | string;
  totalDeductions: number | string;
  netCommissions: number | string;
};

// Define the columns for the table.
export const goldcommissionRecentCutoffColumns: ColumnDef<GoldCommissionRecentCutoffData>[] =
  [
    {
      accessorKey: "platinumPartner",
      header: "PLATINUM PARTNER",
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
      accessorKey: "gGR",
      header: "GGR",
      cell: ({ row }) => formatCurrency(row.getValue("gGR")),
    },
    {
      accessorKey: "grossCommissions",
      header: "GROSS COMMISSIONS",
      cell: ({ row }) => formatCurrency(row.getValue("grossCommissions")),
    },
    {
      accessorKey: "totalDeductions",
      header: "TOTAL DEDUCTIONS",
      cell: ({ row }) => formatCurrency(row.getValue("totalDeductions")),
    },
    {
      accessorKey: "netCommissions",
      header: "NET COMMISSIONS",
      cell: ({ row }) => formatCurrency(row.getValue("netCommissions")),
    },
  ];
