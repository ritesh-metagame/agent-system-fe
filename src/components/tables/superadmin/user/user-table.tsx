import { ColumnDef } from "@tanstack/react-table";

export interface User {
  id: string;
  username: string;
  role?: { id: string; name: string };
  commissions?: {
    commissionPercentage: number;
    category?: { name: string };
    site?: { name: string; url: string };
  }[];
}

export const userTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => row.original.role?.name || "N/A",
  },
  {
    accessorKey: "commissions[0].category.name",
    header: "Category",
    cell: ({ row }) => row.original.commissions?.[0]?.category?.name || "N/A",
  },
  {
    accessorKey: "commissions[0].commissionPercentage",
    header: "Commission(%)",
    cell: ({ row }) =>
      row.original.commissions?.[0]?.commissionPercentage || "N/A",
  },

  {
    accessorKey: "commissions[0].site.name",
    header: "Site",
    cell: ({ row }) => row.original.commissions?.[0]?.site?.name || "N/A",
  },
  {
    accessorKey: "site.url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.original.commissions?.[0]?.site?.url || "N/A"; // Ensure safe access
      const maxLength = 30; // Set desired length
      return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
    },
  },
];
