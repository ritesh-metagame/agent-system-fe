import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type ApprovalList = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    mobileNumber: string;
    approved: boolean;
    // approvedBy: string;
}

export const approvalListColumnDefs: ColumnDef<ApprovalList>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            const value = row.getValue("id") as string;
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
    {
        accessorKey: "firstName",
        header: "FIRST NAME",
    },
    {
        accessorKey: "lastName",
        header: "LAST NAME",
    },
    {
        accessorKey: "username",
        header: "USERNAME",
    },
    {
        accessorKey: "mobileNumber",
        header: "MOBILE NUMBER",
    },
    {
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => {

            const router = useRouter();

            const approvePartners = async (id: string, approved: number) => {
                const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
                const res = await fetch(`${BASE_URL}/user/partner/approve`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        userId: id,
                        status: approved
                    })
                });
        
                const data = await res.json();
        
                if (res.ok) {
                    console.log("Approval List: ", data);
                    if (data.code !== "5151") {
                        toast.error(data.message || "Failed to approve partner.");
                    } else {
                        toast.success(data.message);
                        if (data?.data?.approved === 1) {
                            toast.success("Partner approved successfully.");
                            router.push(`/partner-management/update/${data?.data?.username}?updateMode=approval`);
                        } else if (data?.data?.approved === -1) {
                            toast.error("Partner declined successfully.");
                            router.push(`/partner-management`);
                        } else {
                            toast.error("Unexpected approval status.");
                        }
                    }
                } else {
                    console.error("Error approving partner: ", data.message);
                }
            }

            return (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default">Review</Button>
                  </DialogTrigger>
                  <DialogContent className="">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold mb-4">
                        Review pending partners
                      </DialogTitle>
                    </DialogHeader>
        
                    <DialogFooter className="mt-6">
                      {/* <DialogClose asChild> */}
                      <Button variant="outline" onClick={() => approvePartners(row.original.id, -1)} className="mr-2">
                            Decline
                            </Button>
                      {/* </DialogClose> */}
                      {/* <DialogClose asChild> */}
                            <Button onClick={() => approvePartners(row.original.id, 1)} className="mr-2">
                            Approve
                            </Button>
                      {/* </DialogClose> */}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              );
        },
    }
];

