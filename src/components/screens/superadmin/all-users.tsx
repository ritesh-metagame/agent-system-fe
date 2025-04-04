"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typographyh2";
import { DataTable } from "@/components/tables/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userTableColumns } from "@/components/tables/superadmin/user/user-table";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL
          }/user/all?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Error fetching users:", res.statusText);
          return;
        }

        const data = await res.json();
        console.log("Users------:", data.data);

        setUsers(data.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [startDate, endDate]); // Refetch when dates change

  return (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <TypographyH2 className="text-xl font-bold">
          User Management
        </TypographyH2>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded-md"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded-md"
        />
        <Button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
        >
          {" "}
          Clear
        </Button>
      </div>

      <DataTable
        columnWidths={["180px", "180px", "180px", "180px", "180px", "180px"]}
        columns={userTableColumns}
        data={users}
      />
    </div>
  );
}
