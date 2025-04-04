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

export const userTableColumns: ColumnDef<any>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => row.original.user?.username || "N/A",
  },
  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => row.original.role?.name || "N/A",
  },
  {
    accessorKey: "commissions[0].category.name",
    header: "Category",
    cell: ({ row }) => row.original?.category?.name || "N/A",
  },
  {
    accessorKey: "commissionPercentage",
    header: "Commission (%)",
    // cell: ({ row }) =>
    //   row.original.commissions?.[0]?.commissionPercentage
    //     ? `${row.original.commissions[0].commissionPercentage}%`
    //     : "N/A",
  },
  {
    accessorKey: "site.name",
    header: "Site Name",
    cell: ({ row }) => row.original.site?.name || "N/A",
  },
  {
    accessorKey: "commissions[0].site.url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.original.site?.url;
      const maxLength = 30; // Adjust the character limit as needed

      return url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            maxWidth: "200px", // Adjust width as needed
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={url} // Show full URL on hover
        >
          {url.length > maxLength ? `${url.substring(0, maxLength)}...` : url}
        </a>
      ) : (
        "N/A"
      );
    },
  },
];
