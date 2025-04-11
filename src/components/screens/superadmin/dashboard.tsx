"use client";

import { DataTable } from "@/components/tables/data-table";
import {
  CategoryFinancialOverview,
  categoryFinancialOverviewColumns,
  CommissionAvailableForSettlement,
  commissionAvailableForSettlementColumns,
  CommissionOverview,
  commissionOverviewColumns,
  commissionRunningTally,
  commissionRunningTallyColumns,
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
  TotalCommissionPayoutsBreakdown,
  totalCommissionPayoutsBreakdownColumns,
} from "@/components/tables/superadmin/general/dashboard-columns";
import { TypographyH2 } from "@/components/ui/typographyh2";
import { TypographyH4 } from "@/components/ui/typographyh4";
import React, { useEffect } from "react";

import Data from "./superAdmin.json";
import axios from "axios";
import { useSelector } from "@/redux/store";
import { Badge } from "@/components/ui/badge";

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

export const defaultTopPerformersData: TopPerformersOverview[] = [
  {
    item: "Deposits",
    playerUserId: "",
    operator: "",
    basedOnPreviouslyCompletedMonth: "",
    allTime: "",
  },
  {
    item: "Total Bet Amount",
    playerUserId: "",
    operator: "",
    basedOnPreviouslyCompletedMonth: "",
    allTime: "",
  },
  {
    item: "GGR",
    playerUserId: "",
    operator: "",
    basedOnPreviouslyCompletedMonth: "",
    allTime: "",
  },
];

export const defaultCommissionRunningTallyData: commissionRunningTally[] = [
  {
    item: "ALL OPERATORS",
    eGames: "",
    sportsBetting: "",
  },
];

export const defaultCommissionAvailableForSettlementData: CommissionAvailableForSettlement[] =
  [
    {
      item: "ALL OPERATORS",
      availableForPayout: "",
      settledAllTime: "",
    },
  ];

export const defaultCommissionPayoutsBreakdown: TotalCommissionPayoutsBreakdown[] =
  [
    {
      metric: "Total Deposits",
      amountPendingSettlement: "",
      settledAllTime: "",
    },
    {
      metric: "Total Withdrawals",
      amountPendingSettlement: "",
      settledAllTime: "",
    },
    {
      metric: "Total Bet Amount(Turnover)",
      amountPendingSettlement: "",
      settledAllTime: "",
    },
    {
      metric: "Net GGR",
      amountPendingSettlement: "",
      settledAllTime: "",
    },
    {
      metric: "Gross Commission (% of Net GGR)",
      amountPendingSettlement: "",
      settledAllTime: "",
    },
    {
      metric: "Payment Gateway Fees",
      amountPendingSettlement: "",
      settledAllTime: "",
    },
    {
      metric: "Net Commission Available for Payout",
      amountPendingSettlement: "",
      settledAllTime: "",
    },
  ];

