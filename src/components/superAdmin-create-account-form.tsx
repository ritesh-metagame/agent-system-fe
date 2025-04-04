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
// import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Circle, CircleDot, ChevronDown, Check, Calendar } from "lucide-react"; // Added ChevronDown, Check, Calendar
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox component
import axios from "axios";
import { MultiSelect } from "@/components/ui/multi-select"; // Import MultiSelect component
import { format, addDays, addWeeks, addMonths } from "date-fns"; // For date calculations
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Calendar component
import { useRouter } from "next/navigation";
//v2 ends

type Props = {
  onSubmit?: (values: z.infer<typeof createAccountFormSchema>) => void;
};

// Define settlement period options
const settlementPeriods = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "BI_WEEKLY", label: "Bi-weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

const createAccountFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  // username: z
  //   .string()
  //   .min(2, { message: "First name must be at least 2 characters" }),
  mobileNumber: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
  bankName: z.string().min(2, { message: "Bank name is required" }),
  accountNumber: z
    .string()
    .min(5, { message: "Account number must be at least 5 characters" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
  username: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
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
    }),
  eSportsCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  sportsBettingCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  specialtyGamesCommission: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: "Commission percentage must be between 0 and 100",
    }),
  siteIds: z.array(z.string()),
  settlementPeriod: z.enum(["WEEKLY", "BI_WEEKLY", "MONTHLY"]),
  settlementStartDate: z.date({
    required_error: "Please select a start date for settlement",
  }),
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
          throw new Error("Failed to fetch sites");
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
  const siteOptions = sites.map((site) => ({
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
      mobileNumber: "",
      bankName: "",
      accountNumber: "",
      password: "",
      eSportsCommission: "",
      sportsBettingCommission: "",
      specialtyGamesCommission: "",
      siteIds: [],
      settlementPeriod: "MONTHLY", // Default to monthly
      settlementStartDate: new Date(), // Default to today
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

  // Calculate end date based on start date and settlement period
  const calculateEndDate = (startDate: Date, period: string) => {
    if (!startDate) return null;

    switch (period) {
      case "WEEKLY":
        return addDays(startDate, 6); // End date is 6 days after start (7 days total)
      case "BI_WEEKLY":
        return addDays(startDate, 13); // End date is 13 days after start (14 days total)
      case "MONTHLY":
        return addDays(addMonths(startDate, 1), -1); // Last day of the month
      default:
        return null;
    }
  };

  // Update end date whenever start date or period changes
  useEffect(() => {
    const startDate = form.getValues("settlementStartDate");
    const period = form.getValues("settlementPeriod");

    if (startDate && period) {
      const endDate = calculateEndDate(startDate, period);
      setSettlementEndDate(endDate);
    }
  }, [form.watch("settlementStartDate"), form.watch("settlementPeriod")]);

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
      mobileNumber: values.mobileNumber,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      commissions: {
        eSports: values.eSportsCommission || undefined,
        sportsBetting: values.sportsBettingCommission || undefined,
        specialtyGames: values.specialtyGamesCommission || undefined,
      },
      siteIds: selectedSiteIds,
      settlementDetails: {
        period: values.settlementPeriod,
        startDate: format(values.settlementStartDate, "yyyy-MM-dd"),
        endDate: settlementEndDate
          ? format(settlementEndDate, "yyyy-MM-dd")
          : null,
      },
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
        console.log("Account created successfully:", data);

        if (data.code === "1004") {
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
        const rows = text.split("\n").map((row) => row.split(","));
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
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
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
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
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

            {/* Sites Multi-select Dropdown - Using MultiSelect component */}
            <FormField
              control={form.control}
              name="siteIds"
              render={({ field }) => (
                <FormItem className="mb-4">
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

            {/* Settlement Period Section with Divider */}
            <div className="pt-4">
              <h3 className="font-medium text-lg mb-2">Settlement Details</h3>
              <Separator className="mb-4" />

              {/* Settlement Period */}
              <FormField
                control={form.control}
                name="settlementPeriod"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Settlement Period</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select settlement period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settlementPeriods.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Settlement Dates - Side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Settlement Start Date */}
                <FormField
                  control={form.control}
                  name="settlementStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Settlement End Date (Auto-calculated, Read-only) */}
                <div>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    value={
                      settlementEndDate
                        ? format(settlementEndDate, "PPP")
                        : "Auto-calculated"
                    }
                    disabled
                    className="bg-gray-50 h-10"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                End date is calculated automatically based on the selected
                period and start date
              </p>
            </div>

            {/* Commission Section with Divider */}
            <div className="pt-4">
              <h3 className="font-medium text-lg mb-2">Commissions</h3>
              <Separator className="mb-4" />

              {/* E-Sports Commission */}
              <FormField
                control={form.control}
                name="eSportsCommission"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>E-Sports Commission (%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter commission percentage"
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sports Betting Commission */}
              <FormField
                control={form.control}
                name="sportsBettingCommission"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Sports Betting Commission (%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter commission percentage"
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Specialty Games Commission */}
              <FormField
                control={form.control}
                name="specialtyGamesCommission"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Specialty Games Commission (%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter commission percentage"
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              variant="default"
              type="submit"
              className="w-full bg-blue-500 text-white"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
