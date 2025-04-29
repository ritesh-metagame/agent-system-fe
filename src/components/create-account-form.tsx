"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "@/redux/store";
import { UserRole } from "@/lib/constants";

type Props = {
  onSubmit?: (values: z.infer<typeof createAccountFormSchema>) => void;
};

const settlementPeriods = [
  { value: "BI_WEEKLY", label: "Bi-Monthly" },
  { value: "MONTHLY", label: "Monthly" },
];

const mobilePrefixes = [
  { value: "09", label: "09" },
  { value: "+639", label: "+639" },
  { value: "639", label: "639" },
];

const createAccountFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters" }),
  mobileNumberPrefix: z.string(),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^\d{9}$/, {
      message: "Please enter 9 digits",
    }),
  bankName: z.string().trim().min(2, { message: "Bank name is required" }),
  accountNumber: z
    .string()
    .trim()
    .min(5, { message: "Account number must be at least 5 characters" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
  username: z
    .string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*]/, {
      message:
        "Password must contain at least one special character (!@#$%^&*)",
    }),
  eGamesCommission: z
    .string()
    // .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  eGamesOwnCommission: z
    .string()
    // .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  sportsBettingCommission: z
    .string()
    // .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  sportsBettingOwnCommission: z
    .string()
    // .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  specialtyGamesToteCommission: z
    .string()
    // .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  specialtyGamesToteOwnCommission: z
    .string()
    // .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  specialtyGamesRngCommission: z
    .string()
    // .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  specialtyGamesRngOwnCommission: z
    .string()
    // .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  siteIds: z.array(z.string()),
});

type SiteType = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  users: Array<{
    userId: string;
    siteId: string;
    assignedAt: string;
  }>;
};

