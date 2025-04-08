"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Separator } from "@/components/ui/separator";
import { QRCodeSVG } from "qrcode.react";
import { DataTable } from "@/components/tables/data-table";
import {
  OperatorTopPerformersAllTime,
  operatorTopPerformersAllTime,
  OperatorTopPerformersPerCutoff,
  operatortopPerformersPerCutoff,
} from "@/components/tables/operator/general/dashboard-columns";
import CommonDashboard from "@/components/tables/common/common-downloadReports-components/common-dashboard-part";
import Data from "./operator.json";
import { useSelector } from "@/redux/store";
import axios from "axios";
import { PlatinumNetworkOverviewData } from "@/components/tables/platinum/general/dashboard-columns";

type Props = {};

export default function Dashboard({}: Props) {
  const performerAllTimeData: OperatorTopPerformersAllTime[] =
    Data.performerAllTimeData || [];
  const performerOneTimeData: OperatorTopPerformersPerCutoff[] =
    Data.performerOneTimeData || [];

  // const networkOverviewData: any[] = Data.networkOverviewData;

  // const performerAllTimeData: OperatorTopPerformersAllTime[] = [
  //   {
  //     platinumName: "PLAT-001",
  //     depositsCutoffPeriod: "Feb 1 - Feb 15, 2025",
  //     totalDepositsToDate: 100000,
  //   },
  //   {
  //     platinumName: "PLAT-002",
  //     depositsCutoffPeriod: "Feb 16 - Feb 28, 2025",
  //     totalDepositsToDate: 85000,
  //   },
  //   {
  //     platinumName: "PLAT-003",
  //     depositsCutoffPeriod: "Mar 1 - Mar 15, 2025",
  //     totalDepositsToDate: 120000,
  //   },
  // ];

  // const performerOneTimeData: OperatorTopPerformersPerCutoff[] = [
  //   {
  //     platinumName: "PLAT-001",
  //     ggrCutoffPeriod: "Feb 1 - Feb 15, 2025",
  //     totalGgrToDate: 100000,
  //   },
  //   {
  //     platinumName: "PLAT-002",
  //     ggrCutoffPeriod: "Feb 16 - Feb 28, 2025",
  //     totalGgrToDate: 75000,
  //   },
  //   {
  //     platinumName: "PLAT-003",
  //     ggrCutoffPeriod: "Mar 1 - Mar 15, 2025",
  //     totalGgrToDate: 110000,
  //   },
  // ];

  // const user = useSelector((state) => state.authReducer.user);

  // console.log("user", user);

  const { user } = useSelector((state) => state.authReducer);

  const [allTimeTopPerformersData, setAllTimeTopPerformersData] =
    React.useState<OperatorTopPerformersAllTime[]>([]);

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
      if (data && data.networkOverview && Array.isArray(data.networkOverview)) {
        // Transform API response to match our PlatinumNetworkOverviewData type
        const formattedData = data.networkOverview
          .filter((item) => {
            const role = item.role?.toLowerCase() || "";
            return role !== "superadmin" && role !== "operator";
          })
          .map((item) => ({
            role: item.role || "",
            approved: item.approved || 0,
            declined: item.declined || 0,
            suspended: item.suspended || 0,
          }));

        console.log("Formatted network overview data:", formattedData);

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
          platinumName: performer.name || "",
          pendingCommission: performer.pendingCommission || 0,
          released: performer.released || 0,
        }));

        console.log("Formatted all time top performers data:", formattedData);

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
    <div className="container mx-auto p-4 space-y-6">
      {/* below is the common-dashboard-part rendered */}
      <CommonDashboard
        welcomeTierName="Platinum Partners"
        referralLink={user?.affiliateLink}
        networkOverviewData={networkOverviewData}
      />

      {/* Top Performers All Time */}
      <CardContent className="p-1  ">
        {/* <CardContent className=" "> */}
        <h2 className="text-lg font-semibold">Top Performers All Time</h2>
      </CardContent>

      <DataTable
        columns={operatorTopPerformersAllTime}
        data={allTimeTopPerformersData}
        tooltips={{
          pendingCommission: "As of available cutoff period",
        }}
      />

      {/* Per Cut Off */}
      <CardContent className="p-1  ">
        {/* <CardContent className=" "> */}
        <h2 className="text-lg font-semibold">Per Cut Off</h2>
      </CardContent>

      <DataTable
        columns={operatortopPerformersPerCutoff}
        data={allTimeTopPerformersData}
        tooltips={{
          pendingCommission: "As of available cutoff period",
        }}
      />
    </div>
  );
}
