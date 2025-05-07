"use client"

import { approvalListColumnDefs } from '@/components/tables/common/approve-partners-column-defs'
import { DataTable } from '@/components/tables/data-table'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {}

export default function ApprovePartnersPage({ }: Props) {

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string

    const [approvalList, setApprovalList] = React.useState<any[]>([])

    const fetchApprovalList = async () => {
        const res = await fetch(`${BASE_URL}/user/partner/approval-list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await res.json();

        if (res.ok) {
            console.log("Approval List: ", data);
            if (data.code !== "1014") {
                toast.error(data.message || "Failed to fetch approval list.");
            } else {
                setApprovalList(data.data);
                toast.success(data.message);
                // Handle the approval list data here, e.g., set it to state or pass it to a component
                // setApprovalList(data.approvalList);
            }
        } else {
            console.error("Error fetching approval list: ", data.message);
        }
    }
    
    useEffect(() => {

        fetchApprovalList();
    }, [])

  return (
      <div>
          <DataTable
                columns={approvalListColumnDefs} // Pass the column definitions
                data={approvalList} // Pass the fetched
          />
    </div>
  )
}