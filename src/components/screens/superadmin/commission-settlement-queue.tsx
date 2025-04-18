"use client";

import { DataTable } from "@/components/tables/data-table";
import { TypographyH2 } from "@/components/ui/typographyh2";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { pendingSettlementColumnDefs } from "@/components/tables/common/commission-settlement-queue-column-defs";
import { formatCurrency } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function CommissionSettlementQueue() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [selectedSettlement, setSelectedSettlement] = useState<any | null>(
    null
  );

  const [showDialog, setShowDialog] = useState(false);

  function formatCurrency(value: number | string | undefined) {
    if (!value || isNaN(Number(value))) return "₱0.00";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(Number(value));
  }

  const onConfirm = async (userd) => {
    console.log("Settling for:", userd);
    if (!selectedSettlement) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/update-unsettled-commission?id=${userd}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ network: selectedSettlement.network }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Settlement successful!");
        setSettlements((prev) =>
          prev.filter((s) => s.network !== selectedSettlement.network)
        );
      } else {
        alert(data.message || "Failed to settle.");
      }
    } catch (error) {
      console.error("Error settling:", error);
      alert("Something went wrong!");
    } finally {
      setShowDialog(false);
      setSelectedSettlement(null);
    }
  };

  useEffect(() => {
    const fetchSettlements = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/pending-settlements`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (data.code === "2006") {
        setSettlements(data.data.rows);
      }
    };

    fetchSettlements();
  }, []);

  const columns = pendingSettlementColumnDefs((settlement: any) => {
    setSelectedSettlement(settlement);
    setShowDialog(true);
  });

  return (
    <div>
      <div className="mb-10">
        <TypographyH2 className="mb-4">Pending Settlements</TypographyH2>
        <DataTable columns={columns} data={settlements} />
      </div>

      {/* Dialog */}
      {selectedSettlement && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="default">Settle</Button>
          </DialogTrigger>
          <DialogContent className="w-[450px] sm:w-[600px] bg-white rounded-lg shadow-lg p-6 fixed top-1/10 left-1/3   ">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center mb-4">
                Confirm Settlement
              </DialogTitle>
              <p className="text-center text-sm text-muted-foreground mb-4">
                Are you sure you want to settle commissions for{" "}
                <strong>{selectedSettlement.network}</strong>?
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Deposits:</span>
                <span>{formatCurrency(selectedSettlement.totalDeposits)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Withdrawals:</span>
                <span>
                  {formatCurrency(selectedSettlement.totalWithdrawals)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Gross Commissions:</span>
                <span>
                  {formatCurrency(selectedSettlement.totalGrossCommissions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Gateway Fees:</span>
                <span>
                  {formatCurrency(selectedSettlement.paymentGatewayFees)}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Net Commissions:</span>
                <span>
                  {formatCurrency(selectedSettlement.totalNetCommissions)}
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
                  onClick={() => {
                    // Handle settlement logic here
                    // send the commission summary id in agrument
                    onConfirm(selectedSettlement.id);
                    setShowDialog(false); // Close the dialog after settling
                  }}
                >
                  Yes, Settle
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
