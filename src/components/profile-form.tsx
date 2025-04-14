"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSelector } from "@/redux/store";
import { UserRole } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Edit3 } from "lucide-react";
import { toast } from "sonner";

const profileFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string(),
  password: z.string().min(8).optional(),
  mobileNumber: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
});

export default function ProfileForm() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { role } = useSelector((state) => state.authReducer);
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      mobileNumber: "",
      bankName: "",
      accountNumber: "",
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.data?.user) {
          setUserDetails(data.data.user);
          form.reset({
            firstName: data.data.user.firstName || "",
            lastName: data.data.user.lastName || "",
            username: data.data.user.username || "",
            mobileNumber: data.data.user.mobileNumber || "",
            bankName: data.data.user.bankName || "",
            accountNumber: data.data.user.accountNumber || "",
            password: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [form]);

  const handleSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/${userId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password || undefined,
            mobileNumber: values.mobileNumber,
            bankName: values.bankName,
            accountNumber: values.accountNumber,
          }),
        }
      );

      const data = await response.json();

      if (data.code === "1014") {
        toast.success(data.message);
        setIsEditMode(false);

        // Refresh user details
        const updatedResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const updatedData = await updatedResponse.json();
        if (updatedData.data?.user) {
          setUserDetails(updatedData.data.user);
          form.reset({
            firstName: updatedData.data.user.firstName || "",
            lastName: updatedData.data.user.lastName || "",
            username: updatedData.data.user.username || "",
            mobileNumber: updatedData.data.user.mobileNumber || "",
            bankName: updatedData.data.user.bankName || "",
            accountNumber: updatedData.data.user.accountNumber || "",
            password: "",
          });
        }
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      form.reset({
        ...form.getValues(),
        password: "", // Reset password when entering edit mode
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-2xl font-bold">
          Profile Information
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleEditMode}
          className="flex items-center gap-2"
        >
          <Edit3 className="h-4 w-4" />
          {isEditMode ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditMode} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditMode} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditMode} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditMode} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditMode} />
                  </FormControl>
                </FormItem>
              )}
            />

            {isEditMode && (
              <div className="col-span-full flex justify-end mt-6">
                <Button type="submit" className="bg-blue-500 text-white">
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Form>

        {userDetails && !isSuperAdmin && (
          <div className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="assigned-sites">
                <AccordionTrigger className="text-lg font-semibold">
                  Assigned Sites
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4">
                    {userDetails.userSites?.map((site: any) => (
                      <div key={site.siteId} className="p-4 border rounded-lg">
                        <h4 className="font-semibold">{site.site.name}</h4>
                        <p className="text-sm text-gray-600">{site.site.url}</p>
                        <p className="text-sm text-gray-500">
                          {site.site.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="commission-structure">
                <AccordionTrigger className="text-lg font-semibold">
                  Commission Structure
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4">
                    {userDetails.commissions?.length > 0 ? (
                      userDetails.commissions.map(
                        (commission: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  {commission.category?.name ||
                                    "Unnamed Category"}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Commission: {commission.commissionPercentage}%
                                </p>
                                <p className="text-sm text-gray-500">
                                  Computation Period:{" "}
                                  {commission.commissionComputationPeriod ===
                                  "BI_MONTHLY"
                                    ? "Bi-Monthly"
                                    : commission.commissionComputationPeriod ===
                                      "MONTHLY"
                                    ? "Monthly"
                                    : commission.commissionComputationPeriod ||
                                      "Not specified"}
                                </p>
                              </div>
                              {commission.site && (
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    {commission.site.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {commission.site.url}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 text-center p-4">
                        No commission structure defined
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
