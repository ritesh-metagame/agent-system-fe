import CreateAccountFormWithCommissionPeriod from "@/components/create-account-form";
import CreateAccountForm from "@/components/create-account-form";
import React from "react";

export default function OperatorCreatePlatinumAccount() {
  // Correct role and category options
  const roleOptions = ["Platinum", "Gold"];
  const categoryOptions = ["Sports-Betting", "eGames", "SpecialityGames"];

  return (
    <div>
      <CreateAccountFormWithCommissionPeriod
      // roleOptions={roleOptions}
      // categoryOptions={categoryOptions}
      />
    </div>
  );
}
