"use client";

import {
  GoldenPartnerBreakdown,
  PartnerBreakdown,
  partnerBreakdownColumnDefs,
} from "@/components/tables/common/partner-breakdown-column-defs";
import { DataTable } from "@/components/tables/data-table";
import {
  TotalCommissionPayoutsBreakdown,
  totalCommissionPayoutsBreakdownColumns,
} from "@/components/tables/superadmin/general/dashboard-columns";
import { Badge } from "@/components/ui/badge";
import { TypographyH2 } from "@/components/ui/typographyh2";
import { TypographyH4 } from "@/components/ui/typographyh4";
import { UserRole } from "@/lib/constants";
import { RootState, useSelector } from "@/redux/store";
import axios from "axios";
import { formatDate } from "date-fns";
import { useParams } from "next/navigation";
import React, { use, useEffect } from "react";

type Props = {};

export default function SettlementDetailsPerUser({}: Props) {
  const { username } = useParams();

  const [user, setUser] = React.useState<any>();

  const [
    eGamesTotalCommissionPayoutsBreakdownData,
    setEGamesTotalCommissionPayoutsBreakdownData,
  ] = React.useState<TotalCommissionPayoutsBreakdown[]>([]);
  const [
    sportsBettingTotalCommissionPayoutsBreakdownData,
    setSportsBettingTotalCommissionPayoutsBreakdownData,
  ] = React.useState<TotalCommissionPayoutsBreakdown[]>([]);

  const [platinumPartnerBreakdownData, setPlatinumPartnerBreakdownData] =
    React.useState<PartnerBreakdown[]>([]);

  const [goldPartnerBreakdownData, setGoldPartnerBreakdownData] =
    React.useState<GoldenPartnerBreakdown[]>([]);

  const [platinumPartnerTotal, setPlatinumPartnerTotal] = React.useState(0);
  const [goldPartnerTotal, setGoldPartnerTotal] = React.useState(0);

  const { role } = useSelector((state: RootState) => state.authReducer);

  const [payoutsDateRange, setPayoutsDateRange] = React.useState({
    from: "",
    to: "",
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTitle = () => {
    if (role === "superadmin") return "Operator Name";
    if (role === "operator") return "Platinum Name";
    if (role === "platinum") return "Gold Name";
    // if (role === "user") return "User";
    return "Unknown Role";
  };

  const fetchUserDetails = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/username/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Error fetching user details:", res.statusText);
      return;
    }

    const data = await res.json();

    console.log("Fetched user details:", data.data);

    if (data.code === "1014") {
      setUser(data.data.user);
    }

    return data.data.user;
  };

  useEffect(() => {
    fetchUserDetails().then((user) => {
      console.log(user, "==================");
      fetchCommissionPayoutReport(user);
      fetchPartnerBreakdownReport(user);
    });
  }, [username]);

  const fetchCommissionPayoutReport = async (user) => {
    try {
      const accessToken = localStorage.getItem("token");

      // Fetch data from the API or perform any other async operation
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/payout-report?userId=${user?.id}`,

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
          to: formatDate(end),
        });
      }

      setEGamesTotalCommissionPayoutsBreakdownData(
        data.data?.categories["E-GAMES"]
      );
      setSportsBettingTotalCommissionPayoutsBreakdownData(
        data.data?.categories["SPORTS BETTING"]
      );
      // return;
      // }
    } catch (error) {
      console.error("Error fetching commission overview data:", error);
    }
  };

  const fetchPartnerBreakdownReport = async (user) => {
    try {
      console.log({ user });

      const accessToken = localStorage.getItem("token");

      // Fetch data from the API or perform any other async operation
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/breakdown?id=${user?.id}`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data; // Use response.data instead of response.json()
      console.log(
        "Fetched commission overview data:_______________________",
        data
      );

      const platinumData = data.data?.data?.platinum.filter(
        (item) => item.name !== "PLATINUM PARTNER TOTAL"
      );

      const goldData = data.data?.data?.gold.filter(
        (item) => item.name !== "GOLD PARTNER TOTAL"
      );

      setPlatinumPartnerBreakdownData(platinumData);
      setGoldPartnerBreakdownData(goldData);

      const platinumPartnerTotal = data.data?.data?.platinum.find(
        (item) => item.isPlatinumTotal === true
      )?.totalNetCommission;

      console.log(
        "Fetched platinum partner total:_______________________",
        platinumPartnerTotal
      );

      const goldPartnerTotal = data.data?.data?.gold.find(
        (item) => item.isGoldTotal === true
      )?.totalNetCommission;

      console.log(
        "Fetched gold partner total:_______________________",
        goldPartnerTotal
      );

      setPlatinumPartnerTotal(platinumPartnerTotal);
      setGoldPartnerTotal(goldPartnerTotal);

      // setEGamesTotalCommissionPayoutsBreakdownData(
      //   data.data?.categories["E-GAMES"]
      // );
      // setSportsBettingTotalCommissionPayoutsBreakdownData(
      //   data.data?.categories["SPORTS BETTING"]
      // );
      // return;
      // }
    } catch (error) {
      console.error("Error fetching commission overview data:", error);
    }
  };

  //   useEffect(() => {
  //     // fetchUserDetails();

  //   }, [username]);

  return (
    <div>
      <div className="mb-4">
        <TypographyH2 className="flex items-center gap-2">
          {getTitle()}{" "}
          <TypographyH4 className="text-gray-700 font-normal text-sm">
            {user?.firstName + " " + user?.lastName}
          </TypographyH4>
        </TypographyH2>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h6 className=" font-bold text-sm">BREAKDOWN PER GAME TYPE</h6>
          <Badge variant="outline" className="text-xs">
            {payoutsDateRange.from} - {payoutsDateRange.to}
          </Badge>
        </div>
        <div className="mb-4 mt-4">
          <h6 className=" font-bold text-sm">E-Games</h6>
          <DataTable
            columns={totalCommissionPayoutsBreakdownColumns}
            data={eGamesTotalCommissionPayoutsBreakdownData}
          />
        </div>
        <div className="mb-4 mt-4">
          <h6 className=" font-bold text-sm">Sports Betting</h6>
          <DataTable
            columns={totalCommissionPayoutsBreakdownColumns}
            data={sportsBettingTotalCommissionPayoutsBreakdownData}
          />
        </div>
      </div>
      {role !== UserRole.PLATINUM ? (
        <>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h6 className=" font-bold text-sm">BREAKDOWN PER PARTNER</h6>
              <Badge variant="outline" className="text-xs">
                {payoutsDateRange.from} - {payoutsDateRange.to}
              </Badge>
            </div>
          </div>
          <div className="mb-8 mt-4">
            <h6 className=" font-bold text-sm">PLATINUM PARTNERS</h6>
            <DataTable
              columns={partnerBreakdownColumnDefs}
              data={platinumPartnerBreakdownData}
            />
            <h6 className="font-medium">
              PLATINUM PARTNER TOTAL: ₱{platinumPartnerTotal}
            </h6>
          </div>
          <div className="mb-4 mt-4">
            <h6 className=" font-bold text-sm">GOLD PARTNERS</h6>
            <DataTable
              columns={partnerBreakdownColumnDefs}
              data={goldPartnerBreakdownData}
            />
            {/* <h6>PLATINUM PARTNER TOTAL: ${platinumPartnerTotal}</h6> */}
            <h6 className="font-medium">
              GOLD PARTNER TOTAL: ₱{goldPartnerTotal}
            </h6>
          </div>{" "}
        </>
      ) : null}
    </div>
  );
}
