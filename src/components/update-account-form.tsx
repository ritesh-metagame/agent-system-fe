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
import { RootState, useSelector } from "@/redux/store";

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
  eGamesOwnCommission: z.string(),
  sportsBettingCommission: z.string(),
  sportsBettingOwnCommission: z.string(),
  specialityGamesRngCommission: z.string(),
  specialityGamesRngOwnCommission: z.string(),
  specialityGamesToteCommission: z.string(),
  specialityGamesToteOwnCommission: z.string(),
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
  const { user: loggedInUser } = useSelector((state) => state.authReducer);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sites, setSites] = useState<SiteType[]>([]);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<any>(null);

  const [isCommissionFieldDisabled, setIsCommissionFieldDisabled] = useState(true); 
  const [originalCommissions, setOriginalCommissions] = useState({
    eGames: 0,
    sportsBetting: 0,
    specialtyGamesRng: 0,
    specialtyGamesTote: 0,
  });

  // Add new state for logged-in user's commissions
  const [loggedInUserCommissions, setLoggedInUserCommissions] = useState({
    eGames: 0,
    sportsBetting: 0,
    specialtyGamesRng: 0,
    specialtyGamesTote: 0,
  });

  const searchParams = useSearchParams();

  const updateMode = searchParams.get("updateMode");
  const isApprovalMode = updateMode === "approval";

  const currentLoggedInUserName = useSelector((state: RootState) => state.authReducer.username )


  useEffect(() => {
    if (isApprovalMode) {

      setIsCommissionFieldDisabled(false);
    }
  }, [isApprovalMode]);

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
      specialityGamesRngCommission: "",
      specialityGamesToteCommission: "",
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
            specialtyGamesRng: "",
            specialtyGamesTote: "",
          };

          const originalCommissionsData = {
            eGames: 0,
            sportsBetting: 0,
            specialtyGamesRng: 0,
            specialtyGamesTote: 0,
          };

          // Get unique commission percentages per category
          user.commissions.forEach((commission: any) => {
            switch (commission.category.name) {
              case "E-Games":
                commissionsByCategory.eGames = commission.commissionPercentage.toString();
                originalCommissionsData.eGames = commission.totalAssignedCommissionPercentage;
                break;
              case "Sports Betting":
                commissionsByCategory.sportsBetting = commission.commissionPercentage.toString();
                originalCommissionsData.sportsBetting = commission.totalAssignedCommissionPercentage;
                break;
              case "Speciality Games - RNG":
                commissionsByCategory.specialtyGamesRng = commission.commissionPercentage.toString();
                originalCommissionsData.specialtyGamesRng = commission.totalAssignedCommissionPercentage;
                break;
              case "Speciality Games - Tote":
                commissionsByCategory.specialtyGamesTote = commission.commissionPercentage.toString();
                originalCommissionsData.specialtyGamesTote = commission.totalAssignedCommissionPercentage;
                break;
            }
          });

          // Store original commission values for validation
          setOriginalCommissions(originalCommissionsData);

          // Calculate own commission values
          const ownCommissions = {
            eGames: (originalCommissionsData.eGames - parseFloat(commissionsByCategory.eGames || "0")).toString(),
            sportsBetting: (originalCommissionsData.sportsBetting - parseFloat(commissionsByCategory.sportsBetting || "0")).toString(),
            specialtyGamesRng: (originalCommissionsData.specialtyGamesRng - parseFloat(commissionsByCategory.specialtyGamesRng || "0")).toString(),
            specialtyGamesTote: (originalCommissionsData.specialtyGamesTote - parseFloat(commissionsByCategory.specialtyGamesTote || "0")).toString(),
          };

          const userSiteIds = user.userSites?.map((site: any) => site.siteId);
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
            eGamesOwnCommission: ownCommissions.eGames,
            sportsBettingCommission: commissionsByCategory.sportsBetting,
            sportsBettingOwnCommission: ownCommissions.sportsBetting,
            specialityGamesRngCommission: commissionsByCategory.specialtyGamesRng,
            specialityGamesRngOwnCommission: ownCommissions.specialtyGamesRng,
            specialityGamesToteCommission: commissionsByCategory.specialtyGamesTote,
            specialityGamesToteOwnCommission: ownCommissions.specialtyGamesTote,
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


  // Fetch logged-in user's commission details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!username) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/username/${loggedInUser.username}`,
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
            specialtyGamesRng: "",
            specialtyGamesTote: "",
          };

          const originalCommissionsData = {
            eGames: 0,
            sportsBetting: 0,
            specialtyGamesRng: 0,
            specialtyGamesTote: 0,
          };

          // Get unique commission percentages per category
          user.commissions.forEach((commission: any) => {
            switch (commission.category.name) {
              case "E-Games":
                commissionsByCategory.eGames = commission.commissionPercentage.toString();
                originalCommissionsData.eGames = commission.totalAssignedCommissionPercentage;
                break;
              case "Sports Betting":
                commissionsByCategory.sportsBetting = commission.commissionPercentage.toString();
                originalCommissionsData.sportsBetting = commission.totalAssignedCommissionPercentage;
                break;
              case "Speciality Games - RNG":
                commissionsByCategory.specialtyGamesRng = commission.commissionPercentage.toString();
                originalCommissionsData.specialtyGamesRng = commission.totalAssignedCommissionPercentage;
                break;
              case "Speciality Games - Tote":
                commissionsByCategory.specialtyGamesTote = commission.commissionPercentage.toString();
                originalCommissionsData.specialtyGamesTote = commission.totalAssignedCommissionPercentage;
                break;
            }
          });

          // Store original commission values for validation
          setOriginalCommissions(originalCommissionsData);

          // Calculate own commission values
          const ownCommissions = {
            eGames: (originalCommissionsData.eGames - parseFloat(commissionsByCategory.eGames || "0")).toString(),
            sportsBetting: (originalCommissionsData.sportsBetting - parseFloat(commissionsByCategory.sportsBetting || "0")).toString(),
            specialtyGamesRng: (originalCommissionsData.specialtyGamesRng - parseFloat(commissionsByCategory.specialtyGamesRng || "0")).toString(),
            specialtyGamesTote: (originalCommissionsData.specialtyGamesTote - parseFloat(commissionsByCategory.specialtyGamesTote || "0")).toString(),
          };

          const userSiteIds = user.userSites?.map((site: any) => site.siteId);
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
            eGamesOwnCommission: ownCommissions.eGames,
            sportsBettingCommission: commissionsByCategory.sportsBetting,
            sportsBettingOwnCommission: ownCommissions.sportsBetting,
            specialityGamesRngCommission: commissionsByCategory.specialtyGamesRng,
            specialityGamesRngOwnCommission: ownCommissions.specialtyGamesRng,
            specialityGamesToteCommission: commissionsByCategory.specialtyGamesTote,
            specialityGamesToteOwnCommission: ownCommissions.specialtyGamesTote,
            siteIds: userSiteIds,
          };

          form.setValue(
            "eGamesOwnCommission",
            ownCommissions.eGames
          )
          form.setValue(
            "sportsBettingOwnCommission",
            ownCommissions.sportsBetting
          )
          form.setValue(
            "specialityGamesToteOwnCommission",
            ownCommissions.specialtyGamesTote
          )
          form.setValue(
            "specialityGamesRngOwnCommission",
            ownCommissions.specialtyGamesRng
          )

          // Store initial values for change detection
          // setInitialFormValues(formValues);
          // form.reset(formValues);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [loggedInUser.username]);

  const siteOptions = sites?.map((site: any) => ({
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

  // Update own commission when commission input changes
  const updateOwnCommission = (categoryName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const original = originalCommissions[categoryName];


    console.log("Original Commissions", original, numValue);

    // Ensure the commission doesn't exceed the original value
    if (numValue > original) {
      console.log('--------------', original, numValue);
      toast.error(`Commission cannot exceed ${original}%`);
      return false;
    }

    // Calculate remaining own commission and round to 2 decimal places
    const remainingCommission = parseFloat((original - numValue).toFixed(2));

    // Update the form values
    switch (categoryName) {
      case "eGames":
        form.setValue("eGamesOwnCommission", remainingCommission?.toString());
        break;
      case "sportsBetting":
        form.setValue("sportsBettingOwnCommission", remainingCommission?.toString());
        break;
      case "specialtyGamesRng":
        form.setValue("specialityGamesRngOwnCommission", remainingCommission?.toString());
        break;
      case "specialtyGamesTote":
        form.setValue("specialityGamesToteOwnCommission", remainingCommission?.toString());
        break;
    }
    return true;
  };

  // Update validation in the handleSubmit function
  async function handleSubmit(values: z.infer<typeof createAccountFormSchema>) {
    // Validate that commissions don't exceed the logged-in user's values
    const eGamesCommissionValue = parseFloat(values.eGamesCommission || "0");
    const sportsBettingCommissionValue = parseFloat(values.sportsBettingCommission || "0");
    const specialtyGamesRngCommissionValue = parseFloat(values.specialityGamesRngCommission || "0");
    const specialtyGamesToteCommissionValue = parseFloat(values.specialityGamesToteCommission || "0");

    console.log({eGamesCommissionValue, original: originalCommissions.eGames})

    if (eGamesCommissionValue > originalCommissions.eGames) {
      toast.error(`E-Games commission cannot exceed ${originalCommissions.eGames}%`);
      return;
    }

    if (sportsBettingCommissionValue > originalCommissions.sportsBetting) {
      toast.error(`Sports Betting commission cannot exceed ${originalCommissions.sportsBetting}%`);
      return;
    }

    if (specialtyGamesRngCommissionValue > originalCommissions.specialtyGamesRng) {
      toast.error(`Specialty Games RNG commission cannot exceed ${originalCommissions.specialtyGamesRng}%`);
      return;
    }

    if (specialtyGamesToteCommissionValue > originalCommissions.specialtyGamesTote) {
      toast.error(`Specialty Games Tote commission cannot exceed ${originalCommissions.specialtyGamesTote}%`);
      return;
    }

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
        specialityGamesRng: values.specialityGamesRngCommission || undefined,
        specialityGamesTote: values.specialityGamesToteCommission || undefined,
        eGamesOwn: values.eGamesOwnCommission || undefined,
        sportsBettingOwn: values.sportsBettingOwnCommission || undefined,

        specialityGamesRngOwn:
          values.specialityGamesRngOwnCommission || undefined,
        specialityGamesToteOwn:
          values.specialityGamesToteOwnCommission || undefined,
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
    <Card className="w-[95%] md:w-full max-w-3xl mx-auto p-4 md:p-6">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl font-bold text-center">
          {username ? "Update Account" : "Create Account"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm md:text-base">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="John" {...field} />
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
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm md:text-base">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="Doe" {...field} />
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
                  <FormItem className="flex flex-col col-span-1">
                    <FormLabel className="text-sm md:text-base">
                      Mobile Number
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="mobileNumberPrefix"
                        render={({ field: prefixField }) => (
                          <Select
                            value={prefixField.value}
                            onValueChange={prefixField.onChange}
                          >
                            <SelectTrigger className="w-[90px] md:w-24">
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
                          className="flex-1"
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
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm md:text-base">
                      Bank Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Bank Name"
                        {...field}
                      />
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
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm md:text-base">
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Account Number"
                        {...field}
                      />
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
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm md:text-base">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="johndoe"
                        disabled
                        {...field}
                      />
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
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm md:text-base">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
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
                    <FormLabel className="text-sm md:text-base">
                      Sites
                    </FormLabel>
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
                          className="w-full"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Commission Fields */}
              <div className="flex col-span-2 gap-2 items-center justify-between">
                <FormField
                  control={form.control}
                  name="eGamesCommission"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base">
                        E-Games Commission (% of GGR)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isCommissionFieldDisabled}
                          className="w-full"
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
                      <FormLabel className="text-sm md:text-base">
                        E-Games Own Commission (% of GGR)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          className="w-full"
                          placeholder="Own commission percentage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex col-span-2 gap-2 items-center justify-between">
                <FormField
                  control={form.control}
                  name="sportsBettingCommission"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base">
                        Sports-Betting Commission (% of Total Bets)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isCommissionFieldDisabled}
                          className="w-full"
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
                      <FormLabel className="text-sm md:text-base">
                        Sports-Betting Own Commission (% of Total Bets)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          className="w-full"
                          placeholder="Own commission percentage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex col-span-2 gap-2 items-center justify-between">
                <FormField
                  control={form.control}
                  name="specialityGamesRngCommission"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base">
                        Specialty Games - RNG Commission (% of GGR)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isCommissionFieldDisabled}
                          className="w-full"
                          placeholder="Enter commission percentage"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateOwnCommission("specialtyGamesRng", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialityGamesRngOwnCommission"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base">
                        Specialty Games - RNG Own Commission (% of GGR)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          className="w-full"
                          placeholder="Own commission percentage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex col-span-2 gap-2 items-center justify-between">
                <FormField
                  control={form.control}
                  name="specialityGamesToteCommission"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base">
                        Specialty Games - Tote Commission (% of Total Bets)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isCommissionFieldDisabled}
                          className="w-full"
                          placeholder="Enter commission percentage"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateOwnCommission("specialtyGamesTote", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialityGamesToteOwnCommission"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base">
                        Specialty Games - Tote Own Commission (% of Total Bets)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          className="w-full"
                          placeholder="Own commission percentage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit/Update Button */}
            <div className="flex justify-end pt-4 md:pt-6">
              <Button
                variant="secondary"
                onClick={() => router.push("/partner-management")}
                type="button"
                // type="submit"
                // className="bg-red text-white"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                className="w-full md:w-auto bg-blue-500 text-white px-8"
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
