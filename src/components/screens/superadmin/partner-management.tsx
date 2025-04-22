"use client";

import { DataTable } from "@/components/tables/data-table";
import {
  networkCommissionColumns,
  partnerColumns,
  partnerManagementColumns,
} from "@/components/tables/superadmin/network/partner-management-columns";

import type {
  NetworkCommissionData,
  PartnerManagementData,
  Partners,
} from "@/components/tables/superadmin/network/partner-management-columns";
import { TypographyH2 } from "@/components/ui/typographyh2";
import { TypographyH4 } from "@/components/ui/typographyh4";
import React, { useEffect } from "react";
import Data from "./superAdmin.json";

const networkCommissionData: NetworkCommissionData[] =
  Data.networkCommissionData || [];

// Dummy data for NETWORK STATS
export const allNetworkStatsData: PartnerManagementData[] =
  Data.allNetworkStatsData || [];

export const operatorWiseNetworkStatsData: PartnerManagementData[] =
  Data.operatorWiseNetworkStatsData || [];

type Props = {};

export default function PartnerManagement({}: Props) {
  // Dummy data for GoldNetworkStats
  const [partners, setPartners] = React.useState<PartnerManagementData[]>();

  useEffect(() => {
    const fetchPartners = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/partners`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Error fetching partners:", res.statusText);
        return;
      }

      const data = await res.json();

      console.log("Fetched partners:", data.data);

      const partnersList = data.data?.map((p: any) => ({
        username: p.username,
        role: p.role.name,
        mobileNumber: p.mobileNumber,
        bankName: p.bankName,
        accountNumber: p.accountNumber,
        createdAt: new Date(p.createdAt).toLocaleDateString(),
        commissions: p.commissions,
      }));

      console.log("Mapped partners:", partnersList);

      setPartners(partnersList);
    };

    fetchPartners();
  }, []);

  return (
    <div>
      <div className="mb-10">
        <TypographyH2 className="mb-4">Partners</TypographyH2>
        <div className="mb-4">
          <DataTable
            columns={partnerColumns}
            data={(partners as any) ?? []}
            columnWidths={[
              "100px",
              "100px",
              "150px",
              "150px",
              "200px",
              "150px",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
