"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";
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

type Props = {
  onSubmit?: (values: z.infer<typeof createAccountFormSchema>) => void;
};

const settlementPeriods = [
  { value: "BI_WEEKLY", label: "Bi-Monthly" },
  { value: "MONTHLY", label: "Monthly" },
];

// Define mobile prefix options
const mobilePrefixes = [
  { value: "09", label: "09" },
  { value: "+639", label: "+639" },
  { value: "639", label: "639" },
];

const createAccountFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  mobileNumberPrefix: z.string(),
  mobileNumber: z.string().regex(/^\d{9}$/, {
    message: "Please enter 9 digits after the prefix",
  }),
  bankName: z.string().optional(),
  accountNumber: z.string(),
  username: z.string(),
  password: z.string(),
  eGamesCommission: z.string(),
  sportsBettingCommission: z.string(),
  specialityGamesCommission: z.string(),
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

export default function UpdateAccountFormWithCommissionPeriod() {
  const { username } = useParams();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sites, setSites] = useState<SiteType[]>([]);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<any>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumberPrefix: mobilePrefixes[0].value,
      mobileNumber: "",
      bankName: "",
      accountNumber: "",
      username: "",
      password: "",
      eGamesCommission: "",
      sportsBettingCommission: "",
      specialityGamesCommission: "",
      siteIds: [],
    },
  });

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (initialFormValues) {
        const hasChanged = Object.keys(value).some((key) => {
          if (key === "password") return false; // Ignore password field
          if (key === "siteIds") {
            return (
              JSON.stringify(value[key]) !==
              JSON.stringify(initialFormValues[key])
            );
          }
          return value[key] !== initialFormValues[key];
        });
        setIsDirty(hasChanged);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, initialFormValues]);

  // Modify the existing fetchUserDetails useEffect
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!username) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (data.code === "1014" && data.data?.user) {
          const user = data.data.user;

          // Extract commission percentages by category
          const commissionsByCategory = {
            eGames: "",
            sportsBetting: "",
            specialtyGames: "",
          };

          // Get unique commission percentages per category
          user.commissions.forEach((commission: any) => {
            switch (commission.category.name) {
              case "eGames":
                commissionsByCategory.eGames =
                  commission.commissionPercentage.toString();
                break;
              case "Sports-Betting":
                commissionsByCategory.sportsBetting =
                  commission.commissionPercentage.toString();
                break;
              case "SpecialityGames":
                commissionsByCategory.specialtyGames =
                  commission.commissionPercentage.toString();
                break;
            }
          });

          const userSiteIds = user.userSites.map((site: any) => site.siteId);
          setSelectedSiteIds(userSiteIds);

          // Extract prefix and remaining digits from mobile number
          let prefix = "09"; // default prefix
          let remainingDigits = user.mobileNumber || "";

          // Check for different prefix patterns
          const prefixPatterns = ["+639", "639", "09"];
          for (const pattern of prefixPatterns) {
            if (user.mobileNumber?.startsWith(pattern)) {
              prefix = pattern;
              remainingDigits = user.mobileNumber.substring(pattern.length);
              break;
            }
          }

          const formValues = {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            mobileNumberPrefix: prefix,
            mobileNumber: remainingDigits,
            bankName: user.bankName || "",
            accountNumber: user.accountNumber || "",
            password: "",
            eGamesCommission: commissionsByCategory.eGames,
            sportsBettingCommission: commissionsByCategory.sportsBetting,
            specialityGamesCommission: commissionsByCategory.specialtyGames,
            siteIds: userSiteIds,
          };

          // Store initial values for change detection
          setInitialFormValues(formValues);
          form.reset(formValues);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [username, form]);

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

  const siteOptions = sites.map((site: any) => ({
    label: site.site.name,
    value: site.site.id,
    description: site.site.url,
    key: site.site.id, // Adding a unique key for each option
  }));

  console.log("Site Options", siteOptions);

  const handleSiteSelectionChange = (selectedValues: string[]) => {
    setSelectedSiteIds(selectedValues);
    form.setValue("siteIds", selectedValues);
  };

  async function handleSubmit(values: z.infer<typeof createAccountFormSchema>) {
    // Combine prefix and mobile number
    const fullMobileNumber = values.mobileNumberPrefix + values.mobileNumber;

    const payload = {
      username: values.username,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      mobileNumber: fullMobileNumber, // Use combined number
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      commissions: {
        eGames: values.eGamesCommission || undefined,
        sportsBetting: values.sportsBettingCommission || undefined,
        specialityGames: values.specialityGamesCommission || undefined,
      },
      siteIds: selectedSiteIds,
    };

    try {
      const url = username
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/user/username/${username}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/user/create`;

      const method = username ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        toast.error(errorData.message || "Something went wrong");
      } else {
        const data = await response.json();
        if (data.code === "1004" || data.code === "1014") {
          toast.success(data.message || "Operation successful");
          router.push("/partner-management");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred");
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">
          {username ? "Update Account" : "Create Account"}
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

            {/* Mobile Number */}
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
                            {mobilePrefixes.map((prefix) => (
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
                    <Input placeholder="johndoe" disabled {...field} />
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
                    <Input
                      type="password"
                      disabled
                      placeholder="********"
                      {...field}
                    />
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

            {/* eGames Commission and Commission Computation Period */}
            {/* <div className="grid grid-cols-2 col-span-2 gap-4"> */}
            <FormField
              control={form.control}
              name="eGamesCommission"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>eGames Commission (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter commission percentage"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* </div> */}

            {/* Sports-Betting Commission and Commission Computation Period */}
            {/* <div className="grid grid-cols-2 col-span-2 gap-4"> */}
            <FormField
              control={form.control}
              name="sportsBettingCommission"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Sports-Betting Commission (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter commission percentage"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* </div> */}

            {/* SpecialityGames Commission and Commission Computation Period */}
            {/* <div className="grid grid-cols-2 col-span-2 gap-4"> */}
            <FormField
              control={form.control}
              name="specialityGamesCommission"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>SpecialityGames Commission (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter commission percentage"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* </div> */}

            {/* Submit/Update Button */}
            <div className="col-span-2 flex justify-end">
              <Button
                variant="default"
                type="submit"
                className="bg-blue-500 text-white"
                disabled={username ? !isDirty : false}
              >
                {username ? "Update" : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
