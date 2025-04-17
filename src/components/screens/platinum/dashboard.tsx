"use client";

import React, { useEffect } from "react";
import {
  platinumtopPerformersAllTimeColumns,
  platinumtopPerformersPerCutoffColumns,
  PlatinumTopPerformersAllTimeData,
  PlatinumTopPerformersPerCutoffData,
  PlatinumNetworkOverviewData,
} from "../../tables/platinum/general/dashboard-columns";
import { QRCodeSVG } from "qrcode.react";

import { TypographyH2 } from "@/components/ui/typographyh2";

import { DataTable } from "@/components/tables/data-table";
import CommonDashboard from "@/components/tables/common/common-downloadReports-components/common-dashboard-part";
import Data from "./platinum.json";
import { useSelector } from "@/redux/store";
import axios from "axios";
import { NetworkOverviewData } from "@/components/tables/common/common-column-defs/common-dashboard-part-column";

type Props = {};

// Dummy data for PlatinumTopPerformersAllTimeData
const platinumTopPerformersAllTimeData: PlatinumTopPerformersAllTimeData[] =
  Data.platinumTopPerformersAllTimeData || [];

// Dummy data for PlatinumTopPerformersPerCutoffData
const platinumTopPerformersPerCutoffData: PlatinumTopPerformersPerCutoffData[] =
  Data.platinumTopPerformersPerCutoffData || [];

const networkOverviewData: any[] = Data.networkOverviewData;

//dummy data ends

export default function Dashboard({}: Props) {
  const { user, role } = useSelector((state) => state.authReducer);

  const [allTimeTopPerformersData, setAllTimeTopPerformersData] =
    React.useState<PlatinumTopPerformersAllTimeData[]>([]);

  const [networkOverviewData, setNetworkOverviewData] = React.useState<
    PlatinumNetworkOverviewData[]
  >([]);

  const fetchNetworkOverviewData = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      // Fetch data from the API or perform any other async operation
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/network-statistics`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data.data; // Use response.data instead of response.json()
      console.log("Fetched network overview data:", data);

      // Transform API response to match our PlatinumNetworkOverviewData type
      if (data) {
        const formattedData: NetworkOverviewData[] = [];

        // Extract data for each role from the response
        for (const [role, stats] of Object.entries(data)) {
          if (typeof stats === "object" && stats !== null) {
            formattedData.push({
              network: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize role name
              approved: (stats as any).approved || 0,
              pending: (stats as any).pending || 0,
              suspended: (stats as any).declined || 0,
              summary: "_",
            });
          }
        }

        console.log("Formatted operator statistics data:", formattedData);
        setNetworkOverviewData(formattedData);
        return;
      }
      setNetworkOverviewData(data);
    } catch (error) {
      console.error("Error fetching network overview data:", error);
    }
  };

  const fetchAllTimeTopPerformersData = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      // Fetch data from the API or perform any other async operation
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/top-performers/role/${user.role.name}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data; // Use response.data instead of response.json()
      console.log("Fetched all time top performers data:", data);

      // Transform API response to match our PlatinumTopPerformersAllTimeData type
      if (data && data.topPerformers && Array.isArray(data.topPerformers)) {
        const formattedData = data.topPerformers.map((performer: any) => ({
          goldenName: performer.name || "",
          pendingCommission: performer.pendingCommission || 0,
          released: performer.released || 0,
        }));

        console.log("Formatted all time network data:", formattedData);

        setAllTimeTopPerformersData(formattedData);
        return;
      }

      setAllTimeTopPerformersData(data);
    } catch (error) {
      console.error("Error fetching all time top performers data:", error);
    }
  };

  useEffect(() => {
    fetchAllTimeTopPerformersData();
    fetchNetworkOverviewData();
  }, []);

  return (
    <div>
      <div className="container mb-10">
        <CommonDashboard
          welcomeTierName="Platinum Partners"
          referralLink={user?.affiliateLink}
          networkOverviewData={networkOverviewData}
          userRole={user?.role.name}
          userId={user?.id}
        />

        {/* Top Performers All Time */}
        <div className="mb-10">
          <TypographyH2 className="mb-4">Top Performers All Time</TypographyH2>

          <DataTable
            columns={platinumtopPerformersAllTimeColumns}
            data={allTimeTopPerformersData}
            columnWidths={["250px", "250px", "250px"]}
            tooltips={{
              pendingCommission: "As of available cutoff period",
            }}
          />
        </div>

        {/* Per Cut Off */}
        <div className="mb-10">
          <TypographyH2 className="mb-4">Per Cut Off</TypographyH2>

          <DataTable
            columns={platinumtopPerformersPerCutoffColumns}
            data={allTimeTopPerformersData}
            columnWidths={["250px", "250px", "250px"]}
            tooltips={{
              pendingCommission: "As of available cutoff period",
            }}
          />
        </div>
      </div>
    </div>
  );
}
