import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavigationMobileProps {
  navigationLinks: { href: string; label: string }[];
}

export function NavigationMobile({ navigationLinks }: NavigationMobileProps) {
  const pathname = usePathname();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            {navigationLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DropdownMenuItem key={item.label} className={cn("flex items-center gap-2 p-2", isActive && "bg-primary/10")}>
                  <Link href={item.href} className="w-full">
                    <span className={cn("text-sm", isActive && "text-primary font-medium")}>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}