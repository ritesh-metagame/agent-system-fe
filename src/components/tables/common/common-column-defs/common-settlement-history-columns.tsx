"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/constants";

// Define the shape of the data for the table.
export type SettlementReportData = {
  id: number;
  fromDate: string;
  toDate: string;
  status: string;
  action: string;
  downlineName: string;
};

// Column definitions for the Reports List table
export const settlementListColumns: ColumnDef<SettlementReportData>[] = [
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
    accessorKey: "downlineName",
    header: () => {
      const role = localStorage.getItem("role");

      if (role === UserRole.SUPER_ADMIN) {
        return "OPERATOR NAME";
      } else if (role === UserRole.OPERATOR) {
        return "PLATINUM NAME";
      } else if (role === UserRole.PLATINUM) {
        return "GOLDEN NAME";
      }
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "action",
    header: "ACTION",
    cell: ({ row }) => (
      <Button
        className="bg-[#5D94B4] text-white"
        onClick={() => handleDownload(row.original)}
      >
        DOWNLOAD
      </Button>
    ),
  },
];

// Function to handle download action
const handleDownload = (report: SettlementReportData) => {
  console.log("Downloading report:", report);
};
