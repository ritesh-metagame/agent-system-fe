import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export type PendingSettlement = {
  ids: string[];
  network: string;
  // totalEgamesCommissions: number;
  // totalSportsBettingCommissions: number;
  // totalSpecialtyGamesCommissions: number;
  grossCommissions: number;
  paymentGatewayFees: number;
  netCommissions: number;
  ownCommission: number;
  // bankName: string;
  // breakdownAction: "view";
  // releaseAction: "release_comms";
  //   breakdown: string; // could be a button or link
  //   releaseCommissions: string; // could be a button or status
};

export const pendingSettlementColumnDefs: ColumnDef<PendingSettlement>[] = [
  {
    accessorKey: "network",
    header: "NETWORK",
  },
  // {
  //   accessorKey: "category",
  //   header: "CATEGORY",
  //   cell: ({ row }) => {
  //     const value = row.getValue("category") as string;
  //     return value.charAt(0).toUpperCase() + value.slice(1);
  //   },
  // },
  // {
  //   accessorKey: "totalEgamesCommissions",
  //   header: "TOTAL EGAMES COMMISSIONS",
  //   cell: ({ row }) => {
  //     const value = row.getValue("totalEgamesCommissions") as number | string;
  //     return formatCurrency(value)?.toLocaleString() ?? "";
  //   },
  // },
  // {
  //   accessorKey: "totalSportsBettingCommissions",
  //   header: "TOTAL SPORTS BETTING COMMISSIONS",
  //   cell: ({ row }) => {
  //     const value = row.getValue("totalSportsBettingCommissions") as
  //       | number
  //       | string;
  //     return formatCurrency(value)?.toLocaleString() ?? "";
  //   },
  // },
  // {
  //   accessorKey: "totalSpecialtyGamesCommissions",
  //   header: "TOTAL SPECIALITY GAMES COMMISSIONS",
  //   cell: ({ row }) => {
  //     const value = row.getValue("totalSpecialtyGamesCommissions") as
  //       | number
  //       | string;
  //     return formatCurrency(value)?.toLocaleString() ?? "";
  //   },
  // },
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
    accessorKey: "ownCommission",
    header: "LESS: OWN COMMISSIONS",
    cell: ({ row }) => {
      const value = row.getValue("ownCommission") as number | string;
      return formatCurrency(value)?.toLocaleString() ?? "";
    }
  },
  {
    accessorKey: "netCommissions",
    header: "NET COMMISSIONS FOR PAYOUT",
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
    header: "SETTLE",
    cell: ({ row }) => {
      const [date, setDate] = useState<Date>(new Date(Date.now()));

      return (
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
              {/* <div className="flex justify-between">
              <span className="font-medium">Total Deposits:</span>
              <span>{formatCurrency(row.original.totalDeposits)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Withdrawals:</span>
              <span>{formatCurrency(row.original.totalWithdrawals)}</span>
            </div> */}
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
              {/* <div className="flex justify-between font-semibold">
                <span>Bank Name:</span>
                <span>{row.original?.bankName}</span>
              </div> */}
              <div className="flex justify-between font-semibold">
                <span>Transaction Date</span>
                <span>
                  <Popover>
                    <PopoverTrigger disabled asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Reference ID</span>
                <span>
                  <Input
                    type="text"
                    placeholder="Enter Reference ID"
                    className="w-[240px]"
                    // value={referenceId}
                    // onChange={(e) => setReferenceId(e.target.value)}
                  />
                </span>
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
                        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/update-unsettled-commission`,
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
                            ids: row.original.ids,
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
      );
    },
  },
];
