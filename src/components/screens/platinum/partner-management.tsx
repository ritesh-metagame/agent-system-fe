"use client";

import React, { useEffect } from "react";

import {
  platinumnetworkCommissionColumns,
  platinumnetworkStatsColumns,
} from "../../tables/platinum/network/partner-management-columns";

import type {
  PlatinumNetworkCommissionData,
  PlatinumNetworkStatsData,
} from "../../tables/platinum/network/partner-management-columns";
// import { QRCodeSVG } from "qrcode.react";
// import { Card, CardContent } from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/typographyh2";
// import { TypographyH4 } from "@/components/ui/typographyh4";

import { DataTable } from "@/components/tables/data-table";
import Data from "./platinum.json";
import {
  partnerColumns,
  PartnerManagementData,
} from "@/components/tables/superadmin/network/partner-management-columns";
import { TypographyH4 } from "@/components/ui/typographyh4";

type Props = {};

// Dummy data for PlatinumNetworkStatsData
const PlatinumNetworkStatsData: PlatinumNetworkStatsData[] =
  Data.platinumNetworkStatsData || [];
// Dummy data for PlatinumNetworkCommissionData
const PlatinumNetworkCommissionData: PlatinumNetworkCommissionData[] =
  Data.platinumNetworkCommissionData || [];

export default function PlatinumPartnerManagement({}: Props) {
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

      const partnersList = data.data.map((p: any) => ({
        username: p.username,
        role: p.role.name,
        mobileNumber: p.mobileNumber,
        bankName: p.bankName,
        accountNumber: p.accountNumber,
        createdAt: new Date(p.createdAt).toLocaleDateString(),
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
        {/* <div className="mb-4">
              <DataTable
                columns={partnerManagementColumns}
                data={allNetworkStatsData}
                columnWidths={[
                  "300px",
                  "250px",
                  "150px",
                  "150px",
                  "150px",
                  "150px",
                  "150px",
                ]}
              />
            </div>
            <DataTable
              columns={partnerManagementColumns}
              data={operatorWiseNetworkStatsData}
              columnWidths={[
                "300px",
                "250px",
                "150px",
                "150px",
                "150px",
                "150px",
                "150px",
              ]}
            />
          </div>
          <div className="mb-10">
            <div className="mb-4">
              <TypographyH2 className="mb-2">Network Commissions</TypographyH2>
            </div>
            <div className="mb-4">
              <DataTable
                columns={networkCommissionColumns}
                data={networkCommissionData}
                columnWidths={["300px", "250px", "150px", "150px", "150px"]}
                tooltips={{
                  pendingCommission: "As of available cutoff period",
                }}
              />
            </div>
          </div> */}
        <div className="mb-10">
          <div className="mb-4">
            <TypographyH4 className="mb-2">
              Cutoff period available for settlement:{" "}
              <span className="text-gray-500">Feb 1 - Feb 15, 2025</span>
            </TypographyH4>
          </div>
        </div>
      </div>
    </div>
  );
}
