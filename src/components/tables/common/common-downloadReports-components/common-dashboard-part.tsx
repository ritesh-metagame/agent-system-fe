"use client";

import React, { useEffect, useState } from "react";
import {
  cutoffPeriodColumns,
  networkOverviewColumns,
  overallSummaryColumns,
  eGamesColumns,
  sportsbettingColumns,
} from "../common-column-defs/common-dashboard-part-column";

import type {
  CutoffPeriodData,
  NetworkOverviewData,
  EGamesData,
  SportsbettingData,
  OverallSummaryData,
} from "../common-column-defs/common-dashboard-part-column";
import { QRCodeSVG } from "qrcode.react";

import { Card, CardContent } from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/typographyh2";
// import { TypographyH4 } from "@/components/ui/typographyh4";

import { DataTable } from "@/components/tables/data-table";
import Data from "./dashboard.json";
import axios from "axios";
import { TypographyH4 } from "@/components/ui/typographyh4";
import {
  CommissionAvailableForSettlement,
  commissionAvailableForSettlementColumns,
  commissionRunningTally,
  commissionRunningTallyColumns,
  NetworkStatistics,
  TotalCommissionPayoutsBreakdown,
  totalCommissionPayoutsBreakdownColumns,
} from "../../superadmin/general/dashboard-columns";
import {
  defaultCommissionAvailableForSettlementData,
  defaultCommissionPayoutsBreakdown,
  defaultCommissionRunningTallyData,
} from "@/components/screens/superadmin/dashboard";
import { useSelector } from "@/redux/store";
import { UserRole } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

type Props = {};

// dummy data starts

// Dummy data for  CutoffPeriodData
const CutoffPeriodData: CutoffPeriodData[] = Data.cutoffPeriodData || [];

// Dummy data for  NetworkOverviewData
const NetworkOverviewData: NetworkOverviewData[] =
  Data.networkOverviewData || [];

// Dummy data for  OverallSummaryData
const OverallSummaryData: OverallSummaryData[] = Data.overallSummaryData || [];

// Dummy data for  EGamesData
const EGamesData: EGamesData[] = Data.eGamesData || [];

// Dummy data for  SportsbettingData
const SportsbettingData: SportsbettingData[] = Data.sportsbettingData || [];

//dummy data ends

