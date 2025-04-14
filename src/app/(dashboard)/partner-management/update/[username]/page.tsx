// import { useParams } from "next/navigation";
import RoleBasedContent from "@/components/role-based-content";
import { Pages } from "@/lib/constants";
import React from "react";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UpdatePartner({ params }: Props) {
  // const { username } = await params;

  return <RoleBasedContent page={Pages.UPDATE_PARTNER} />;
}