export default function Dashboard({}) {
  const { user, role } = useSelector((state) => state.authReducer);

  const [allTimeTopPerformersData, setAllTimeTopPerformersData] =
    React.useState<TopPerformersOverview[]>([]);

  const [operatorStatisticsData, setOperatorStatisticsData] = React.useState<
    NetworkStatistics[]
  >([]);

  const [commissionRunningTallyData, setCommissionRunningTallyData] =
    React.useState<commissionRunningTally[]>([]);

  const [commissionDateRange, setCommissionDateRange] = React.useState({
    from: "",
    to: "",
  });

  const [payoutsDateRange, setPayoutsDateRange] = React.useState({
    from: "",
    to: "",
  });

  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [
    totalCommissionPayoutsBreakdownData,
    setTotalCommissionPayoutsBreakdownData,
  ] = React.useState<TotalCommissionPayoutsBreakdown[]>([]);

  const [
    eGamesTotalCommissionPayoutsBreakdownData,
    setEGamesTotalCommissionPayoutsBreakdownData,
  ] = React.useState<TotalCommissionPayoutsBreakdown[]>([]);

  const [
    sportsBettingTotalCommissionPayoutsBreakdownData,
    setSportsBettingTotalCommissionPayoutsBreakdownData,
  ] = React.useState<TotalCommissionPayoutsBreakdown[]>([]);

  const [
    commissionAvailableForSettlementData,
    setCommissionAvailableForSettlementData,
  ] = React.useState<CommissionAvailableForSettlement[]>([]);

  function formatCommissionRunningTally(
    response: any
  ): commissionRunningTally[] {
    const tallyData = response?.data?.tally || [];
    
    // Update the date range with formatted dates
    if (response?.data?.from && response?.data?.to) {
      const fromDate = new Date(response.data.from);
      const toDate = new Date(response.data.to);
      
      // Format dates as DD/MM/YYYY
      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      setCommissionDateRange({
        from: formatDate(fromDate),
        to: formatDate(toDate)
      });
    }
    
    return tallyData.map((entry: any) => ({
      item: response.data.roleLabel,
      eGames: entry.eGames,
      sportsBetting: entry.sportsBetting,
    }));
  }

  function formatCommissionDataForTable(
    data: any
  ): TotalCommissionPayoutsBreakdown[] {
    if (!data?.data?.overview) return [];

    return data.data?.overview.map((entry: any) => {
      let item = entry.metric;

      // Add subtext for Net Commission
      if (item === "Net Commission Available for Payout") {
        item =
          "Net Commission Available for Payout\n(Gross Commission less Payment Gateway Fees)";
      }

      return {
        item,
        amountPendingSettlement:
          entry.pendingSettlement !== undefined ? entry.pendingSettlement : "",
        settledAllTime: entry.allTime !== undefined ? entry.allTime : "",
      };
    });
  }

  const fetchCommissionRunningTallyData = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      //
      // Fetch data from the API or perform any other async operation
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/running-tally`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data; // Use response.data instead of response.json()
      console.log("Fetched commission running tally data:", data);

      // Transform API response to match our CommissionRunningTally type
      if (data && data.data) {
        const formatted = formatCommissionRunningTally(data);

        // console.log({ formatted });

        // const formattedData = data.map((statistic: any) => ({
        //   item: statistic.role || "",
        //   eGames: statistic.eGames || 0,
        //   sportsBetting: statistic.sportsBetting || 0,
        // }));

        // console.log("Formatted commission running tally data:", formattedData);

        setCommissionRunningTallyData(formatted);
        return;
      }
    } catch (error) {
      console.error("Error fetching commission running tally data:", error);
    }
  };

  const fetchCommissionBreakdownData = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      // Fetch data from the API or perform any other async operation
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/payout-report`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data; // Use response.data instead of response.json()
      console.log(
        "Fetched commission overview data:++++++++++++++++++++++++++++++++++",
        data
      );

      // Set date range from periodInfo
      if (data?.data?.periodInfo?.pendingPeriod) {
        const { start, end } = data.data.periodInfo.pendingPeriod;
        setPayoutsDateRange({
          from: formatDate(start),
          to: formatDate(end)
        });
      }

      setTotalCommissionPayoutsBreakdownData(data.data?.overview);
      setEGamesTotalCommissionPayoutsBreakdownData(
        data.data?.breakdownPerGame.eGames
      );
      setSportsBettingTotalCommissionPayoutsBreakdownData(
        data.data?.breakdownPerGame["Sports-Betting"]
      );
      // return;
      // }
    } catch (error) {
      console.error("Error fetching commission overview data:", error);
    }
  };

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
      if (data) {
        const formattedData: NetworkStatistics[] = [];

        // Extract data for each role from the response
        for (const [role, stats] of Object.entries(data)) {
          if (typeof stats === "object" && stats !== null) {
            formattedData.push({
              role: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize role name
              approved: (stats as any).approved || 0,
              pending: (stats as any).pending || 0,
              declined: (stats as any).declined || 0,
            });
          }
        }

        console.log("Formatted operator statistics data:", formattedData);
        setOperatorStatisticsData(formattedData);
        return;
      }

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
          item: performer?.metric || "", // e.g. "Deposits", "Total Bet Amount", "GGR"
          playerUserId: performer?.playerId || "",
          operator: performer?.operatorName || "",
          basedOnPreviouslyCompletedMonth: performer?.monthlyValue || "",
          allTime: performer?.allTimeValue || "",
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
    fetchCommissionRunningTallyData();
    fetchCommissionBreakdownData();
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
          <div className="flex items-center gap-2 mb-2">
            <TypographyH2 className="">Commission Running Tally</TypographyH2>
            <Badge variant="outline" className="text-xs">
              {commissionDateRange.from} - {commissionDateRange.to}
            </Badge>
          </div>
        </div>
        <div className="mb-4">
          <DataTable
            columns={commissionRunningTallyColumns}
            data={
              commissionRunningTallyData.length
                ? commissionRunningTallyData
                : defaultCommissionRunningTallyData
            }
            columnWidths={["250px", "250px", "250px"]}
            tooltips={
              {
                // pendingCommission: "As of Available cutoff period",
              }
            }
          />
          <div className="mb-4">
            <TypographyH2 className="mb-2">
              Commission Available for Settlement
            </TypographyH2>
            {/* <p>
            Cutoff period available for settlement:{" "}
            <span>Feb1 - Feb 15, 2025</span>
          </p> */}
          </div>
          <div className="mb-4">
            <DataTable
              columns={commissionAvailableForSettlementColumns}
              data={
                commissionAvailableForSettlementData.length
                  ? commissionAvailableForSettlementData
                  : defaultCommissionAvailableForSettlementData
              }
              columnWidths={["250px", "250px", "250px"]}
              tooltips={{
                availableForPayout:
                  "Based on unsettled completed commission periods",
              }}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TypographyH2 className="">Total Commission Payouts Breakdown</TypographyH2>
              <Badge variant="outline" className="text-xs">
                {payoutsDateRange.from} - {payoutsDateRange.to}
              </Badge>
            </div>
          </div>
          <div className="mb-4">
            <DataTable
              columns={totalCommissionPayoutsBreakdownColumns}
              data={totalCommissionPayoutsBreakdownData}
              columnWidths={["250px", "250px", "250px", "250px", "150px"]}
              tooltips={{
                pendingCommission: "As of Available cutoff period",
              }}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TypographyH2 className="">Breakdown Per Game</TypographyH2>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <TypographyH4 className="">eGames</TypographyH4>
              <Badge variant="outline" className="text-xs">
                {payoutsDateRange.from} - {payoutsDateRange.to}
              </Badge>
            </div>
            <DataTable
              columns={totalCommissionPayoutsBreakdownColumns}
              data={
                eGamesTotalCommissionPayoutsBreakdownData?.length
                  ? eGamesTotalCommissionPayoutsBreakdownData
                  : defaultCommissionPayoutsBreakdown
              }
              columnWidths={["250px", "250px", "250px", "250px", "150px"]}
              tooltips={{
                pendingCommission: "As of Available cutoff period",
              }}
            />
          </div>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <TypographyH4 className="">Sports Betting</TypographyH4>
              <Badge variant="outline" className="text-xs">
                {payoutsDateRange.from} - {payoutsDateRange.to}
              </Badge>
            </div>
            <DataTable
              columns={totalCommissionPayoutsBreakdownColumns}
              data={
                sportsBettingTotalCommissionPayoutsBreakdownData?.length
                  ? sportsBettingTotalCommissionPayoutsBreakdownData
                  : defaultCommissionPayoutsBreakdown
              }
              columnWidths={["250px", "250px", "250px", "250px", "150px"]}
              tooltips={{
                pendingCommission: "As of Available cutoff period",
              }}
            />
          </div>
        </div>
        {/* <DataTable
          columns={financialOverviewColumns}
          data={[]}
          columnWidths={["250px", "250px", "250px", "250px"]}
          tooltips={{
            pendingCommission: "As of Available cutoff period",
          }}
        /> */}
      </div>
      {/* <div className="mb-10">
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
      </div> */}
      {/* <div className="mb-4">
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
      </div> */}
      <div className="mb-10">
        <TypographyH2 className="mb-2">Top Performers</TypographyH2>
        {/* <TypographyH4 className="mb-2">All Time</TypographyH4> */}
        <DataTable
          columns={topPerformersColumns}
          data={
            // allTimeTopPerformersData.length
            //   ? allTimeTopPerformersData
            //   :
            defaultTopPerformersData
          }
          columnWidths={["250px", "250px", "250px"]}
          tooltips={{
            pendingCommission: "As of Available cutoff period",
          }}
        />
        {/* <div className="mt-4">
          <TypographyH4 className="mb-2">Per Cutoff</TypographyH4>
          <DataTable
            columns={topPerformersColumns}
            data={allTimeTopPerformersData}
            columnWidths={["250px", "250px", "250px"]}
            tooltips={{
              pendingCommission: "As of Available cutoff period",
            }}
          />
        </div> */}
      </div>
      {/* <div className="mb-10">
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
      </div> */}
    </div>
  );
}
