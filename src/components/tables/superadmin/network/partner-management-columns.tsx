"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import Link from "next/link";

// Define the shape of the data for the table.

export type Partners = {
  id: string;
  username: string;
  password: string;
  roleId: string;
  affiliateLink: string;
  firstName: string | null;
  lastName: string | null;
  mobileNumber: string | null;
  bankName: string | null;
  accountNumber: string | null;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  commissions: any[]; // You might want to define a more specific type
  userSites: {
    userId: string;
    siteId: string;
    assignedAt: string;
  }[];
  children: any[]; // You might want to define a more specific type
};

export const partnerColumns: ColumnDef<Partners>[] = [
  {
    accessorKey: "username",
    header: "USERNAME",
  },
  {
    accessorKey: "role",
    header: "ROLE",
  },
  {
    accessorKey: "mobileNumber",
    header: "MOBILE NUMBER",
  },
  {
    accessorKey: "bankName",
    header: "BANK NAME",
  },
  {
    accessorKey: "accountNumber",
    header: "ACCOUNT NUMBER",
  },
  {
    accessorKey: "createdAt",
    header: "CREATED AT",
  },
  {
    accessorKey: "commissions",
    header: "COMMISSIONS",
    cell: ({ row }) => {
      console.log("Row data:", row.original);

      // Group commissions by site, role, and category
      const commissionsBySite = {};

      // Process commissions if they exist
      if (row.original.commissions && row.original.commissions.length > 0) {
        row.original.commissions.forEach((commission) => {
          const siteName = commission.site?.name || "Unknown Site";
          const categoryName = commission.category?.name || "Unknown Category";
          const roleId = commission.roleId;

          if (!commissionsBySite[siteName]) {
            commissionsBySite[siteName] = {};
          }

          // Create key based on role and category to handle multiple commission entries
          const key = `${roleId}-${categoryName}`;

          if (!commissionsBySite[siteName][categoryName]) {
            commissionsBySite[siteName][categoryName] = [];
          }

          // Add this commission to the appropriate array
          commissionsBySite[siteName][categoryName].push({
            percentage: commission.commissionPercentage,
            roleName: row.original.role?.name || "Unknown Role",
            roleId: roleId,
          });
        });
      }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-800">View Commissions</Button>
          </DialogTrigger>
          <DialogContent className="w-[800px] max-h-[80vh] overflow-auto">
            <DialogTitle className="font-bold text-lg">
              Commissions for {row.original.username}
            </DialogTitle>
            <DialogDescription className="mt-4">
              {row.original.commissions &&
              row.original.commissions.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2 text-left">Site</th>
                        <th className="border p-2 text-center">E-Games</th>
                        <th className="border p-2 text-center">
                          Sports Betting
                        </th>
                        <th className="border p-2 text-center">
                          Speciality Games - RNG
                        </th>
                        <th className="border p-2 text-center">
                          Speciality Games - Tote
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(commissionsBySite)?.map(
                        (siteName, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border p-2 font-medium">
                              {siteName}
                            </td>
                            <td className="border p-2 text-center">
                              {commissionsBySite[siteName]["E-Games"] ? (
                                <div className="flex flex-col gap-1">
                                  {commissionsBySite[siteName]["E-Games"]?.map(
                                    (comm, i) => (
                                      <div key={i} className="text-sm">
                                        {comm.percentage}%
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="border p-2 text-center">
                              {commissionsBySite[siteName]["Sports Betting"] ? (
                                <div className="flex flex-col gap-1">
                                  {commissionsBySite[siteName][
                                    "Sports Betting"
                                  ]?.map((comm, i) => (
                                    <div key={i} className="text-sm">
                                      {comm.percentage}%
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="border p-2 text-center">
                              {commissionsBySite[siteName][
                                "Speciality Games - RNG"
                              ] ? (
                                <div className="flex flex-col gap-1">
                                  {commissionsBySite[siteName][
                                    "Speciality Games - RNG"
                                  ]?.map((comm, i) => (
                                    <div key={i} className="text-sm">
                                      {comm.percentage}%
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="border p-2 text-center">
                              {commissionsBySite[siteName][
                                "Speciality Games - Tote"
                              ] ? (
                                <div className="flex flex-col gap-1">
                                  {commissionsBySite[siteName][
                                    "Speciality Games - Tote"
                                  ]?.map((comm, i) => (
                                    <div key={i} className="text-sm">
                                      {comm.percentage}%
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No commission data available.</p>
              )}
            </DialogDescription>
            <DialogClose asChild>
              <Button className="mt-4">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Link href={`/partner-management/update/${row.original.username}`}>
            <Button variant="secondary">
              <Edit />
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export type PartnerManagementData = {
  operatorName: string;
  ppApproved: number | string;
  ppPending: number | string;
  gpApproved: number | string;
  gpPending: number | string;
  players: number | string;
  exportFile: string;
};

export const partnerManagementColumns: ColumnDef<PartnerManagementData>[] = [
  {
    accessorKey: "operatorName",
    header: "OPERATOR NAME",
    cell: ({ row }) => (
      <p className="font-medium">
        {row.original.operatorName || "ALL OPERATORS"}
      </p>
    ),
  },
  {
    accessorKey: "ppApproved",
    header: "PP APPROVED",
  },
  {
    accessorKey: "ppPending",
    header: "PP PENDING",
  },
  {
    accessorKey: "gpApproved",
    header: "GP APPROVED",
  },
  {
    accessorKey: "gpPending",
    header: "GP PENDING",
  },
  {
    accessorKey: "players",
    header: "PLAYERS",
  },
  {
    accessorKey: "exportFile",
    header: "EXPORT FILE",
    cell: ({ row }) => (
      <Button
        className="bg-green-800"
        onClick={() => handleExport(row.original)}
      >
        Export
      </Button>
    ),
  },
];

const handleExport = (record: PartnerManagementData) => {
  // Implement the export functionality here
  console.log("Exporting record:", record);
};

// Dummy data for NETWORK STATS
export const allNetworkStatsData: PartnerManagementData[] = [
  {
    operatorName: "ALL OPERATORS",
    ppApproved: "",
    ppPending: "",
    gpApproved: "",
    gpPending: "",
    players: "",
    exportFile: "",
  },
];

export const operatorWiseNetworkStatsData: PartnerManagementData[] = [
  {
    operatorName: "ETA-001",
    ppApproved: "",
    ppPending: "",
    gpApproved: "",
    gpPending: "",
    players: "",
    exportFile: "",
  },

  {
    operatorName: "ETA-002",
    ppApproved: "",
    ppPending: "",
    gpApproved: "",
    gpPending: "",
    players: "",
    exportFile: "",
  },
];

export type NetworkCommissionData = {
  operatorName: string;
  pendingCommission: number | string;
  status: string;
  allTime: number | string;
  total: number | string;
};

export const networkCommissionColumns: ColumnDef<NetworkCommissionData>[] = [
  {
    accessorKey: "operatorName",
    header: "OPERATOR NAME",
  },
  {
    accessorKey: "pendingCommission",
    header: "PENDING COMMISSION",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "allTime",
    header: "ALL TIME",
  },
  {
    accessorKey: "total",
    header: "TOTAL",
  },
];

// Dummy data for NETWORK COMMISSION
export const networkCommissionData: NetworkCommissionData[] = [
  {
    operatorName: "ETA-001",
    pendingCommission: "10,000",
    status: "RELEASED",
    allTime: "1,00,000",
    total: "1,10,000",
  },
  {
    operatorName: "ETA-002",
    pendingCommission: "5,000",
    status: "PENDING",
    allTime: "10,000",
    total: "15,000",
  },
];
