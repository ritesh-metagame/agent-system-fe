import RoleBasedContent from "@/components/role-based-content";
import { Pages } from "@/lib/constants";
import React from "react";

type Props = {};

export default function SettledCommissionsPage({}: Props) {
  return <RoleBasedContent page={Pages.SETTLEMENT_HISTORY} />;
}
