"use client";

import CommissionSettlementQueuePage from "@/app/(dashboard)/commission-settlement-queue/page";
import { pendingSettlementColumnDefs } from "@/components/tables/common/commission-settlement-queue-column-defs";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { TypographyH2 } from "@/components/ui/typographyh2";
import React, { useEffect, useState } from "react";

type Props = {};

export default function CommissionSettlementQueue({}: Props) {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [period, setPeriod] = useState({
    from: "",
    to: "",
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

      if (!res.ok) {
        console.error("Error fetching settlements:", res.statusText);
        return;
      }

      const data = await res.json();

      if (data.code === "2006") {
        setSettlements(data.data.rows);
        const fromDate = formatDate(data.data?.periodInfo?.start);
        setPeriod((prev) => ({ ...prev, from: fromDate }));
        const toDate = formatDate(data.data?.periodInfo?.end);
        setPeriod((prev) => ({ ...prev, to: toDate }));
      }
      //   setSettlements(data.data.);
    };

    fetchSettlements();
  }, []);

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <TypographyH2 className="mb-4">Pending Settlements</TypographyH2>
          <p className="text-sm text-gray-500">As of {period.to}</p>
          {/* <Badge variant="outline" className="text-xs">
            {period.from} - {period.to}
          </Badge> */}
        </div>
        <DataTable columns={pendingSettlementColumnDefs} data={settlements} />
      </div>
    </div>
  );
}
