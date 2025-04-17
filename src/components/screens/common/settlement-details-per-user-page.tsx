"use client";

import { TotalCommissionPayoutsBreakdown } from "@/components/tables/superadmin/general/dashboard-columns";
import { TypographyH2 } from "@/components/ui/typographyh2";
import { TypographyH4 } from "@/components/ui/typographyh4";
import { RootState, useSelector } from "@/redux/store";
import axios from "axios";
import { formatDate } from "date-fns";
import { useParams } from "next/navigation";
import React, { use, useEffect } from "react";

type Props = {};

export default function SettlementDetailsPerUser({}: Props) {
  const { username } = useParams();

  const [user, setUser] = React.useState<any>(null);
  const [
    eGamesTotalCommissionPayoutsBreakdownData,
    setEGamesTotalCommissionPayoutsBreakdownData,
  ] = React.useState<TotalCommissionPayoutsBreakdown[]>([]);
  const [
    sportsBettingTotalCommissionPayoutsBreakdownData,
    setSportsBettingTotalCommissionPayoutsBreakdownData,
  ] = React.useState<TotalCommissionPayoutsBreakdown[]>([null]);

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
  };

  const fetchCommissionBreakdownData = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      // Fetch data from the API or perform any other async operation
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/total-breakdown`,

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

  useEffect(() => {
    fetchUserDetails();
  }, [username]);

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
        <h6 className=" font-bold text-sm">BREAKDOWN PER GAME TYPE</h6>
      </div>
    </div>
  );
}
