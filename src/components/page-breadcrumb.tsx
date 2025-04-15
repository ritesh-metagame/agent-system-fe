"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { pagePaths, Paths } from "@/lib/constants";

export const PageBreadcrumb = () => {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    // First try exact match
    const exactMatch = pagePaths.get(path as Paths);
    if (exactMatch) return exactMatch;

    // Check for dynamic paths
    for (const [pathPattern, pageTitle] of pagePaths.entries()) {
      if (pathPattern.includes(":")) {
        const regex = new RegExp(
          "^" + pathPattern.replace(/:[\w]+/g, "[\\w-]+") + "$"
        );
        if (regex.test(path)) {
          return pageTitle;
        }
      }
    }
    return null;
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-foreground font-medium">
            {pageTitle}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
