"use client";

import CommissionSettlementQueuePage from "@/app/(dashboard)/commission-settlement-queue/page";
import { pendingSettlementColumnDefs } from "@/components/tables/common/commission-settlement-queue-column-defs";
import { DataTable } from "@/components/tables/data-table";
import { TypographyH2 } from "@/components/ui/typographyh2";
import React, { useEffect, useState } from "react";

type Props = {};

export default function CommissionSettlementQueue({}: Props) {
  const [settlements, setSettlements] = useState<any[]>([]);

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

      if (!res.ok) {
        console.error("Error fetching settlements:", res.statusText);
        return;
      }

      const data = await res.json();

      if (data.code === "2006") {
        setSettlements(data.data.rows);
      }
      //   setSettlements(data.data.);
    };

    fetchSettlements();
  }, []);

  return (
    <div>
      <div className="mb-10">
        <TypographyH2 className="mb-4">Pending Settlements</TypographyH2>
        <DataTable columns={pendingSettlementColumnDefs} data={settlements} />
      </div>
    </div>
  );
}
