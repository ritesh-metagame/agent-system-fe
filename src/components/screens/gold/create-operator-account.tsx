// import CreateAccountForm from "@/components/create-account-form";
import CreateAccountFormWithCommissionPeriod from "@/components/create-account-form";
import CreateAccountForm from "@/components/create-account-form";
import React from "react";

type Props = {};

export default function GoldenCreateOperatorAccount({}: Props) {
  return (
    <div>
      <CreateAccountFormWithCommissionPeriod />

      {/* <p>tesxt</p> */}
    </div>
  );
}
