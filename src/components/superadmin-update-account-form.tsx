"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RootState, useSelector } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import KYCVerification from "./tables/common/kyc-verification";

//v2 add
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Circle,
  CircleDot,
  ChevronDown,
  Check,
  Calendar,
  Info,
} from "lucide-react"; // Added Info icon
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { MultiSelect } from "@/components/ui/multi-select";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import tooltip components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  onSubmit?: (values: z.infer<typeof createAccountFormSchema>) => void;
};

// Define commission computation period options with only monthly and bi-monthly
const settlementPeriods = [
  { value: "BI_MONTHLY", label: "Bi-Monthly" },
  { value: "MONTHLY", label: "Monthly" },
];

const mobilePrefixes = [
  { value: "09", label: "09" },
  { value: "+639", label: "+639" },
  { value: "639", label: "639" },
];

const createAccountFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  mobileNumberPrefix: z.string(),
  mobileNumber: z
    .string()
    .regex(/^\d{9}$/, { message: "Please enter 9 digits after the prefix" }),
  bankName: z.string().min(2, { message: "Bank name is required" }),
  accountNumber: z
    .string()
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
  username: z.string(),
  password: z.string(),
  // Category-specific commission and commission computation details
  eGamesCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  eGamesCommissionComputationPeriod: z.enum(["BI_MONTHLY", "MONTHLY"]),

  sportsBettingCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  sportsBettingCommissionComputationPeriod: z.enum(["BI_MONTHLY", "MONTHLY"]),

  specialityGamesCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  specialityGamesCommissionComputationPeriod: z.enum(["BI_MONTHLY", "MONTHLY"]),

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

