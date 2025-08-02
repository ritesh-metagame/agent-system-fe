"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

/**
 * Platinum Partner Table
 */
export type PlatinumPartnerData = {
  platinumPartner: string;
  totalBets?: string;
  totalWinnings?: string;
  ggr?: string;
  grossCommissions?: string;
  totalDeductions?: string;
  netCommissions?: string;
  partnerBreakdown?: string;
  releaseCommissions?: string;
};

export const platinumPartnerColumns: ColumnDef<PlatinumPartnerData>[] = [
  { accessorKey: "platinumPartner", header: "PLATINUM PARTNER" },
  {
    accessorKey: "totalBets",
    header: "TOTAL  BETS",
    cell: ({ row }) => formatCurrency(row.getValue("totalBets")),
  },
  {
    accessorKey: "totalWinnings",
    header: "TOTAL  WINNINGS",
    cell: ({ row }) => formatCurrency(row.getValue("totalWinnings")),
  },
  {
    accessorKey: "ggr",
    header: "GGR",
    cell: ({ row }) => formatCurrency(row.getValue("ggr")),
  },
  {
    accessorKey: "grossCommissions",
    header: "GROSS COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("grossCommissions")),
  },
  {
    accessorKey: "totalDeductions",
    header: "TOTAL  DEDUCTIONS ",
    cell: ({ row }) => formatCurrency(row.getValue("totalDeductions")),
  },
  {
    accessorKey: "netCommissions",
    header: "NET COMMISSIONS",
    cell: ({ row }) => formatCurrency(row.getValue("netCommissions")),
  },
  {
    //below accessor key is not required as it is just a button we are not rendering any data - source deepseek
    id: "partnerBreakdown",
    header: "PARTNER BREAKDOWN",
    cell: () => (
      <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md">
        View
      </Button>
    ),
  },
  {
    id: "releaseCommissions",
    header: "RELEASE COMMISSIONS",
    cell: () => <Button variant="green">Release Commission</Button>,
  },
];

/**
 * Export tables
 */
export const tableColumns = {
  platinumPartnerColumns,
};
