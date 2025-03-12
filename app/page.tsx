'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "@/lib/firebase"; // Ensure Firebase is configured
import { User, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { motion } from "framer-motion";

interface TimerDisplayProps {
  value: string;
  label: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const TimerDisplay = ({ value, label }: TimerDisplayProps) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
    <div className="relative flex flex-col items-center justify-center bg-card/90 dark:bg-card/50 backdrop-blur-xl rounded-xl p-4 shadow-xl">
      <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent animate-pulse">
        {value}
      </span>
      <span className="text-sm font-medium text-muted-foreground mt-1">{label}</span>
    </div>
  </div>
);

export default function IndexPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  function calculateTimeLeft(): TimeLeft {
    const now = new Date();
    const startTime = new Date("2025-03-11T09:00:00"); // Set your start time here
    const difference = startTime.getTime() - now.getTime();

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const handleEnter = () => {
    if (user) {
      router.push("/topics");
    } else {
      alert("Please log in first!");
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isFormOpen = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 dark:bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, delay: 2, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/30 dark:bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, delay: 4, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-muted/30 dark:bg-muted/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
        </div>
      </div>

      {/* Main content */}
      <div className={`relative flex flex-col items-center justify-center min-h-screen px-4 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full max-w-2xl">
          {/* Card background blur effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-2xl blur opacity-20"></div>
          
          <div className="relative bg-card/80 dark:bg-card/50 backdrop-blur-xl rounded-xl shadow-2xl dark:shadow-primary/5 p-8 transition-all duration-300">
            <div className="text-center space-y-4">
              <div className="inline-block">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent pb-2"
                >
                  EL Topic Selection
                </motion.h1>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full"
                />
              </div>
              <p className="text-muted-foreground text-lg">
                Welcome to the Engineering Laboratory topic selection portal
              </p>
            </div>

            <div className="my-12">
              <p className="text-center text-sm font-medium text-muted-foreground mb-6">
                Time until form opens:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <TimerDisplay value={String(timeLeft.hours).padStart(2, '0')} label="Hours" />
                <TimerDisplay value={String(timeLeft.minutes).padStart(2, '0')} label="Minutes" />
                <TimerDisplay value={String(timeLeft.seconds).padStart(2, '0')} label="Seconds" />
              </div>
            </div>

            {user ? (
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-card/90 dark:bg-card/50 backdrop-blur-xl rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Signed in as</p>
                    <p className="font-medium text-foreground">{user.displayName}</p>
                  </div>
                </div>

                {isFormOpen ? (
                  <button
                    onClick={handleEnter}
                    className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 p-0.5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative flex items-center justify-center bg-card/10 backdrop-blur-sm rounded-[10px] py-3.5 transition-all duration-300 group-hover:bg-transparent">
                      <span className="text-primary-foreground font-semibold">Enter Selection Portal</span>
                      <motion.span 
                        className="ml-2 text-primary-foreground font-semibold"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        →
                      </motion.span>
                    </div>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-muted/80 dark:bg-muted/20 backdrop-blur-sm text-muted-foreground px-6 py-3.5 rounded-xl font-medium cursor-not-allowed transition-all duration-300 hover:bg-muted/90 dark:hover:bg-muted/30"
                  >
                    Form Opens Soon
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3.5 rounded-xl font-medium border border-border hover:border-primary/20 
                           bg-card/50 dark:bg-card/30 backdrop-blur-sm text-muted-foreground transition-all duration-300 
                           hover:bg-card/80 dark:hover:bg-card/40 hover:shadow-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 p-0.5 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative flex items-center justify-center bg-card/10 backdrop-blur-sm rounded-[10px] py-3.5 transition-all duration-300 group-hover:bg-transparent">
                  <span className="text-primary-foreground font-semibold">Sign in with Google</span>
                  <motion.span 
                    className="ml-2 text-primary-foreground font-semibold"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

