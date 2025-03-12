"use client";

import * as React from "react";
import Link from "next/link";
import { ModeToggle } from "./theme-switcher";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-medium text-lg">
            EL Topic Selection
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}