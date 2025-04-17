import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Link,
  LinkCategory,
  Pages,
  Paths,
  roleWiseLinks,
  UserRole,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number | string | null | undefined
): string {
  if (value === null || value === undefined || value === "") return "₱0.00";

  const numericValue =
    typeof value === "string" ? parseFloat(value as any) : value;

  if (isNaN(numericValue)) return "₱0.00";

  return `₱${numericValue.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function generateSidebarMenusBasedOnRole(role: UserRole) {
  console.log("role", role);
  return {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: roleWiseLinks[role].map((link: LinkCategory) => ({
      title: link.category,
      url: "#",
      items: link.links.map((l: Link) => ({
        title: l.title,
        url: l.url,
      })),
    })),
  };
}
