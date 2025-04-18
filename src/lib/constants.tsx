import CreateAccountForm from "@/components/create-account-form";
import {
  OperatorDashboard,
  PlatinumDashboard,
  SuperAdminCommissionRecentCutoff,
  SuperAdminCreateAccountForm,
  SuperAdminDashboard,
  SuperAdminPartnerManagement,
  PlatinumPartnerManagement,
  PlatinumCommissionRecentCutoff,
  PlatinumHistoricalCutoff,
  PlatinumCommissions,
  PlatinumTransactions,
  PlatinumSettlementHistory,
  CreateGoldenAccount,
  GoldenCommissions,
  GoldenTransactions,
  GoldenSettlementHistory,
  SuperAdminSettlementHistory,
  SuperAdminCommissions,
  SuperAdminTransactions,
  OperatorCommissions,
  OperatorSettlementHistory,
  OperatorTransactions,
  GoldenDashboard,
  GoldenCommissionRecentCutoff,
  GoldenCreateOperatorAccount,
  GoldenPartnerManagement,
  SuperAdminAllCommissionCutoffs,
  GoldenAllCommissionCutoff,
  OperatorAllCommissionCutoff,
  SuperAdminCreateSite,
  SuperAdminManageSites,
  OperatorCreatePlatinumAccount,
  AllUser,
  SuperAdminCommissionSettlementQueue,
  OperatorCommissionSettlementQueue,
} from "@/components/screens";
import CommissionRecentCutsOff from "@/components/screens/operator/commission-recent-cutoff";
import PartnerManagement from "@/components/screens/operator/partner-management";
import SuperAdminUpdateAccountForm from "@/components/superadmin-update-account-form";
import UpdateAccountFormWithCommissionPeriod from "@/components/update-account-form";
// import AllCommissionCutoffs from "@/components/screens/superadmin/all-commission-cutoffs";
// import { OperatorDashboard } from "@/components/screens";
import { JSX } from "react";

export type Link = {
  title: Pages;
  url: Paths;
  isActive?: boolean;
};

export type LinkCategory = {
  category: string;
  links: Link[];
};

export type RoleWiseLinkMap = {
  [key in UserRole]?: LinkCategory[];
};

export enum UserRole {
  SUPER_ADMIN = "superadmin",
  OPERATOR = "operator",
  PLATINUM = "platinum",
  GOLD = "gold",
  DEFAULT = "default",
}

export enum Pages {
  DASHBOARD = "Dashboard",
  CREATE_OPERATOR_ACCOUNT = "Create Account",
  PARTNER_MANAGEMENT = "Partner Management",
  COMMISSION_RECENT_CUTOFF = "Commission Recent Cutoff",
  HISTORICAL_CUTOFFS = "All Commission Cutoffs",
  TRANSACTIONS = "Transactions",
  COMMISSIONS = "Commissions",
  SETTLEMENT_HISTORY = "Settlement History",
  SETTLEMENT_QUEUE = "Commission Settlement Queue",
  SETTLED_COMMISSIONS = "Settled Commissions",
  APPROVE_AGENTS = "Approve Partners",
  CREATE_SITE = "Create Site",
  MANAGE_SITES = "Manage Sites",
  MANAGE_COMMISSION = "Manage Commission",
  ALL_USERS = "All Users",
  PLAYER_TRANSACTIONS = "Player Transactions",
  PROFILE = "Profile",
  UPDATE_PARTNER = "Update Partner",
  SETTLEMENT_DETAILS = "Settlement Details",
  SETTLEMENT_TRANSACTIONS = "Settlement Transactions",
}

export enum Paths {
  DASHBOARD = "/dashboard",
  CREATE_OPERATOR_ACCOUNT = "/create-account",
  PARTNER_MANAGEMENT = "/partner-management",
  COMMISSION_RECENT_CUTOFF = "/commission-recent-cutoff",
  HISTORICAL_CUTOFFS = "/all-commission-cutoffs",
  TRANSACTIONS = "/transactions",
  COMMISSIONS = "/commissions",
  SETTLEMENT_HISTORY = "/settlement-history",
  SETTLEMENT_QUEUE = "/commission-settlement-queue",
  APPROVE_AGENTS = "/approve-partners",
  CREATE_SITE = "/create-site",
  MANAGE_SITES = "/manage-sites",
  MANAGE_COMMISSION = "/manage-commission",
  SETTLED_COMMISSIONS = "/settled-commissions",
  ALL_USERS = "/all-users",
  PLAYER_TRANSACTIONS = "/player-transactions",
  PROFILE = "/profile",
  UPDATE_PARTNER = "/partner-management/update/:username",
  SETTLEMENT_DETAILS = "/commission-settlement-queue/:username",
  SETTLEMENT_TRANSACTIONS = "/settlement-transactions",
}