export default function SuperAdminUpdateAccountForm({ onSubmit }: Props) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [sites, setSites] = useState<SiteType[]>([]);
  const [categories, setCategories] = useState<Record<string, any>[]>([]);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settlementEndDate, setSettlementEndDate] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<any>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { username } = useParams();

  // Form initialization with default values
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
      eGamesCommissionComputationPeriod: "BI_MONTHLY",
      sportsBettingCommission: "",
      sportsBettingCommissionComputationPeriod: "BI_MONTHLY",
      specialityGamesCommission: "",
      specialityGamesCommissionComputationPeriod: "BI_MONTHLY",
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

  // Fetch user details
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
            specialityGames: "",
          };

          const commissionComputationPeriods = {
            eGames: "BI_MONTHLY",
            sportsBetting: "BI_MONTHLY",
            specialityGames: "BI_MONTHLY",
          };

          // Get unique commission percentages and periods per category
          user.commissions.forEach((commission: any) => {
            switch (commission.category.name) {
              case "eGames":
                commissionsByCategory.eGames =
                  commission.commissionPercentage.toString();
                commissionComputationPeriods.eGames =
                  commission.commissionComputationPeriod;
                break;
              case "Sports-Betting":
                commissionsByCategory.sportsBetting =
                  commission.commissionPercentage.toString();
                commissionComputationPeriods.sportsBetting =
                  commission.commissionComputationPeriod;
                break;
              case "SpecialityGames":
                commissionsByCategory.specialityGames =
                  commission.commissionPercentage.toString();
                commissionComputationPeriods.specialityGames =
                  commission.commissionComputationPeriod;
                break;
            }
          });

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
            eGamesCommissionComputationPeriod:
              commissionComputationPeriods.eGames as "BI_MONTHLY" | "MONTHLY",
            sportsBettingCommission: commissionsByCategory.sportsBetting,
            sportsBettingCommissionComputationPeriod:
              commissionComputationPeriods.sportsBetting as
                | "BI_MONTHLY"
                | "MONTHLY",
            specialityGamesCommission: commissionsByCategory.specialityGames,
            specialityGamesCommissionComputationPeriod:
              commissionComputationPeriods.specialityGames as
                | "BI_MONTHLY"
                | "MONTHLY",
            siteIds: userSiteIds,
          };

          // Store initial values for change detection
          setInitialFormValues(formValues);
          form.reset(formValues);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Error fetching user details");
      }
    };

    fetchUserDetails();
  }, [username, form]);

  // Fetch sites on component mount
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
          toast("Something went wrong");
        }

        console.log("Sites response:", response.data);

        // Check if response has the expected structure
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          setSites(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          // Fallback if API directly returns the array
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

  // Transform sites data for MultiSelect component
  const siteOptions = sites?.map((site) => ({
    label: site.name,
    value: site.id,
    description: site.url,
  }));

  // Handle site selection changes
  const handleSiteSelectionChange = (selectedValues: string[]) => {
    setSelectedSiteIds(selectedValues);
    form.setValue("siteIds", selectedValues);
  };

  // Handle site selection
  const toggleSite = (siteId: string) => {
    setSelectedSiteIds((prev) => {
      const newSelection = prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)
        : [...prev, siteId];

      // Update form value
      form.setValue("siteIds", newSelection);
      return newSelection;
    });
  };

  async function handleSubmit(values: z.infer<typeof createAccountFormSchema>) {
    // If you have an onSubmit prop, call it with full form values if needed.
    if (onSubmit) {
      onSubmit(values);
    }
    console.log("Full Form Values:", values);

    // Extract only the fields needed by your API
    const payload = {
      username: values.username,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      mobileNumber: values.mobileNumberPrefix + values.mobileNumber,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      commissions: {
        eGames: values.eGamesCommission || undefined,
        sportsBetting: values.sportsBettingCommission || undefined,
        specialityGames: values.specialityGamesCommission || undefined,
      },
      siteIds: selectedSiteIds,
      eGamesCommissionComputationPeriod:
        values.eGamesCommissionComputationPeriod,
      sportsBettingCommissionComputationPeriod:
        values.sportsBettingCommissionComputationPeriod,
      specialityGamesCommissionComputationPeriod:
        values.specialityGamesCommissionComputationPeriod,
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

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n")?.map((row) => row.split(","));
        setCsvPreview(rows);
      };
      reader.readAsText(file);
    } else {
      setCsvPreview(null);
    }
  }

  function handleRemoveFile() {
    setUploadedFile(null);
    setCsvPreview(null);
  }

  function handlePreview() {
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
  }

  const options = ["Site 1", "Site 2", "Site 3"]; // Replace with real data
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">
          Create Account
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
                      placeholder="********"
                      disabled
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

            {/* Category-wise Commission Inputs */}
            <div className="col-span-2">
              <Accordion type="multiple" className="w-full">
                {/* eGames Category */}
                <AccordionItem value="egames">
                  <AccordionTrigger className="text-xl">
                    eGames
                  </AccordionTrigger>
                  <AccordionContent className="flex items-center gap-2 justify-center w-full">
                    <FormField
                      control={form.control}
                      name="eGamesCommission"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Commission (%)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="eGamesCommissionComputationPeriod"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Commission Computation Period
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-1 text-gray-500 cursor-pointer">
                                    ?
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    <strong>Bi-Monthly:</strong> Settlement
                                    occurs twice a month (1st-15th and
                                    16th-31st).
                                    <br />
                                    <strong>Monthly:</strong> Settlement occurs
                                    once at the end of each month.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BI_MONTHLY">
                                  Bi-Monthly
                                </SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Sports Betting Category */}
                <AccordionItem value="sportsbetting">
                  <AccordionTrigger className="text-xl">
                    Sports Betting
                  </AccordionTrigger>
                  <AccordionContent className="flex items-center gap-2 justify-center w-full">
                    <FormField
                      control={form.control}
                      name="sportsBettingCommission"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Commission (%)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="sportsBettingCommissionComputationPeriod"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Commission Computation Period
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-1 text-gray-500 cursor-pointer">
                                    ?
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    <strong>Bi-Monthly:</strong> Settlement
                                    occurs twice a month (1st-15th and
                                    16th-31st).
                                    <br />
                                    <strong>Monthly:</strong> Settlement occurs
                                    once at the end of each month.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BI_MONTHLY">
                                  Bi-Monthly
                                </SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Specialty Games Category */}
                <AccordionItem value="specialtygames">
                  <AccordionTrigger className="text-xl">
                    Specialty Games
                  </AccordionTrigger>
                  <AccordionContent className="flex items-center gap-2 justify-center w-full">
                    <FormField
                      control={form.control}
                      name="specialityGamesCommission"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Commission (%)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="specialityGamesCommissionComputationPeriod"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Commission Computation Period
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-1 text-gray-500 cursor-pointer">
                                    ?
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    <strong>Bi-Monthly:</strong> Settlement
                                    occurs twice a month (1st-15th and
                                    16th-31st).
                                    <br />
                                    <strong>Monthly:</strong> Settlement occurs
                                    once at the end of each month.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BI_MONTHLY">
                                  Bi-Monthly
                                </SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Submit Button */}
            <div className="col-span-2 flex justify-end">
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
