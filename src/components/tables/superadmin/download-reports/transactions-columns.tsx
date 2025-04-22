"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

// Define the data structure for the Reports List table
export type SuperAdminTransactionsReportsListData = {
  id: number;
  fromDate: string;
  toDate: string;
  status: string;
  download: string;
};

// Reports List Table Columns
export const superAdminTransactionsReportsListColumns: ColumnDef<SuperAdminTransactionsReportsListData>[] =
  [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "fromDate",
      header: "FROM DATE",
    },
    {
      accessorKey: "toDate",
      header: "TO DATE",
    },
    {
      accessorKey: "status",
      header: "STATUS",
    },
    {
      accessorKey: "download",
      header: "DOWNLOAD",
      cell: ({ row }) => {
        let downloadLink = row.getValue("download") as string;
        downloadLink = downloadLink.split("/api")[1];

        return (
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={async () => {
              const exportReport = async () => {
                const token = localStorage.getItem("token");
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_BASE_URL}${downloadLink}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (response.ok) {
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `transactions_report-from-${row.getValue(
                    "fromDate"
                  )}-to-${row.getValue("toDate")}.csv`; // Set the desired file name
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                } else {
                  console.error(
                    "Failed to download report:",
                    response.statusText
                  );
                }
              };
              exportReport();
            }}
          >
            DOWNLOAD
          </Button>
        );
      },
    },
  ];