export const pagePaths = new Map<Paths, Pages>([
  [Paths.DASHBOARD, Pages.DASHBOARD],
  [Paths.CREATE_OPERATOR_ACCOUNT, Pages.CREATE_OPERATOR_ACCOUNT],
  [Paths.PARTNER_MANAGEMENT, Pages.PARTNER_MANAGEMENT],
  [Paths.COMMISSION_RECENT_CUTOFF, Pages.COMMISSION_RECENT_CUTOFF],
  [Paths.HISTORICAL_CUTOFFS, Pages.HISTORICAL_CUTOFFS],
  [Paths.TRANSACTIONS, Pages.TRANSACTIONS],
  [Paths.APPROVE_AGENTS, Pages.APPROVE_AGENTS],
  [Paths.COMMISSIONS, Pages.COMMISSIONS],
  [Paths.CREATE_SITE, Pages.CREATE_SITE],
  [Paths.MANAGE_SITES, Pages.MANAGE_SITES],
  [Paths.MANAGE_COMMISSION, Pages.MANAGE_COMMISSION],
  [Paths.ALL_USERS, Pages.ALL_USERS],
  [Paths.PLAYER_TRANSACTIONS, Pages.PLAYER_TRANSACTIONS],
  [Paths.SETTLEMENT_HISTORY, Pages.SETTLEMENT_HISTORY],
  [Paths.SETTLEMENT_QUEUE, Pages.SETTLEMENT_QUEUE],
  [Paths.SETTLED_COMMISSIONS, Pages.SETTLED_COMMISSIONS],
  [Paths.SETTLEMENT_TRANSACTIONS, Pages.SETTLEMENT_TRANSACTIONS],
  [Paths.PROFILE, Pages.PROFILE],
  [Paths.UPDATE_PARTNER, Pages.UPDATE_PARTNER],
  [Paths.SETTLEMENT_DETAILS, Pages.SETTLEMENT_DETAILS],
]);

