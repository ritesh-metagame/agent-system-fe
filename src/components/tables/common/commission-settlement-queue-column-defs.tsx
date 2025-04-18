import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "sonner";

export type PendingSettlement = {
  network: string;
  category: string;
  totalDeposits: number | string;
  totalWithdrawals: number | string;
  grossCommissions: number | string;
  paymentGatewayFees: number | string;
  netCommissions: number | string;
  id: string;
  //   breakdown: string; // could be a button or link
  //   releaseCommissions: string; // could be a button or status
};

export const pendingSettlementColumnDefs: ColumnDef<PendingSettlement>[] = [
  {
    accessorKey: "network",
    header: "NETWORK",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
    cell: ({ row }) => {
      const value = row.getValue("category") as string;
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
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
    accessorKey: "grossCommissions",
    header: "TOTAL GROSS COMMISSIONS",
    cell: ({ row }) => {
      const value = row.getValue("grossCommissions") as number | string;
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
    accessorKey: "netCommissions",
    header: "TOTAL NET COMMISSIONS FOR SETTLEMENT",
    cell: ({ row }) => {
      const value = row.getValue("netCommissions") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    },
  },
  {
    id: "action1",
    header: "BREAKDOWN",
    cell: ({ row }) => (
      <Link href={`/commission-settlement-queue/${row.original.network}`}>
        <Button>View</Button>
      </Link>
    ),
  },
  {
    id: "action2",
    header: "RELEASE COMMISSIONS",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Settle</Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center mb-4">
              Confirm Settlement
            </DialogTitle>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Are you sure you want to settle commissions for{" "}
              <strong>{row.original.network}</strong>?
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Total Deposits:</span>
              <span>{formatCurrency(row.original.totalDeposits)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Withdrawals:</span>
              <span>{formatCurrency(row.original.totalWithdrawals)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Gross Commissions:</span>
              <span>{formatCurrency(row.original.grossCommissions)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Gateway Fees:</span>
              <span>{formatCurrency(row.original.paymentGatewayFees)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Net Commissions:</span>
              <span>{formatCurrency(row.original.netCommissions)}</span>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" className="mr-2">
                No
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="green"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/commission/update-unsettled-commission?id=${row.original.id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                        body: JSON.stringify({
                          network: row.original.network,
                        }),
                      }
                    );

                    const data = await res.json();

                    if (res.ok) {
                      toast("Settlement successful!");
                      //   setSettlements((prev) =>
                      //     prev.filter(
                      //       (s) => s.network !== selectedSettlement.network
                      //     )
                      //   );
                    } else {
                      toast(data.message || "Failed to settle.");
                    }
                  } catch (error) {
                    console.error("Error settling:", error);
                    toast("Something went wrong!");
                  } finally {
                    // setShowDialog(false);
                    // setSelectedSettlement(null);
                  }
                }}
              >
                Yes, Settle
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
];
