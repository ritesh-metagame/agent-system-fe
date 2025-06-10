"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/constants";

// Define the shape of the data for the table.
export type SettlementReportData = {
	id: number;
	fromDate: string;
	toDate: string;
	status: string;
	action: string;
	// downlineName: string;
};

// Column definitions for the Reports List table
export const settlementListColumns: ColumnDef<SettlementReportData>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "fromDate",
		header: "FROM DATE",
	},
	{
		accessorKey: "toDate",
		header: "TO DATE",
	},
	{
		accessorKey: "downlineName",
		header: () => {
			const role = localStorage.getItem("role");

			if (role === UserRole.SUPER_ADMIN) {
				return "OPERATOR NAME";
			} else if (role === UserRole.OPERATOR) {
				return "PLATINUM NAME";
			} else if (role === UserRole.PLATINUM) {
				return "GOLDEN NAME";
			}
		},
	},
	{
		accessorKey: "status",
		header: "STATUS",
	},
	// {
	//   accessorKey: "action",
	//   header: "ACTION",
	//   cell: ({ row }) => (
	//     // <Button
	//     //   className="bg-[#5D94B4] text-white"
	//     //   onClick={() => handleDownload(row.original)}
	//     // >
	//     //   DOWNLOAD
	//     // </Button>
	//   ),
	// },
];

// Function to handle download action
const handleDownload = async (rowData: any) => {
	const accessToken = localStorage.getItem("token");

	console.log("Row data for download:", rowData);
	const downlineId = rowData._metadata?.downlineId;
	const fromDateISO = rowData._metadata?.fromDateISO;
	const toDateISO = rowData._metadata?.toDateISO;

	if (!downlineId) {
		console.error("Downline ID not found");
		return;
	}

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/user/download-report`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					downlineId,
					fromDateISO,
					toDateISO,
				}),
			},
		);

		console.log("Download response------------------:", response);

		if (!response.ok) {
			throw new Error("Failed to download CSV");
		}

		const blob = await response.blob();

		// Create a temporary URL and trigger download
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `commission-report-${downlineId}.xlsx`; // correct extension
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error downloading file:", error);
	}
};
