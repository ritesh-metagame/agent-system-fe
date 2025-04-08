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

  console.log("eGamesData:", eGamesData);
  console.log("sportsBettingData:", sportsBettingData);

  const token = localStorage.getItem("token");
  console.log("token:", token);

  // useEffect(() => {
  //   const fetchTransactions = async (category: string, agent: string) => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8080/api/v1/user/transactionsByCategory",
  //         {
  //           params: { categoryName: category, agent },
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Replace `yourToken` with the actual token variable
  //           },
  //         }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error(`Error fetching ${category} transactions:`, error);
  //       return [];
  //     }
  //   };

  //   const loadData = async () => {
  //     const eGames = await fetchTransactions("eGames", userRole);
  //     const sports = await fetchTransactions("Sports-Betting", userRole);

  //     setEGamesData(eGames);
  //     setSportsBettingData(sports);
  //   };

  //   loadData();
  // }, []);

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

        return response.data.data;
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

      const eGamesSummary = getSummary(eGames);
      const sportsSummary = getSummary(sports);

      setEGamesData(eGamesSummary);
      setSportsBettingData(sportsSummary);
    };

    loadData();
  }, [token, userRole]);

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
        <div className="mb-10">
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
        </div>

        <div className="mb-10">
          <TypographyH2 className="mb-4">Network Overview</TypographyH2>

          <DataTable
            columns={networkOverviewColumns}
            data={networkOverviewData}
            columnWidths={["250px", "250px", "250px", "250px", "250px"]}
          />
        </div>

        {/* summary */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <TypographyH2 className="mb-4">
              Summary: E-Games & sportsBetting
            </TypographyH2>
            <p className="text-md font-medium text-gray-700">
              Cutoff Period: Feb 1 - Feb 15, 2025
            </p>
          </div>

          <DataTable
            columns={overallSummaryColumns}
            data={[]}
            columnWidths={["250px", "250px", "250px", "250px"]}
          />
        </div>

        {/* egames */}

        <div className="mb-10">
          <TypographyH2 className="mb-4">E-GAMES</TypographyH2>

          <DataTable
            columns={eGamesColumns}
            data={eGamesData}
            columnWidths={["250px", "250px", "250px", "250px", "250px"]}
          />
        </div>

        {/* SportsBetting */}

        <div className="mb-10">
          <TypographyH2 className="mb-4">Sports-Betting</TypographyH2>

          <DataTable
            columns={sportsbettingColumns}
            data={sportsBettingData}
            columnWidths={["250px", "250px", "250px", "250px", "250px"]}
          />
        </div>
      </div>
    </div>
  );
}