export const roleWiseLinks: RoleWiseLinkMap = {
  [UserRole.SUPER_ADMIN]: [
    {
      category: "GENERAL",
      links: [
        {
          title: Pages.DASHBOARD,
          url: Paths.DASHBOARD,
        },
      ],
    },
    {
      category: "NETWORK",
      links: [
        {
          title: Pages.CREATE_SITE,
          url: Paths.CREATE_SITE,
        },
        {
          title: Pages.MANAGE_SITES,
          url: Paths.MANAGE_SITES,
        },
        {
          title: Pages.ALL_USERS,
          url: Paths.ALL_USERS,
        },
        {
          title: Pages.CREATE_OPERATOR_ACCOUNT,
          url: Paths.CREATE_OPERATOR_ACCOUNT,
        },
        {
          title: Pages.PARTNER_MANAGEMENT,
          url: Paths.PARTNER_MANAGEMENT,
        },
      ],
    },
    {
      category: "COMMISSION RELEASE",
      links: [
        {
          title: Pages.SETTLEMENT_QUEUE,
          url: Paths.SETTLEMENT_QUEUE,
        },
      ],
    },
    // {
    //   category: "DOWNLOAD REPORTS",
    //   links: [
    //     {
    //       title: Pages.PLAYER_TRANSACTIONS,
    //       url: Paths.PLAYER_TRANSACTIONS,
    //     },
    //     {
    //       title: Pages.SETTLED_COMMISSIONS,
    //       url: Paths.SETTLED_COMMISSIONS,
    //     },
    //     {
    //       title: Pages.SETTLEMENT_TRANSACTIONS,
    //       url: Paths.SETTLEMENT_TRANSACTIONS,
    //     },
    //   ],
    // },
  ],

  [UserRole.OPERATOR]: [
    {
      category: "GENERAL",
      links: [
        {
          title: Pages.DASHBOARD,
          url: Paths.DASHBOARD,
        },
      ],
    },
    {
      category: "NETWORK",
      links: [
        {
          title: Pages.CREATE_OPERATOR_ACCOUNT,
          url: Paths.CREATE_OPERATOR_ACCOUNT,
        },
        {
          title: Pages.PARTNER_MANAGEMENT,
          url: Paths.PARTNER_MANAGEMENT,
        },
      ],
    },
    {
      category: "COMMISSION RELEASE",
      links: [
        {
          title: Pages.SETTLEMENT_QUEUE,
          url: Paths.SETTLEMENT_QUEUE,
        },
      ],
    },
    // {
    //   category: "DOWNLOAD REPORTS",
    //   links: [
    //     {
    //       title: Pages.SETTLED_COMMISSIONS,
    //       url: Paths.SETTLED_COMMISSIONS,
    //     },
    //     {
    //       title: Pages.SETTLEMENT_TRANSACTIONS,
    //       url: Paths.SETTLEMENT_TRANSACTIONS,
    //     },
    //   ],
    // },
  ],
  [UserRole.PLATINUM]: [
    {
      category: "GENERAL",
      links: [
        {
          title: Pages.DASHBOARD,
          url: Paths.DASHBOARD,
        },
      ],
    },
    {
      category: "NETWORK",
      links: [
        {
          title: Pages.CREATE_OPERATOR_ACCOUNT,
          url: Paths.CREATE_OPERATOR_ACCOUNT,
        },
        {
          title: Pages.PARTNER_MANAGEMENT,
          url: Paths.PARTNER_MANAGEMENT,
        },
      ],
    },
    {
      category: "COMMISSION RELEASE",
      links: [
        {
          title: Pages.SETTLEMENT_QUEUE,
          url: Paths.SETTLEMENT_QUEUE,
        },
      ],
    },
    // {
    //   category: "DOWNLOAD REPORTS",
    //   links: [
    //     {
    //       title: Pages.SETTLED_COMMISSIONS,
    //       url: Paths.SETTLED_COMMISSIONS,
    //     },
    //     {
    //       title: Pages.SETTLEMENT_TRANSACTIONS,
    //       url: Paths.SETTLEMENT_TRANSACTIONS,
    //     },
    //   ],
    // },
  ],

  [UserRole.GOLD]: [
    {
      category: "GENERAL",
      links: [
        {
          title: Pages.DASHBOARD,
          url: Paths.DASHBOARD,
        },
      ],
    },
    // {
    //   category: "DOWNLOAD REPORTS",
    //   links: [
    //     {
    //       title: Pages.SETTLED_COMMISSIONS,
    //       url: Paths.SETTLED_COMMISSIONS,
    //       isActive: true,
    //     },
    //   ],
    // },
  ],
};

export const users = [
  {
    id: "1",
    username: "superadmin",
    role: UserRole.SUPER_ADMIN,
    password: "password",
  },
  {
    id: "2",
    username: "operator",
    role: UserRole.OPERATOR,
    password: "password",
  },
  {
    id: "3",
    username: "platinum",
    role: UserRole.PLATINUM,
    password: "password",
  },
  {
    id: "4",
    username: "gold",
    role: UserRole.GOLD,
    password: "password",
  },
  {
    id: "5",
    username: "example4",
    role: UserRole.DEFAULT,
    password: "password",
  },
];

export type RolePageMap = {
  [key in UserRole]: {
    [key in Pages]?: () => JSX.Element;
  };
};

