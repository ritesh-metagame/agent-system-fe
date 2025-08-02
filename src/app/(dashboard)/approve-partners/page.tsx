import ApprovePartnersPage from "@/components/screens/common/approve-partners-page";
import KYCVerification from "@/components/tables/common/kyc-verification";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographyH2 } from "@/components/ui/typographyh2";
import React from "react";

type Props = {};

export default async function VerifyKycPage({}: Props) {
  return (
    <div>
      <TypographyH2 className="">Approve Partners</TypographyH2>

      <ApprovePartnersPage />

    </div>
  );
}
