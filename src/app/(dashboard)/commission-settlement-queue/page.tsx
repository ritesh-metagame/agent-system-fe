import RoleBasedContent from "@/components/role-based-content";
import { Pages } from "@/lib/constants";
import React from "react";

type Props = {};

export default function CommissionSettlementQueuePage({}: Props) {
  return <RoleBasedContent page={Pages.SETTLEMENT_QUEUE} />;
}
