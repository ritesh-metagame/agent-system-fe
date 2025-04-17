import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export type PartnerCommissionRow = {
  network: string;
  name: string;
  totalEgamesGross: number;
  totalSportsGross: number;
  totalNetCommission: number;
};

export const partnerCommissionColumns: ColumnDef<PartnerCommissionRow>[] = [
  {
    accessorKey: "network",
    header: "NETWORK",
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("network")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "totalEgamesGross",
    header: "TOTAL EGAMES GROSS COMMISSIONS",
    cell: ({ row }) =>
      formatCurrency(row.getValue("totalEgamesGross") as number),
  },
  {
    accessorKey: "totalSportsGross",
    header: "TOTAL SPORTS GROSS COMMISSIONS",
    cell: ({ row }) =>
      formatCurrency(row.getValue("totalSportsGross") as number),
  },
  {
    accessorKey: "totalNetCommission",
    header: "TOTAL NET COMMISSIONS",
    cell: ({ row }) =>
      formatCurrency(row.getValue("totalNetCommission") as number),
  },
];

export type GoldenPartnerCommissionRow = {
  network: string;
  name: string;
  totalEgamesGross: number;
  totalSportsGross: number;
  paymentGatewayFees: number;
  totalNetCommission: number;
  totalDeductions: number;
  finalTotalNetCommission: number;
};

export const goldenPartnerCommissionColumns: ColumnDef<GoldenPartnerCommissionRow>[] =
  [
    {
      accessorKey: "network",
      header: "NETWORK",
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("network")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "NAME",
    },
    {
      accessorKey: "totalEgamesGross",
      header: "TOTAL EGAMES GROSS COMMISSIONS",
      cell: ({ row }) =>
        formatCurrency(row.getValue("totalEgamesGross") as number),
    },
    {
      accessorKey: "totalSportsGross",
      header: "TOTAL SPORTS GROSS COMMISSIONS",
      cell: ({ row }) =>
        formatCurrency(row.getValue("totalSportsGross") as number),
    },
    {
      accessorKey: "paymentGatewayFees",
      header: "LESS: PAYMENT GATEWAY FEES",
      cell: ({ row }) =>
        formatCurrency(row.getValue("paymentGatewayFees") as number),
    },
    {
      accessorKey: "totalNetCommission",
      header: "TOTAL NET COMMISSIONS",
      cell: ({ row }) =>
        formatCurrency(row.getValue("totalNetCommission") as number),
    },
    {
      accessorKey: "totalDeductions",
      header:
        "TOTAL DEDUCTIONS\n(Payment Gateway Fee Deductions from GP Commissions)",
      cell: ({ row }) =>
        formatCurrency(row.getValue("totalDeductions") as number),
    },
    {
      accessorKey: "finalTotalNetCommission",
      header: "TOTAL NET COMMISSIONS",
      cell: ({ row }) =>
        formatCurrency(row.getValue("finalTotalNetCommission") as number),
    },
  ];