export default function CreateAccountFormWithCommissionPeriod({
  onSubmit,
}: Props) {
  const [sites, setSites] = useState<SiteType[]>([]);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector((state) => state.authReducer);
  const role = user?.role?.name;

  const [
    totalAssignedCommissionPercentage,
    setTotalAssignedCommissionPercentage,
  ] = useState({
    eGames: 0,
    sportsBetting: 0,
    specialtyGamesRng: 0,
    specialtyGamesTote: 0,
  });

  const [ownCommissionPercentage, setOwnCommissionPercentage] = useState({
    eGames: 0,
    sportsBetting: 0,
    specialtyGamesRng: 0,
    specialtyGamesTote: 0,
  });

  const [originalCommissions, setOriginalCommissions] = useState({
    eGames: 0,
    sportsBetting: 0,
    specialtyGamesRng: 0,
    specialtyGamesTote: 0,
  });

  const { id } = useSelector((state) => state.authReducer.user);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();

  // Update own commission when commission input changes
  const updateOwnCommission = (categoryName, value) => {
    const numValue = parseFloat(value) || 0;
    const original = originalCommissions[categoryName];

    // Ensure the commission doesn't exceed the original value
    if (numValue > original) {
      toast.error(`Commission cannot exceed ${original}%`);
      return false;
    }

    // Calculate remaining own commission
    const remainingCommission = original - numValue;

    // Update the form values
    switch (categoryName) {
      case "eGames":
        form.setValue("eGamesOwnCommission", remainingCommission?.toString());
        break;
      case "sportsBetting":
        form.setValue(
          "sportsBettingOwnCommission",
          remainingCommission?.toString()
        );
        break;
      case "specialtyGamesRng":
        form.setValue(
          "specialtyGamesRngOwnCommission",
          remainingCommission?.toString()
        );
        break;
      case "specialtyGamesTote":
        form.setValue(
          "specialtyGamesToteOwnCommission",
          remainingCommission?.toString()
        );
        break;
    }

    return true;
  };

  const siteOptions = sites?.map((site: any) => ({
    label: site.site.name,
    value: site.site.id,
    description: site.site.url,
    key: site.site.id, // Adding a unique key for each option
  }));

  const getFormTitle = () => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "Operator Account Creation";
      case UserRole.OPERATOR:
        return "Platinum Account Creation";
      case UserRole.PLATINUM:
        return "Gold Account Creation";
      default:
        return "Create Account";
    }
  };

  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      mobileNumberPrefix: "09",
      mobileNumber: "",
      bankName: "",
      accountNumber: "",
      password: "",
      eGamesCommission: "",
      sportsBettingCommission: "",
      specialtyGamesRngCommission: "",
      specialtyGamesToteCommission: "",
      eGamesOwnCommission:
        totalAssignedCommissionPercentage?.eGames?.toString(),
      sportsBettingOwnCommission:
        totalAssignedCommissionPercentage?.sportsBetting?.toString(),
      specialtyGamesRngOwnCommission:
        totalAssignedCommissionPercentage?.specialtyGamesRng?.toString(),
      specialtyGamesToteOwnCommission:
        totalAssignedCommissionPercentage?.specialtyGamesTote?.toString(),
      siteIds: [],
    },
  });

  const handleSiteSelectionChange = (selectedValues: string[]) => {
    setSelectedSiteIds(selectedValues);
    form.setValue("siteIds", selectedValues);
  };

  async function handleSubmit(values: z.infer<typeof createAccountFormSchema>) {
    // Validate that commissions don't exceed the original values
    const eGamesCommissionValue = parseFloat(values.eGamesCommission || "0");
    const sportsBettingCommissionValue = parseFloat(
      values.sportsBettingCommission || "0"
    );
    const specialtyGamesRngCommissionValue = parseFloat(
      values.specialtyGamesRngCommission || "0"
    );
    const specialtyGamesToteCommissionValue = parseFloat(
      values.specialtyGamesToteCommission || "0"
    );

    // Check if any commission exceeds the total assigned percentage
    if (eGamesCommissionValue > originalCommissions.eGames) {
      toast.error(
        `E-Games commission cannot exceed ${originalCommissions.eGames}%`
      );
      return;
    }

    if (sportsBettingCommissionValue > originalCommissions.sportsBetting) {
      toast.error(
        `Sports Betting commission cannot exceed ${originalCommissions.sportsBetting}%`
      );
      return;
    }

    if (
      specialtyGamesRngCommissionValue > originalCommissions.specialtyGamesRng
    ) {
      toast.error(
        `Specialty Games RNG commission cannot exceed ${originalCommissions.specialtyGamesRng}%`
      );
      return;
    }

    if (
      specialtyGamesToteCommissionValue > originalCommissions.specialtyGamesTote
    ) {
      toast.error(
        `Specialty Games Tote commission cannot exceed ${originalCommissions.specialtyGamesTote}%`
      );
      return;
    }

    const fullMobileNumber = values.mobileNumberPrefix + values.mobileNumber;

    const payload = {
      username: values.username,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      mobileNumber: fullMobileNumber,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      commissions: {
        eGames: values.eGamesCommission || undefined,
        sportsBetting: values.sportsBettingCommission || undefined,
        specialityGamesRng: values.specialtyGamesRngCommission || undefined,
        specialityGamesTote: values.specialtyGamesToteCommission || undefined,
        eGamesOwn: values.eGamesOwnCommission || undefined,
        sportsBettingOwn: values.sportsBettingOwnCommission || undefined,

        specialtyGamesRngOwn:
          values.specialtyGamesRngOwnCommission || undefined,
        specialtyGamesToteOwn:
          values.specialtyGamesToteOwnCommission || undefined,
      },
      siteIds: selectedSiteIds,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating account:", errorData);
      } else {
        const data = await response.json();

        if (data.code === "1004") {
          toast(data.message ?? "Something went wrong");
          router.push("/partner-management");
        }

        console.log("Account created successfully:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  useEffect(() => {
    async function fetchSites() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/site`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status !== 200) {
          console.error("Failed to fetch sites");
        }

        console.log("Sites", response.data.data);

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          setSites(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          setSites(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSites();
  }, [BASE_URL]);

  useEffect(() => {
    async function fetchUserCommissions() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/commission/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status !== 200) {
          console.error("Failed to fetch user sites");
        }

        if (response.data && response.data.data) {
          console.log("User Commissions", response.data.data);

          const userCommissionsSet = new Set();

          const commissions = response.data.data
            ?.map((com) => {
              if (!userCommissionsSet.has(com.categoryId)) {
                userCommissionsSet.add(com.categoryId);
                return com;
              } else {
                return null; // Skip duplicates
              }
            })
            .filter((com) => com !== null); // Filter out null values

          const eGamesCategoryCommission = commissions?.find(
            (com) => com?.category?.name === "E-Games"
          );
          const sportsBettingCategoryCommission = commissions?.find(
            (com) => com?.category?.name === "Sports Betting"
          );

          const specialtyGamesRNGCategoryCommission = commissions?.find(
            (com) => com?.category?.name === "Speciality Games - RNG"
          );

          const specialtyGamesToteCategoryCommission = commissions?.find(
            (com) => com?.category?.name === "Speciality Games - Tote"
          );

          setTotalAssignedCommissionPercentage({
            eGames: eGamesCategoryCommission?.totalAssignedCommissionPercentage,
            sportsBetting:
              sportsBettingCategoryCommission?.totalAssignedCommissionPercentage,
            specialtyGamesRng:
              specialtyGamesRNGCategoryCommission?.totalAssignedCommissionPercentage,
            specialtyGamesTote:
              specialtyGamesToteCategoryCommission?.totalAssignedCommissionPercentage,
          });

          setOriginalCommissions({
            eGames: eGamesCategoryCommission?.totalAssignedCommissionPercentage,
            sportsBetting:
              sportsBettingCategoryCommission?.totalAssignedCommissionPercentage,
            specialtyGamesRng:
              specialtyGamesRNGCategoryCommission?.totalAssignedCommissionPercentage,
            specialtyGamesTote:
              specialtyGamesToteCategoryCommission?.totalAssignedCommissionPercentage,
          });

          form.setValue(
            "eGamesOwnCommission",
            eGamesCategoryCommission?.totalAssignedCommissionPercentage
          );
          form.setValue(
            "sportsBettingOwnCommission",
            sportsBettingCategoryCommission?.totalAssignedCommissionPercentage
          );
          form.setValue(
            "specialtyGamesRngOwnCommission",
            specialtyGamesRNGCategoryCommission?.totalAssignedCommissionPercentage
          );
          form.setValue(
            "specialtyGamesToteOwnCommission",
            specialtyGamesToteCategoryCommission?.totalAssignedCommissionPercentage
          );

          console.log(
            "Total Assigned Commission Percentage",
            totalAssignedCommissionPercentage
          );

          // console.log({
          //   eGamesCategoryCommission,
          //   sportsBettingCategoryCommission,
          //   specialtyGamesRNGCategoryCommission,
          //   specialtyGamesToteCategoryCommission,
          // });
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user sites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserCommissions();
  }, [id]);

  return (
    <Card className="w-full max-w-3xl mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">
          {getFormTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number with Prefix */}
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Mobile Number</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="mobileNumberPrefix"
                      render={({ field: prefixField }) => (
                        <Select
                          value={prefixField.value}
                          onValueChange={prefixField.onChange}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Prefix" />
                          </SelectTrigger>
                          <SelectContent>
                            {mobilePrefixes?.map((prefix) => (
                              <SelectItem
                                key={prefix.value}
                                value={prefix.value}
                              >
                                {prefix.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456789"
                        maxLength={9}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank Name */}
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Bank Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Number */}
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Account Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sites Multi-select Dropdown */}
            <FormField
              control={form.control}
              name="siteIds"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Sites</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        disabled
                      >
                        Loading sites...
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    ) : (
                      <MultiSelect
                        options={siteOptions}
                        onValueChange={handleSiteSelectionChange}
                        defaultValue={selectedSiteIds}
                        placeholder="Select sites"
                        variant="inverted"
                        animation={0}
                        maxCount={3}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex col-span-2 gap-2 items-center justify-between">
              {/* eGames Commission and Commission Computation Period */}
              {/* <div className="grid grid-cols-2 col-span-2 gap-4"> */}
              <FormField
                control={form.control}
                name="eGamesCommission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>E-Games Commission (% of GGR)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter commission percentage"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          updateOwnCommission("eGames", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eGamesOwnCommission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>E-Games Own Commission (% of GGR)</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter commission percentage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* </div> */}

            {/* Sports-Betting Commission and Commission Computation Period */}
            {/* <div className="grid grid-cols-2 col-span-2 gap-4"> */}
            <div className="flex col-span-2 gap-2 items-center justify-between">
              <FormField
                control={form.control}
                name="sportsBettingCommission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Sports-Betting Commission (% of Total Bets)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter commission percentage"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          updateOwnCommission("sportsBetting", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sportsBettingOwnCommission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Sports-Betting Own Commission (% of Total Bets)
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter commission percentage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* </div> */}

            {/* SpecialityGames Commission and Commission Computation Period */}
            {/* <div className="grid grid-cols-2 col-span-2 gap-4"> */}
            <div className="flex col-span-2 gap-2 items-center justify-between">
              <FormField
                control={form.control}
                name="specialtyGamesRngCommission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Speciality Games - RNG Commission (% of GGR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter commission percentage"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          updateOwnCommission(
                            "specialtyGamesRng",
                            e.target.value
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialtyGamesRngOwnCommission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Speciality Games - RNG Own Commission (% of GGR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter commission percentage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex col-span-2 gap-2 justify-between">
              <FormField
                control={form.control}
                name="specialtyGamesToteCommission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Speciality Games - Tote Commission (% of Total Bets)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter commission percentage"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          updateOwnCommission(
                            "specialtyGamesTote",
                            e.target.value
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialtyGamesToteOwnCommission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Speciality Games - Tote Own Commission (% of Total Bets)
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter commission percentage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-2 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => router.push("/dashboard")}
                type="button"
                // type="submit"
                // className="bg-red text-white"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                className="bg-blue-500 text-white"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
