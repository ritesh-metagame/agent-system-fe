import CreateAccountFormWithCommissionPeriod from "@/components/create-account-form";
import CreateAccountForm from "@/components/create-account-form";
import React from "react";

type Props = {};

export default function CreateGoldenAccount({}: Props) {
  return (
    <div>
      <CreateAccountFormWithCommissionPeriod />

      {/* <p>tesxt</p> */}
    </div>
  );
}
