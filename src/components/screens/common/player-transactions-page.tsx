"use client";

import { DataTable } from "@/components/tables/data-table";
import {
  superAdminTransactionsReportsListColumns,
  SuperAdminTransactionsReportsListData,
} from "@/components/tables/superadmin/download-reports/transactions-columns";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { TypographyH4 } from "@/components/ui/typographyh4";
import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {};

export default function PlayerTransactionsPage({}: Props) {
  const [dateRange, setDateRange] = React.useState<{
    from: null | Date;
    to: null | Date;
  }>({
    from: null,
    to: null,
  });

  const [transactionsData, setTransactionsData] = React.useState<
    SuperAdminTransactionsReportsListData[]
  >([]);

  const fetchPlayerTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/reports`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            ...(dateRange.from && dateRange.to
              ? {
                  startDate: new Date(dateRange.from)
                    .toISOString()
                    .split("T")[0],
                  endDate: new Date(dateRange.to).toISOString().split("T")[0],
                }
              : {}),
          },
        }
      );

      if (data.code === "T214") {
        setTransactionsData(data.data);
      } else {
        toast(data.message || "Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("Error fetching player transactions:", error);
    }
  };

  useEffect(() => {
    fetchPlayerTransactions();
  }, []);

  useEffect(() => {
    console.log("Date range changed:", dateRange);
  }, [dateRange]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        <Button onClick={fetchPlayerTransactions}>Search</Button>
      </div>
      <div>
        <TypographyH4 className="mb-4">Reports</TypographyH4>
        <DataTable
          columns={superAdminTransactionsReportsListColumns}
          data={transactionsData}
          columnWidths={["150px", "150px", "150px", "150px"]} // Set the desired widths for each column
        />
      </div>
    </div>
  );
}
