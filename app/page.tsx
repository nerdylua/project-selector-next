'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "@/lib/firebase"; // Ensure Firebase is configured
import { User, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

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
  <div className="relative">
    <div className="bg-card dark:bg-card/50 rounded-xl p-2 sm:p-4 shadow-md">
      <span className="text-3xl sm:text-5xl font-bold text-primary">
        {value}
      </span>
      <span className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 block">
        {label}
      </span>
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
    <div className="relative h-[calc(100vh-theme(spacing.16))] bg-background">
      {/* Main content */}
      <div className={`relative flex flex-col items-center justify-center h-full px-4 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full max-w-2xl">
          <div className="bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-xl shadow-md p-6 sm:p-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary pb-2">
                  EL Topic Selection
                </h1>
                <div className="h-1 w-full bg-primary/20 rounded-full" />
              </div>
              <p className="text-muted-foreground text-lg">
                Welcome to the Engineering Laboratory topic selection portal
              </p>
            </div>

            <div className="my-8 sm:my-12">
              <p className="text-center text-sm font-medium text-muted-foreground mb-4 sm:mb-6">
                Time until form opens:
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-6">
                <TimerDisplay value={String(timeLeft.hours).padStart(2, '0')} label="Hours" />
                <TimerDisplay value={String(timeLeft.minutes).padStart(2, '0')} label="Minutes" />
                <TimerDisplay value={String(timeLeft.seconds).padStart(2, '0')} label="Seconds" />
              </div>
            </div>

            {user ? (
              <div className="space-y-4">
                <div className="bg-card/90 dark:bg-card/50 rounded-lg p-4 text-center shadow-sm">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium text-foreground">{user.displayName}</p>
                </div>

                {isFormOpen ? (
                  <button
                    onClick={handleEnter}
                    className="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-medium 
                             hover:bg-primary/90 transition-colors"
                  >
                    Enter Selection Portal →
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-muted text-muted-foreground px-6 py-3.5 rounded-lg font-medium 
                             cursor-not-allowed"
                  >
                    Form Opens Soon
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3.5 rounded-lg font-medium border bg-card/50 
                           text-muted-foreground hover:bg-card/80 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-medium 
                         hover:bg-primary/90 transition-colors"
              >
                Sign in with Google →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