export const RolePageComponentMap: RolePageMap = {
  [UserRole.SUPER_ADMIN]: {
    [Pages.DASHBOARD]: () => <SuperAdminDashboard />,
    [Pages.CREATE_SITE]: () => <SuperAdminCreateSite />,
    [Pages.ALL_USERS]: () => <AllUser />,
    [Pages.MANAGE_SITES]: () => <SuperAdminManageSites />,
    [Pages.CREATE_OPERATOR_ACCOUNT]: () => <SuperAdminCreateAccountForm />,
    [Pages.UPDATE_PARTNER]: () => <SuperAdminUpdateAccountForm />,
    [Pages.PARTNER_MANAGEMENT]: () => <SuperAdminPartnerManagement />,
    [Pages.COMMISSION_RECENT_CUTOFF]: () => (
      <SuperAdminCommissionRecentCutoff />
    ),
    [Pages.SETTLEMENT_QUEUE]: () => <SuperAdminCommissionSettlementQueue />,

    [Pages.HISTORICAL_CUTOFFS]: () => <SuperAdminAllCommissionCutoffs />,
    [Pages.TRANSACTIONS]: () => <SuperAdminTransactions />,
    [Pages.COMMISSIONS]: () => <SuperAdminCommissions />,
    [Pages.SETTLEMENT_HISTORY]: () => <SuperAdminSettlementHistory />,
  },
  [UserRole.PLATINUM]: {
    [Pages.DASHBOARD]: () => <PlatinumDashboard />,
    [Pages.CREATE_OPERATOR_ACCOUNT]: () => <CreateGoldenAccount />,
    [Pages.UPDATE_PARTNER]: () => <UpdateAccountFormWithCommissionPeriod />,
    [Pages.PARTNER_MANAGEMENT]: () => <PlatinumPartnerManagement />,
    [Pages.COMMISSION_RECENT_CUTOFF]: () => <PlatinumCommissionRecentCutoff />,
    [Pages.HISTORICAL_CUTOFFS]: () => <PlatinumHistoricalCutoff />,
    [Pages.TRANSACTIONS]: () => <PlatinumTransactions />,
    [Pages.COMMISSIONS]: () => <PlatinumCommissions />,
    [Pages.SETTLEMENT_HISTORY]: () => <PlatinumSettlementHistory />,
    [Pages.SETTLEMENT_QUEUE]: () => <OperatorCommissionSettlementQueue />,
  },

  [UserRole.GOLD]: {
    [Pages.HISTORICAL_CUTOFFS]: () => <GoldenAllCommissionCutoff />,
    [Pages.TRANSACTIONS]: () => <GoldenTransactions />,
    [Pages.COMMISSIONS]: () => <GoldenCommissions />,
    [Pages.SETTLEMENT_HISTORY]: () => <GoldenSettlementHistory />,
    [Pages.DASHBOARD]: () => <GoldenDashboard />,
    [Pages.CREATE_OPERATOR_ACCOUNT]: () => <GoldenCreateOperatorAccount />,
    [Pages.PARTNER_MANAGEMENT]: () => <GoldenPartnerManagement />,
    [Pages.COMMISSION_RECENT_CUTOFF]: () => <GoldenCommissionRecentCutoff />,
    [Pages.PLAYER_TRANSACTIONS]: () => <GoldenPartnerManagement />,
  },
  [UserRole.OPERATOR]: {
    [Pages.DASHBOARD]: () => <OperatorDashboard />,
    [Pages.CREATE_OPERATOR_ACCOUNT]: () => <OperatorCreatePlatinumAccount />,
    [Pages.UPDATE_PARTNER]: () => <UpdateAccountFormWithCommissionPeriod />,
    [Pages.PARTNER_MANAGEMENT]: () => <PartnerManagement />,
    [Pages.COMMISSION_RECENT_CUTOFF]: () => <CommissionRecentCutsOff />,
    [Pages.HISTORICAL_CUTOFFS]: () => <OperatorAllCommissionCutoff />,
    [Pages.SETTLEMENT_QUEUE]: () => <OperatorCommissionSettlementQueue />,

    [Pages.TRANSACTIONS]: () => <OperatorTransactions />,
    [Pages.COMMISSIONS]: () => <OperatorCommissions />,
    [Pages.SETTLEMENT_HISTORY]: () => <OperatorSettlementHistory />,
  },
  [UserRole.DEFAULT]: {
    [Pages.DASHBOARD]: () => <></>,
    [Pages.CREATE_OPERATOR_ACCOUNT]: () => <></>,
    [Pages.PARTNER_MANAGEMENT]: () => <></>,
    [Pages.COMMISSION_RECENT_CUTOFF]: () => <></>,
    [Pages.HISTORICAL_CUTOFFS]: () => <></>,
    [Pages.TRANSACTIONS]: () => <></>,
    [Pages.COMMISSIONS]: () => <></>,
    [Pages.SETTLEMENT_HISTORY]: () => <></>,
  },
};
