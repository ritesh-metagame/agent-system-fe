import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";

export type PartnerBreakdown = {
  network: string;
  name: string;
  egamesCommission: number | string;
  sportsCommission: number | string;
  totalNetCommission: number | string;
};

export type GoldenPartnerBreakdown = {
  network: string;
  name: string;
  egamesCommission: number | string;
  sportsCommission: number | string;
  paymentGatewayFee: number | string;
  totalNetCommission: number | string;
  deductionsFromGross: number | string;
  finalNetCommission: number | string;
};

export const partnerBreakdownColumnDefs: ColumnDef<PartnerBreakdown>[] = [
  {
    accessorKey: "network",
    header: "NETWORK",
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "egamesCommission",
    header: "TOTAL  EGAMES GROSS COMMISSIONS",
    cell: ({ row }) => {
      const value = row.getValue("egamesCommission") as number | string;

      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
  {
    accessorKey: "sportsCommission",
    header: "TOTAL  SPORTS GROSS COMMISSIONS",
    cell: ({ row }) => {
      const value = row.getValue("sportsCommission") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
  {
    accessorKey: "totalNetCommission",
    header: "TOTAL NET COMMISSIONS",
    cell: ({ row }) => {
      const value = row.getValue("totalNetCommission") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
];

export const goldenPartnerBreakdownColumnDefs: ColumnDef<GoldenPartnerBreakdown>[] =
  [
    {
      accessorKey: "network",
      header: "NETWORK",
    },
    {
      accessorKey: "name",
      header: "NAME",
    },
    {
      accessorKey: "egamesCommission",
      header: "TOTAL  EGAMES GROSS COMMISSIONS",
      cell: ({ row }) => {
        const value = row.getValue("egamesCommission") as number | string;
        return formatCurrency(value)?.toLocaleString() ?? "";
      },
    },
    {
      accessorKey: "sportsCommission",
      header: "TOTAL  SPORTS GROSS COMMISSIONS",
      cell: ({ row }) => {
        const value = row.getValue("sportsCommission") as number | string;
        return formatCurrency(value)?.toLocaleString() ?? "";
      },
    },
    {
      accessorKey: "paymentGatewayFee",
      header: "LESS: PAYMENT GATEWAY FEES",
      cell: ({ row }) => {
        const value = row.getValue("paymentGatewayFee") as number | string;
        return formatCurrency(value)?.toLocaleString() ?? "";
      },
    },
    {
      accessorKey: "totalNetCommission",
      header: "TOTAL NET COMMISSIONS",
      cell: ({ row }) => {
        const value = row.getValue("totalNetCommission") as number | string;
        return formatCurrency(value)?.toLocaleString() ?? "";
      },
    },
    {
      accessorKey: "deductionsFromGross",
      header:
        "TOTAL DEDUCTIONS (Payment Gateway Fee Deductions from GP Commissions)",
      cell: ({ row }) => {
        const value = row.getValue("deductionsFromGross") as number | string;
        return formatCurrency(value)?.toLocaleString() ?? "";
      },
    },
    {
      accessorKey: "finalNetCommission",
      header: "TOTAL NET COMMISSIONS",
      cell: ({ row }) => {
        const value = row.getValue("finalNetCommission") as number | string;
        return formatCurrency(value)?.toLocaleString() ?? "";
      },
    },
  ];