export default function CommonDashboard({
  welcomeTierName,
  referralLink,
  networkOverviewData,
  userRole,
}: any) {
  const [eGamesData, setEGamesData] = useState([]);
  const [sportsBettingData, setSportsBettingData] = useState([]);

  const role = useSelector((state) => state.authReducer.user.role.name);

  console.log("eGamesData:", eGamesData);
  console.log("sportsBettingData:", sportsBettingData);

  const token = localStorage.getItem("token");
  console.log("token:", token);

  const [operatorStatisticsData, setOperatorStatisticsData] = React.useState<
    NetworkStatistics[]
  >([]);

  const [commissionRunningTallyData, setCommissionRunningTallyData] =
    React.useState<commissionRunningTally[]>([]);

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
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  function formatCommissionRunningTally(
    response: any
  ): commissionRunningTally[] {
    const tallyData = response?.data?.tally || [];

    if (response?.data?.from && response?.data?.to) {
      const fromDate = new Date(response.data.from);
      const toDate = new Date(response.data.to);

      setCommissionDateRange({
        from: formatDate(fromDate.toISOString()),
        to: formatDate(toDate.toISOString()),
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

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/payout-report`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      console.log("Fetched commission overview data:", data);

      // Set date range from periodInfo
      if (data?.data?.periodInfo?.pendingPeriod) {
        const { start, end } = data.data.periodInfo.pendingPeriod;
        setPayoutsDateRange({
          from: formatDate(start),
          to: formatDate(end),
        });
      }

      setTotalCommissionPayoutsBreakdownData(data.data?.overview);
      setEGamesTotalCommissionPayoutsBreakdownData(
        data.data?.breakdownPerGame.eGames
      );
      setSportsBettingTotalCommissionPayoutsBreakdownData(
        data.data?.breakdownPerGame["Sports-Betting"]
      );
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

  useEffect(() => {
    const fetchTransactions = async (category: string, agent: string) => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/transactionsByCategory",
          {
            params: { categoryName: category, agent },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Ensure we always return an array
        const responseData = response.data.data;
        return Array.isArray(responseData) ? responseData : [];
      } catch (error) {
        console.error(`Error fetching ${category} transactions:`, error);
        return [];
      }
    };

    const formatCurrency = (value: number): string => {
      return `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`;
    };

    const getSummary = (data: any[]) => {
      console.log("------------------------", data);

      // Check if data is an array before trying to use reduce
      if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        return [
          {
            item: "TOTAL BETS",
            dailyOverview: "$0.00",
            pendingSettlement: "$0",
            previousSettled: "$0",
            summary: "$0.00",
          },
          {
            item: "TOTAL WINNINGS",
            dailyOverview: "$0.00",
            pendingSettlement: "$0",
            previousSettled: "$0",
            summary: "$0.00",
          },
          {
            item: "GGR",
            dailyOverview: "$0.00",
            pendingSettlement: "$0",
            previousSettled: "$0.00",
            summary: "$0.00",
          },
          {
            item: "GROSS COMMISSIONS",
            dailyOverview: "$0.00",
            pendingSettlement: "$0",
            previousSettled: "$0",
            summary: "$0.00",
          },
        ];
      }

      const totalBets = data.reduce(
        (sum, item) => sum + (item.betAmount || 0),
        0
      );
      const totalWinnings = data.reduce(
        (sum, item) => sum + (item.payoutAmount || 0),
        0
      );

      const grossCommissions = data.reduce((sum, item) => {
        const agentGold = item.agentGolden?.amount || 0;
        // If agentPlatinum and agentOperator are added later, you can extend this logic.
        return sum + agentGold;
      }, 0);

      const ggr = totalBets - totalWinnings;

      return [
        {
          item: "TOTAL BETS",
          dailyOverview: formatCurrency(totalBets),
          pendingSettlement: "$0",
          previousSettled: "$0",
          summary: formatCurrency(totalBets),
        },
        {
          item: "TOTAL WINNINGS",
          dailyOverview: formatCurrency(totalWinnings),
          pendingSettlement: "$0",
          previousSettled: "$0",
          summary: formatCurrency(totalWinnings),
        },
        {
          item: "GGR",
          dailyOverview: formatCurrency(ggr),
          pendingSettlement: "$0",
          previousSettled: "$0",
          summary: formatCurrency(ggr),
        },
        {
          item: "GROSS COMMISSIONS",
          dailyOverview: formatCurrency(grossCommissions),
          pendingSettlement: "$0",
          previousSettled: "$0",
          summary: formatCurrency(grossCommissions),
        },
      ];
    };

    const loadData = async () => {
      const eGames = await fetchTransactions("eGames", userRole);
      const sports = await fetchTransactions("Sports-Betting", userRole);

      fetchOperatorStatisticsData();
      fetchCommissionRunningTallyData();
      fetchCommissionBreakdownData();

      const eGamesSummary = getSummary(eGames);
      const sportsSummary = getSummary(sports);

      setEGamesData(eGamesSummary);
      setSportsBettingData(sportsSummary);
    };

    loadData();
  }, [token, userRole]);

  console.log("networkOverviewData:", networkOverviewData);

  return (
    <div>
      {/* QR Code and Referral Link */}
      {/* <Card> */}
      <CardContent className="p-4  flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <QRCodeSVG value={referralLink} size={80} />
          <p className="text-sm text-black-900">Download QR Code</p>
        </div>
      </CardContent>
      <div className="p-4 text-start">
        <p className="text-sm  font-bold">
          Referral Link:{" "}
          <a href="#" className="text-blue-500">
            {referralLink}
          </a>
        </p>
        <p className="text-md  text-black-900">
          Share this QR code and copy to onboard {welcomeTierName}
        </p>
      </div>
      {/* </Card> */}
      <div className="container mb-10">
        {/* <div className="mb-10">
          <div className="flex items-center gap-4">
            <TypographyH2 className="mb-4">
              Cutoff Period Available For Settlement :
            </TypographyH2>
            <p className="text-md font-medium text-gray-700">
              Feb 1 - Feb 15, 2025
            </p>
          </div>

          <DataTable
            columns={cutoffPeriodColumns}
            data={[]}
            columnWidths={["250px", "250px"]}
          />
        </div> */}

        <div className="mb-10">
          <TypographyH2 className="mb-4">Network Overview</TypographyH2>

          <DataTable
            columns={networkOverviewColumns}
            data={networkOverviewData}
            columnWidths={["250px", "250px", "250px", "250px", "250px"]}
          />
        </div>

        <div className="mb-10">
          {role !== UserRole.GOLD ? (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TypographyH2 className="">
                  Commission Running Tally
                </TypographyH2>
                <Badge variant="outline" className="text-xs">
                  {commissionDateRange.from} - {commissionDateRange.to}
                </Badge>
              </div>
              {/* <p>
            Cutoff period available for settlement:{" "}
            <span>Feb1 - Feb 15, 2025</span>
          </p> */}
            </div>
          ) : (
            <></>
          )}
          <div className="mb-4">
            {role !== UserRole.GOLD ? (
              <>
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
              </>
            ) : (
              <></>
            )}
            {role !== UserRole.GOLD ? (
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
            ) : (
              <></>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TypographyH2 className="">
                  Total Commission Payouts Breakdown
                </TypographyH2>
                <Badge variant="outline" className="text-xs">
                  {payoutsDateRange.from} - {payoutsDateRange.to}
                </Badge>
              </div>
              {/* <p>
            Cutoff period available for settlement:{" "}
            <span>Feb1 - Feb 15, 2025</span>
          </p> */}
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

        {/* summary */}
        {/* <div className="mb-10">
          <div className="flex items-center gap-4">
            <TypographyH2 className="mb-4">
              Summary: eGames & Sports-Betting
            </TypographyH2>
            <p className="text-md font-medium text-gray-700">
              Cutoff Period: Feb 1 - Feb 15, 2025
            </p>
          </div>

          <DataTable
            columns={overallSummaryColumns}
            data={Data.overallSummaryData}
            columnWidths={["250px", "250px", "250px", "250px"]}
          />
        </div> */}

        {/* egames */}

        {/* <div className="mb-10">
          <TypographyH2 className="mb-4">eGames</TypographyH2>

          <DataTable
            columns={eGamesColumns}
            data={eGamesData}
            columnWidths={["250px", "250px", "250px", "250px", "250px"]}
          />
        </div> */}

        {/* SportsBetting */}

        {/* <div className="mb-10">
          <TypographyH2 className="mb-4">Sports-Betting</TypographyH2>

          <DataTable
            columns={sportsbettingColumns}
            data={sportsBettingData}
            columnWidths={["250px", "250px", "250px", "250px", "250px"]}
          />
        </div> */}
      </div>
    </div>
  );
}
