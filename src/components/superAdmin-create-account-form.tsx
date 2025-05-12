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
import { useRouter } from "next/navigation";
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
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .refine((value) => !value.endsWith(" "), {
      message: "First name cannot end with a space",
    }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .refine((value) => !value.endsWith(" "), {
      message: "Last name cannot end with a space",
    }),
  mobileNumberPrefix: z.string(),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^\d{9}$/, {
      message: "Please enter 9 digits after the prefix",
    }),
  bankName: z
    .string()
    .min(2, { message: "Bank name is required" })
    .refine((value) => !value.endsWith(" "), {
      message: "Bank name cannot end with a space",
    }),
  accountNumber: z
    .string()
    .min(5, { message: "Account number must be at least 5 characters" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
  username: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .refine((value) => !value.endsWith(" "), {
      message: "Username cannot end with a space",
    }),
  password: z
    .string()
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
    })
    .refine((value) => !value.endsWith(" "), {
      message: "Password cannot end with a space",
    }),
  // Category-specific commission and commission computation details
  eGamesCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  eGamesCommissionComputationPeriod: z.enum(["BI_MONTHLY", "WEEKLY"]),

  sportsBettingCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  sportsBettingCommissionComputationPeriod: z.enum(["BI_MONTHLY", "WEEKLY"]),

  specialityGamesRngCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  specialityGamesRngCommissionComputationPeriod: z.enum([
    "BI_MONTHLY",
    "WEEKLY",
  ]),

  specialityGamesToteCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  specialityGamesToteCommissionComputationPeriod: z.enum([
    "BI_MONTHLY",
    "WEEKLY",
  ]),

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

export default function SuperAdminCreateAccountForm({ onSubmit }: Props) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [sites, setSites] = useState<SiteType[]>([]);
  const [categories, setCategories] = useState<Record<string, any>[]>([]);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settlementEndDate, setSettlementEndDate] = useState<Date | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  console.log("NEXT_PUBLIC_BASE_URL:", BASE_URL);

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

  const router = useRouter();

  // Handle site selection changes
  const handleSiteSelectionChange = (selectedValues: string[]) => {
    setSelectedSiteIds(selectedValues);
    form.setValue("siteIds", selectedValues);
  };

  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      mobileNumberPrefix: mobilePrefixes[0].value, // Default to first prefix
      mobileNumber: "",
      bankName: "",
      accountNumber: "",
      password: "",
      eGamesCommission: "",
      eGamesCommissionComputationPeriod: "BI_MONTHLY", // Default to bIBI_MONTHLY
      sportsBettingCommission: "",
      sportsBettingCommissionComputationPeriod: "WEEKLY", // Default to bIBI_MONTHLY
      specialityGamesRngCommission: "",
      specialityGamesRngCommissionComputationPeriod: "BI_MONTHLY", // Default to monthly
      specialityGamesToteCommission: "",
      specialityGamesToteCommissionComputationPeriod: "WEEKLY",

      siteIds: [],
    },
  });

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
        specialityGamesTote: values.specialityGamesToteCommission || undefined,
        specialityGamesRng: values.specialityGamesRngCommission || undefined,
      },
      siteIds: selectedSiteIds,
      // eGamesCommissionComputationPeriod:values.eGamesCommissionComputationPeriod,
      eGamesCommissionComputationPeriod:"BI_MONTHLY",
      // sportsBettingCommissionComputationPeriod:values.sportsBettingCommissionComputationPeriod,
      sportsBettingCommissionComputationPeriod: "WEEKLY",

      // specialityGamesRngCommissionComputationPeriod: values.specialityGamesRngCommissionComputationPeriod,
      specialityGamesRngCommissionComputationPeriod: "BI_MONTHLY",
      // specialityGamesToteCommissionComputationPeriod: values.specialityGamesToteCommissionComputationPeriod,
      specialityGamesToteCommissionComputationPeriod: "WEEKLY",

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
        // Handle error response
        const errorData = await response.json();
        console.error("Error creating account:", errorData);
        // Optionally, show a message to the user
      } else {
        const data = await response.json();

        if (data.code === "2005") {
          toast(data.message ?? "Something went wrong");
          return;
        }

        if (data.code === "1004") {
          toast(data.message ?? "Something went wrong");
          router.push("/partner-management");
        }
        // Optionally, perform further actions on success (e.g., navigate away)
      }
    } catch (error) {
      console.error("Network error:", error);
      // Optionally, show a network error message to the user
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
          Operator Account Creation
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

            {/* Category-wise Commission Inputs */}
            <div className="col-span-2">
              <Accordion type="multiple" className="w-full">
                {/* eGames Category */}
                <AccordionItem value="egames">
                  <AccordionTrigger className="text-xl">
                    E-Games
                  </AccordionTrigger>
                  <AccordionContent className="flex items-center gap-2 justify-center w-full">
                    <FormField
                      control={form.control}
                      name="eGamesCommission"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Commission (% of GGR)</FormLabel>
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
                                    <strong>Weekly:</strong> Settlement occurs
                                    once at the end of each week.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={"BI_MONTHLY"}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BI_MONTHLY">
                                  Bi-Monthly
                                </SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
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
                          <FormLabel>Commission (% of Total Bets)</FormLabel>
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
                                    <strong>Weekly:</strong> Settlement occurs
                                    once at the end of each week.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={"WEEKLY"}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BI_MONTHLY">
                                  Bi-Monthly
                                </SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
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
                <AccordionItem value="specialtygamesrng">
                  <AccordionTrigger className="text-xl">
                    Specialty Games - RNG
                  </AccordionTrigger>
                  <AccordionContent className="flex items-center gap-2 justify-center w-full">
                    <FormField
                      control={form.control}
                      name="specialityGamesRngCommission"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Commission (% of GGR)</FormLabel>
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
                      name="specialityGamesRngCommissionComputationPeriod"
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
                                    <strong>Weekly:</strong> Settlement occurs
                                    once at the end of each week.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={"BI_MONTHLY"}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BI_MONTHLY">
                                  Bi-Monthly
                                </SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specialtygamestote">
                  <AccordionTrigger className="text-xl">
                    Specialty Games - Tote
                  </AccordionTrigger>
                  <AccordionContent className="flex items-center gap-2 justify-center w-full">
                    <FormField
                      control={form.control}
                      name="specialityGamesToteCommission"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Commission (% of Total Bets)</FormLabel>
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
                      name="specialityGamesToteCommissionComputationPeriod"
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
                                    <strong>Weekly:</strong> Settlement occurs
                                    once at the end of each week.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={"WEEKLY"}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BI_MONTHLY">
                                  Bi-Monthly
                                </SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
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
