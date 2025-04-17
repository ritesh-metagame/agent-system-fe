import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type PendingSettlement = {
  network: string;
  totalDeposits: number | string;
  totalWithdrawals: number | string;
  totalGrossCommissions: number | string;
  paymentGatewayFees: number | string;
  totalNetCommissions: number | string;
  //   breakdown: string; // could be a button or link
  //   releaseCommissions: string; // could be a button or status
};

export const pendingSettlementColumnDefs: ColumnDef<PendingSettlement>[] = [
  {
    accessorKey: "network",
    header: "NETWORK",
  },
  {
    accessorKey: "totalDeposits",
    header: "TOTAL DEPOSITS",
    cell: ({ row }) => {
      const value = row.getValue("totalDeposits") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
  {
    accessorKey: "totalWithdrawals",
    header: "TOTAL WITHDRAWALS",
    cell: ({ row }) => {
      const value = row.getValue("totalWithdrawals") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
  {
    accessorKey: "totalGrossCommissions",
    header: "TOTAL GROSS COMMISSIONS",
    cell: ({ row }) => {
      const value = row.getValue("totalGrossCommissions") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
  {
    accessorKey: "paymentGatewayFees",
    header: "LESS: PAYMENT GATEWAY FEES",
    cell: ({ row }) => {
      const value = row.getValue("paymentGatewayFees") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
  {
    accessorKey: "totalNetCommissions",
    header: "TOTAL NET COMMISSIONS FOR SETTLEMENT",
    cell: ({ row }) => {
      const value = row.getValue("totalNetCommissions") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
  {
    id: "action1",
    header: "BREAKDOWN",
    cell: ({ row }) => {
      return (
        <Link href={`/commission-settlement-queue/${row.original.network}`}>
          {" "}
          <Button>View</Button>
        </Link>
      );
    },
  },
  {
    id: "action2",
    header: "RELEASE COMMISSIONS",
    cell: ({ row }) => {
      return <Button>Release</Button>;
    },
  },
];
