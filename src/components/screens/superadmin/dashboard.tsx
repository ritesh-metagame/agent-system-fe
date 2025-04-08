"use client";

import { DataTable } from "@/components/tables/data-table";
import {
  CategoryFinancialOverview,
  categoryFinancialOverviewColumns,
  CommissionOverview,
  commissionOverviewColumns,
  FinancialOverview,
  financialOverviewColumns,
  NetworkStatistics,
  networkStatisticsColumn,
  SportsBettingOverview,
  sportsBettingOverviewColumns,
  topPerformersColumns,
  TopPerformersOverview,
  topPlayersDepositsColumns,
  TopPlayersDepositsOverview,
  topPlayersGGRColumns,
  TopPlayersGGROverview,
} from "@/components/tables/superadmin/general/dashboard-columns";
import { TypographyH2 } from "@/components/ui/typographyh2";
import { TypographyH4 } from "@/components/ui/typographyh4";
import React, { useEffect } from "react";

import Data from "./superAdmin.json";
import axios from "axios";
import { useSelector } from "@/redux/store";

// type Props = {};

// const data: NetworkStatistics[] = Data.networkStatistics || [];

const dummyCommissionData: CommissionOverview[] = Data.commissionOverview || [];
export const financialOverviewData: FinancialOverview[] =
  Data.financialOverview || [];

const topPlayersDepositsData: TopPlayersDepositsOverview[] =
  Data.topPlayersDepositsOverview || [];
const topPlayersGGRData: TopPlayersGGROverview[] =
  Data.topPlayersGGROverview || [];

export const categoryFinancialOverviewData: CategoryFinancialOverview[] =
  Data.categoryFinancialOverview || [];

const sportsBettingOverviewData: SportsBettingOverview[] =
  Data.sportsBettingOverview || [];

const topPerformersData: TopPerformersOverview[] =
  Data.topPerformersOverview || [];

const topPerformersDataPerCutoff: TopPerformersOverview[] =
  Data.topPerformersOverview || [];

export default function Dashboard({}) {
  const { user, role } = useSelector((state) => state.authReducer);

  const [allTimeTopPerformersData, setAllTimeTopPerformersData] =
    React.useState<TopPerformersOverview[]>([]);

  const [operatorStatisticsData, setOperatorStatisticsData] = React.useState<
    NetworkStatistics[]
  >([]);

  const fetchOperatorStatisticsData = async () => {
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
      console.log("Fetched operator statistics data:", data);

      // Transform API response to match our NetworkStatistics type
      if (data && Array.isArray(data)) {
        // const formattedData = data.map((statistic: any) => ({
        //   networkName: statistic.role || "",
        //   totalDeposits: statistic.totalDeposits || 0,
        //   totalGGR: statistic.totalGGR || 0,
        // }));

        console.log("Formatted operator statistics data:", data);

        // setOperatorStatisticsData(formattedData);
        setOperatorStatisticsData(data);
        return;
      }
    } catch (error) {
      console.error("Error fetching operator statistics data:", error);
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
          operatorName: performer.name || "",
          pendingCommission: performer.pendingCommission || 0,
          releasedAllTime: performer.released || 0,
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
    fetchOperatorStatisticsData();
  }, []);
  return (
    <div>
      <div className="mb-10">
        <TypographyH2 className="mb-4">Operator Statistics</TypographyH2>
        <DataTable
          columns={networkStatisticsColumn}
          data={operatorStatisticsData}
          columnWidths={["250px", "250px", "250px"]}
        />
      </div>
      <div className="mb-10">
        <div className="mb-4">
          <TypographyH2 className="mb-2">Commissions Overview</TypographyH2>
          <p>
            Cutoff period available for settlement:{" "}
            <span>Feb1 - Feb 15, 2025</span>
          </p>
        </div>
        <div className="mb-4">
          <DataTable
            columns={commissionOverviewColumns}
            data={[]}
            columnWidths={["250px", "250px"]}
            tooltips={{
              pendingCommission: "As of Available cutoff period",
            }}
          />
        </div>
        <DataTable
          columns={financialOverviewColumns}
          data={[]}
          columnWidths={["250px", "250px", "250px", "250px"]}
          tooltips={{
            pendingCommission: "As of Available cutoff period",
          }}
        />
      </div>
      <div className="mb-4">
        <TypographyH2 className="mb-2">Per Category</TypographyH2>
        <TypographyH4 className="mb-2">eGames</TypographyH4>
        <DataTable
          columns={categoryFinancialOverviewColumns}
          data={[]}
          columnWidths={["250px", "250px", "250px", "250px", "150px"]}
          tooltips={{
            pendingCommission: "As of Available cutoff period",
          }}
        />
      </div>
      <div className="mb-10">
        <TypographyH4 className="mb-2">Sports Betting</TypographyH4>
        <DataTable
          columns={sportsBettingOverviewColumns}
          data={[]}
          columnWidths={["250px", "250px", "250px", "250px", "150px"]}
          tooltips={{
            pendingCommission: "As of Available cutoff period",
          }}
        />
      </div>
      <div className="mb-10">
        <TypographyH2 className="mb-2">Top Performers</TypographyH2>
        <TypographyH4 className="mb-2">All Time</TypographyH4>
        <DataTable
          columns={topPerformersColumns}
          data={allTimeTopPerformersData}
          columnWidths={["250px", "250px", "250px"]}
          tooltips={{
            pendingCommission: "As of Available cutoff period",
          }}
        />
        <div className="mt-4">
          <TypographyH4 className="mb-2">Per Cutoff</TypographyH4>
          <DataTable
            columns={topPerformersColumns}
            data={allTimeTopPerformersData}
            columnWidths={["250px", "250px", "250px"]}
            tooltips={{
              pendingCommission: "As of Available cutoff period",
            }}
          />
        </div>
      </div>
      <div className="mb-10">
        <TypographyH2 className="mb-2">Top Players</TypographyH2>
        <TypographyH4 className="mb-2">Deposits</TypographyH4>
        <DataTable
          columns={topPlayersDepositsColumns}
          data={[]}
          columnWidths={["250px", "250px", "250px", "250px"]}
        />
        <div className="mt-4">
          <TypographyH4 className="mb-2">GGR</TypographyH4>
          <DataTable
            columns={topPlayersGGRColumns}
            data={[]}
            columnWidths={["250px", "250px", "250px", "250px"]}
            tooltips={{
              pendingCommission: "As of Available cutoff period",
            }}
          />
        </div>
      </div>
    </div>
  );
}
