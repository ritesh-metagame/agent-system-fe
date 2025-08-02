"use client";

import {
    GoldenPartnerBreakdown,
    PartnerBreakdown,
    partnerBreakdownColumnDefs,
} from "@/components/tables/common/partner-breakdown-column-defs";
import {DataTable} from "@/components/tables/data-table";
import {
    LicenseCommissionBreakdown,
    licenseCommissionBreakdownColumns,
    PaymentGatewayFees,
    paymentGatewayFeesColumns,
    TotalCommissionPayoutsBreakdown1,
    // totalCommissionPayoutsBreakdownColumns,
    totalCommissionPayoutsBreakdownColumns1,
} from "@/components/tables/superadmin/general/dashboard-columns";
import {Badge} from "@/components/ui/badge";
import {TypographyH2} from "@/components/ui/typographyh2";
import {TypographyH4} from "@/components/ui/typographyh4";
import {UserRole} from "@/lib/constants";
import {RootState, useSelector} from "@/redux/store";
import axios from "axios";
import {formatDate} from "date-fns";
import {useParams} from "next/navigation";
import React, {use, useEffect} from "react";

type Props = {};

export default function SettlementDetailsPerUser({}: Props) {
    const {username} = useParams();

    const [user, setUser] = React.useState<any>();

    const [
        eGamesTotalCommissionPayoutsBreakdownData,
        setEGamesTotalCommissionPayoutsBreakdownData,
    ] = React.useState<TotalCommissionPayoutsBreakdown1[]>([]);
    const [
        sportsBettingTotalCommissionPayoutsBreakdownData,
        setSportsBettingTotalCommissionPayoutsBreakdownData,
    ] = React.useState<TotalCommissionPayoutsBreakdown1[]>([]);

    const [platinumPartnerBreakdownData, setPlatinumPartnerBreakdownData] =
        React.useState<PartnerBreakdown[]>([]);

    const [goldPartnerBreakdownData, setGoldPartnerBreakdownData] =
        React.useState<GoldenPartnerBreakdown[]>([]);

    const [platinumPartnerTotal, setPlatinumPartnerTotal] = React.useState(0);
    const [goldPartnerTotal, setGoldPartnerTotal] = React.useState(0);

    const {role} = useSelector((state: RootState) => state.authReducer);

    const [payoutsDateRange, setPayoutsDateRange] = React.useState({
        from: "",
        to: "",
    });

    const [paymentGatewayFeesData, setPaymentGatewayFeesData] = React.useState<
        PaymentGatewayFees[]
    >([]);

    const [eGamesLicenseBreakdownData, setEGamesLicenseBreakdownData] =
        React.useState<LicenseCommissionBreakdown[]>([]);
    const [
        sportsBettingLicenseBreakdownData,
        setSportsBettingLicenseBreakdownData,
    ] = React.useState<LicenseCommissionBreakdown[]>([]);
    const [
        specialityGamesToteLicenseBreakdownData,
        setSpecialityGamesToteLicenseBreakdownData,
    ] = React.useState<LicenseCommissionBreakdown[]>([]);
    const [
        specialityGamesRNGLicenseBreakdownData,
        setSpecialityGamesRNGLicenseBreakdownData,
    ] = React.useState<LicenseCommissionBreakdown[]>([]);

    const [eGamesCommissionRate, setEGamesCommissionRate] =
        React.useState<number>(0);
    const [sportsBettingCommissionRate, setSportsBettingCommissionRate] =
        React.useState<number>(0);
    const [
        specialityGamesToteCommissionRate,
        setSpecialityGamesToteCommissionRate,
    ] = React.useState<number>(0);

    const [
        specialityGamesRNGCommissionRate,
        setSpecialityGamesRNGCommissionRate,
    ] = React.useState<number>(0);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getTitle = () => {
        if (role === UserRole.SUPER_ADMIN) return "Operator Name";
        if (role === UserRole.OPERATOR) return "Platinum Name";
        if (role === UserRole.PLATINUM) return "Golden Name";
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
            fetchPaymentGatewayFeesData(user);
            fetchLicenseBreakdownData(user);
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
                const {start, end} = data.data.periodInfo.pendingPeriod;
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
            console.log({user});

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
            setPlatinumPartnerBreakdownData(platinumData);

            const goldData = data.data?.data?.golden.filter(
                (item) => item.name !== "GOLDEN PARTNER TOTAL"
            );

            setGoldPartnerBreakdownData(goldData);

            const platinumPartnerTotal = data.data?.data?.platinum.find(
                (item) => item.isPlatinumTotal === true
            )?.totalNetCommission;

            console.log(
                "Fetched platinum partner total:_______________________",
                platinumPartnerTotal
            );
            setPlatinumPartnerTotal(platinumPartnerTotal);

            const goldPartnerTotal = data.data?.data?.gold.find(
                (item) => item.isGoldTotal === true
            )?.totalNetCommission;

            console.log(
                "Fetched gold partner total:_______________________",
                goldPartnerTotal
            );

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

    const fetchPaymentGatewayFeesData = async (user) => {
        try {
            const accessToken = localStorage.getItem("token");

            // Fetch data from the API or perform any other async operation
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/commission/payment-gateway-fees`,
                {
                    params: {
                        userId: user?.id,
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = response.data; // Use response.data instead of response.json()
            console.log("Fetched all time top performers data:", data);

            if (data.code == "2005") {
                setPaymentGatewayFeesData(data.data?.fees);
                return;
            }
        } catch (error) {
            console.error("Error fetching all time top performers data:", error);
        }
    };

    const fetchLicenseBreakdownData = async (user) => {
        try {
            const accessToken = localStorage.getItem("token");

            // Fetch data from the API or perform any other async operation
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/commission/license-breakdown?userId=${user?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = response.data; // Use response.data instead of response.json()
            console.log("Fetched license breakdown data:", data);

            if (data.code === "2010") {
                data.data.data.forEach((d) => {
                    switch (d.license) {
                        case "E-Games":
                            setEGamesCommissionRate(
                                parseFloat(
                                    d.fields.find((field) => field.label === "Commission Rate")
                                        ?.value || "0"
                                )
                            );
                            setEGamesLicenseBreakdownData(
                                d.fields.filter((field) => field.label !== "Commission Rate")
                            );
                            break;
                        case "Sports Betting":
                            setSportsBettingCommissionRate(
                                parseFloat(
                                    d.fields.find((field) => field.label === "Commission Rate")
                                        ?.value || "0"
                                )
                            );
                            setSportsBettingLicenseBreakdownData(
                                d.fields.filter((field) => field.label !== "Commission Rate")
                            );
                            break;
                        case "Speciality Games - Tote":
                            setSpecialityGamesToteCommissionRate(
                                parseFloat(
                                    d.fields.find((field) => field.label === "Commission Rate")
                                        ?.value || "0"
                                )
                            );
                            setSpecialityGamesToteLicenseBreakdownData(
                                d.fields.filter((field) => field.label !== "Commission Rate")
                            );
                            break;
                        case "Speciality Games - RNG":
                            setSpecialityGamesRNGCommissionRate(
                                parseFloat(
                                    d.fields.find((field) => field.label === "Commission Rate")
                                        ?.value || "0"
                                )
                            );
                            setSpecialityGamesRNGLicenseBreakdownData(
                                d.fields.filter((field) => field.label !== "Commission Rate")
                            );
                            break;
                        default:
                            break;
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching license breakdown data:", error);
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
            {/*<div className="mb-4">*/}
            {/*  <div className="flex items-center gap-2 mb-2">*/}
            {/*    <TypographyH2 className="">Payment Gateway Fees</TypographyH2>*/}
            {/*    /!* <Badge variant="outline" className="text-xs">*/}
            {/*          {payoutsDateRange.from} - {payoutsDateRange.to}*/}
            {/*        </Badge> *!/*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div className="mb-4">*/}
            {/*  <DataTable*/}
            {/*    columns={paymentGatewayFeesColumns}*/}
            {/*    data={paymentGatewayFeesData}*/}
            {/*    columnWidths={["250px", "250px", "250px", "250px", "150px"]}*/}
            {/*    tooltips={{*/}
            {/*      pendingCommission: "As of Available cutoff period",*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</div>*/}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <TypographyH2 className="">Breakdown Per License</TypographyH2>
                    {/* <Badge variant="outline" className="text-xs">
                      {payoutsDateRange.from} - {payoutsDateRange.to}
                    </Badge> */}
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <TypographyH4 className="mb-2">E-Games</TypographyH4>
                    <Badge variant="outline" className="text-xs">
                        Commission Rate: {eGamesCommissionRate} %
                    </Badge>
                </div>
                <DataTable
                    columns={licenseCommissionBreakdownColumns}
                    data={eGamesLicenseBreakdownData}
                    columnWidths={["250px", "250px", "250px", "250px", "150px"]}
                    tooltips={{
                        pendingCommission: "As of Available cutoff period",
                    }}
                />
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <TypographyH4 className="mb-2">Sports Betting</TypographyH4>
                    <Badge variant="outline" className="text-xs">
                        Commission Rate: {sportsBettingCommissionRate} %
                    </Badge>
                </div>
                <DataTable
                    columns={licenseCommissionBreakdownColumns}
                    data={sportsBettingLicenseBreakdownData}
                    columnWidths={["250px", "250px", "250px", "250px", "150px"]}
                    tooltips={{
                        pendingCommission: "As of Available cutoff period",
                    }}
                />
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <TypographyH4 className="mb-2">Specialty Games - Tote</TypographyH4>
                    <Badge variant="outline" className="text-xs">
                        Commission Rate: {specialityGamesToteCommissionRate} %
                    </Badge>
                </div>
                <DataTable
                    columns={licenseCommissionBreakdownColumns}
                    data={specialityGamesToteLicenseBreakdownData}
                    columnWidths={["250px", "250px", "250px", "250px", "150px"]}
                    tooltips={{
                        pendingCommission: "As of Available cutoff period",
                    }}
                />
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <TypographyH4 className="mb-2">Specialty Games - RNG</TypographyH4>
                    <Badge variant="outline" className="text-xs">
                        Commission Rate: {specialityGamesRNGCommissionRate} %
                    </Badge>
                </div>
                <DataTable
                    columns={licenseCommissionBreakdownColumns}
                    data={specialityGamesRNGLicenseBreakdownData}
                    columnWidths={["250px", "250px", "250px", "250px", "150px"]}
                    tooltips={{
                        pendingCommission: "As of Available cutoff period",
                    }}
                />
            </div>
            {/* <div>
        <div className="flex items-center gap-2 mb-2">
          <h6 className=" font-bold text-sm">BREAKDOWN PER GAME TYPE</h6>
          <Badge variant="outline" className="text-xs">
            {payoutsDateRange.from} - {payoutsDateRange.to}
          </Badge>
        </div>
        <div className="mb-4 mt-4">
          <h6 className=" font-bold text-sm">E-Games</h6>
          <DataTable
            columns={totalCommissionPayoutsBreakdownColumns1}
            data={eGamesTotalCommissionPayoutsBreakdownData}
          />
        </div>
        <div className="mb-4 mt-4">
          <h6 className=" font-bold text-sm">Sports Betting</h6>
          <DataTable
            columns={totalCommissionPayoutsBreakdownColumns1}
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
            <h6 className="font-medium">
              GOLD PARTNER TOTAL: ₱{goldPartnerTotal}
            </h6>
          </div> */}
        </div>
    );
}
