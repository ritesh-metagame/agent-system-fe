"use client";

import React, { useEffect } from "react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { settlementListColumns } from "../common-column-defs/common-settlement-history-columns";

import type { SettlementReportData } from "../common-column-defs/common-settlement-history-columns";

import { TypographyH2 } from "@/components/ui/typographyh2";
// import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/tables/data-table";
import Data from "./common-settlement-history.json";
import axios from "axios";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Dummy data for SettlementReportData
const SettlementReportData: SettlementReportData[] = [];

function DatePicker({ placeholder }: { placeholder: string }) {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-48 justify-between truncate text-ellipsis px-3"
        >
          <span className={date ? "text-black" : "text-gray-500"}>
            {date ? format(date, "PPP") : placeholder}
          </span>
          <CalendarIcon className="ml-2 flex-shrink-0 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}

type Props = {};

export default function SettlementHistory({}: Props) {
  const [dateRange, setDateRange] = React.useState<{
    from: null | Date;
    to: null | Date;
  }>({
    from: null,
    to: null,
  });

  const [commissionsData, setCommissionsData] = React.useState<
    SettlementReportData[]
  >([]);

  console.log("commissionsData", commissionsData);

  const [btnDisabled, setBtnDisabled] = React.useState<boolean>(true);

  const [partners, setPartners] = React.useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = React.useState<string>("");

  const fetchSettledCommissions = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/settled-reports`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            ...(dateRange.from && dateRange.to
              ? {
                  startDate: new Date(dateRange.from)
                    .toISOString()
                    .split("T")[0],
                  endDate: new Date(dateRange.to).toISOString().split("T")[0],
                }
              : selectedPartner && selectedPartner !== "all"
              ? {
                  downlineId: selectedPartner,
                }
              : {}),
          },
        }
      );

      if (data.code === "2050") {
        setCommissionsData(data.data.reports);
      } else {
        toast(data.message || "Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("Error fetching player transactions:", error);
    }
  };

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/partners`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.code === "1014") {
        setPartners(data.data);
      } else {
        console.error(data.message || "Failed to fetch partners.");
        toast(data.message || "Failed to fetch partners.");
      }

      // if (data.code === "T214") {
      //   setCommissionsData(data.data);
      // } else {
      //   console.error(data.message || "Failed to fetch transactions.");
      // }
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast("Error fetching partners.");
    }
  };

  useEffect(() => {
    fetchSettledCommissions();
    fetchPartners();
  }, [selectedPartner, dateRange]);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      setBtnDisabled(false);
    }
  }, [dateRange.from, dateRange.to]);

  useEffect(() => {
    if (selectedPartner !== "all") {
      setBtnDisabled(false);
    }
  }, [selectedPartner]);

  return (
    <div>
      <div className="container mb-10">
        <div className="flex gap-2 mb-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select defaultValue="all" onValueChange={setSelectedPartner}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent className="w-48">
              <SelectItem value="all">ALL</SelectItem>
              {partners?.map((partner) => (
                <SelectItem
                  key={partner.id}
                  value={partner.id}
                  onClick={() => {
                    setSelectedPartner(partner.id);
                    setBtnDisabled(false);
                  }}
                >
                  {partner.firstName} {partner.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button disabled={btnDisabled} onClick={fetchSettledCommissions}>
            Search
          </Button>
        </div>
        <div className="mb-10">
          <TypographyH2 className="mb-4">Reports List</TypographyH2>

          {/* <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 ml-2">
                CUTOFF PERIOD START
              </label>
              <DatePicker placeholder="DD/MM/YY" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 ml-2">
                CUTOFF PERIOD END
              </label>
              <DatePicker placeholder="DD/MM/YY" />
            </div>
            <Button className="mt-6 bg-[#29467C] text-white hover:bg-[#1f355f]">
              Search
            </Button>
          </div> */}

          <DataTable
            columns={settlementListColumns}
            data={commissionsData}
            columnWidths={["150px", "150px", "150px", "150px", "150px"]}
          />
        </div>
      </div>
    </div>
  );
}
