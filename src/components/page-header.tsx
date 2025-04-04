import React from "react";
import { PageBreadcrumb } from "./page-breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

type Props = {};

export default function PageHeader({}) {
  return (
    <header className="flex bg-[#f0f0f0] h-16 shrink-0 text-foreground items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 text-foreground" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <PageBreadcrumb />
    </header>
  );
}
