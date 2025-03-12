"use client";

import * as React from "react";
import Link from "next/link";
import { ModeToggle } from "./theme-switcher";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, useAnimationControls } from "framer-motion";

function BlobBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="blob-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0.15)" />
          </linearGradient>
          <filter id="blob-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15" result="blob" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

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
    <>
      <div className="m-10" />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed left-0 right-0 top-0 z-40"
      >
        <motion.div
          animate={{
            maxWidth: isScrolled ? "68rem" : "100%",
            margin: isScrolled ? "1rem auto" : "0 auto",
            borderRadius: isScrolled ? "9999px" : "0",
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "bg-background/60 border backdrop-blur-xl transition-all duration-500",
            isScrolled 
              ? "bg-background/70 mx-4 md:mx-auto shadow-lg dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-sky-900/20 dark:border-white/10" 
              : "shadow-sm dark:bg-gradient-to-br dark:from-blue-900/10 dark:to-sky-900/10"
          )}
        >
          <div className={cn(
            "flex items-center justify-between",
            isScrolled 
              ? "px-4 h-14" 
              : "px-6 h-16"
          )}>
            <Link href="/" className="group relative flex items-center gap-3">
              <span className="font-medium text-lg">EL Topic Selection</span>
            </Link>

            <div className="flex items-center">
              <ModeToggle />
            </div>
          </div>
        </motion.div>
      </motion.header>
    </>
  );
}