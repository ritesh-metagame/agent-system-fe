import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pages, Paths, UserRole } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSidebarMenusBasedOnRole(role: UserRole) {
  return {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "General",
        url: "#",
        items: [
          {
            title: Pages.DASHBOARD,
            url: Paths.DASHBOARD,
          },

          //v2

          ...(role == UserRole.SUPER_ADMIN
            ? [
                {
                  title: Pages.CREATE_SITE,
                  url: Paths.CREATE_SITE,
                  isActive: true,
                },
                {
                  title: "Manage Sites",
                  url: Paths.MANAGE_SITES,
                },
                {
                  title: "All Users",
                  url: Paths.ALL_USERS,
                },
              ]
            : []),

          //v2 ends
        ],
      },
      {
        title: "Network",
        url: "#",
        items: [
          ...(role !== UserRole.GOLD
            ? [
                {
                  title:
                    role == UserRole.SUPER_ADMIN
                      ? "Create Operator Account"
                      : role == UserRole.PLATINUM
                      ? "Create Gold Account"
                      : role == UserRole.OPERATOR
                      ? "Create Platinum Account"
                      : "Create Account",
                  url: Paths.CREATE_OPERATOR_ACCOUNT,
                },
                // // v2 starts
              ]
            : []),
          // ...(role !== UserRole.SUPER_ADMIN
          //   ? [
          //       {
          //         title: "Manage Commission",
          //         url: Paths.MANAGE_COMMISSION,
          //       },
          //     ]
          //   : []),
          //v2 ends
          ...(role !== UserRole.GOLD
            ? [
                {
                  title: Pages.PARTNER_MANAGEMENT,
                  url: Paths.PARTNER_MANAGEMENT,
                  isActive: true,
                },
                {
                  title: Pages.APPROVE_AGENTS,
                  url: Paths.APPROVE_AGENTS,
                },
              ]
            : [
                {
                  title: Pages.PLAYER_MANAGEMENT,
                  url: Paths.PLAYER_MANAGEMENT,
                },
              ]),
        ],
      },
      // {
      //   title: "Commission Release",
      //   url: "#",
      //   items: [
      //     {
      //       title: Pages.COMMISSION_RECENT_CUTOFF,
      //       url: Paths.COMMISSION_RECENT_CUTOFF,
      //     },
      //     {
      //       title: Pages.HISTORICAL_CUTOFFS,
      //       url: Paths.HISTORICAL_CUTOFFS,
      //     },
      //   ],
      // },
      // {
      //   title: "Download Reports",
      //   url: "#",
      //   items: [
      //     {
      //       title: Pages.TRANSACTIONS,
      //       url: Paths.TRANSACTIONS,
      //     },
      //     {
      //       title: Pages.COMMISSIONS,
      //       url: Paths.COMMISSIONS,
      //     },
      //     {
      //       title: Pages.SETTLEMENT_HISTORY,
      //       url: Paths.SETTLEMENT_HISTORY,
      //     },
      //   ],
      // },
    ],
  };
}
