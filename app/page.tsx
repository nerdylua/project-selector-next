'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { User, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { WelcomeHeader } from "@/components/landing/WelcomeHeader";
import { TimerDisplay } from "@/components/landing/TimerDisplay";
import { AuthSection } from "@/components/landing/AuthSection";
import { StatsCard } from "@/components/landing/StatsCard";
import { motion } from "framer-motion";
import { BookOpen, Users, Clock, CheckCircle } from "lucide-react";
import { STORAGE_KEY } from "@/lib/types";
import { TIMER_CONFIG } from "@/lib/constants";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface Stats {
  totalTopics: number;
  availableTopics: number;
  totalResponses: number;
  timeLeftPercentage: number;
}

export default function IndexPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    totalTopics: 0,
    availableTopics: 0,
    totalResponses: 0,
    timeLeftPercentage: 100,
  });

  // Check if user has already selected a topic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY);
      const now = new Date();
      const { START_TIME, END_TIME } = TIMER_CONFIG;

      // If outside the time window, redirect to home
      if (now < START_TIME || now >= END_TIME) {
        router.push('/');
        return;
      }

      if (savedState) {
        router.push('/progress');
      }
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
    });

    // Fetch initial stats
    fetchStats();

    // Set up real-time stats updates
    const statsInterval = setInterval(fetchStats, 30000); // Update every 30 seconds

    return () => {
      clearInterval(timer);
      clearInterval(statsInterval);
      unsubscribe();
    };
  }, []);

  async function fetchStats() {
    try {
      // Get total topics
      const topicsSnapshot = await getDocs(collection(db, "topics"));
      const totalTopics = topicsSnapshot.size;
      
      // Get available topics
      const availableTopicsQuery = query(collection(db, "topics"), where("taken", "==", false));
      const availableTopicsSnapshot = await getDocs(availableTopicsQuery);
      const availableTopics = availableTopicsSnapshot.size;

      // Get total responses
      const responsesSnapshot = await getDocs(collection(db, "responses"));
      const totalResponses = responsesSnapshot.size;

      // Calculate time left percentage using the constants
      const now = new Date();
      const { START_TIME, END_TIME } = TIMER_CONFIG;
      
      let timeLeftPercentage = 100;
      
      if (now < START_TIME) {
        timeLeftPercentage = 100;
      } else if (now >= END_TIME) {
        timeLeftPercentage = 0;
      } else {
        const totalDuration = END_TIME.getTime() - START_TIME.getTime();
        const timeLeft = END_TIME.getTime() - now.getTime();
        timeLeftPercentage = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));
      }

      setStats({
        totalTopics,
        availableTopics,
        totalResponses,
        timeLeftPercentage,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  function calculateTimeLeft(): TimeLeft {
    const now = new Date();
    const { START_TIME, END_TIME } = TIMER_CONFIG;
    
    // If current time is before start time, return time until start
    if (now < START_TIME) {
      const difference = START_TIME.getTime() - now.getTime();
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    // If current time is between start and end time, return time until end
    if (now >= START_TIME && now < END_TIME) {
      const difference = END_TIME.getTime() - now.getTime();
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    // If current time is after end time, return zeros
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const handleEnter = () => {
    if (user) {
      // Check if user has already selected a topic
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        router.push('/progress');
      } else {
        router.push("/topics");
      }
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

  const isFormOpen = () => {
    const now = new Date();
    const { START_TIME, END_TIME } = TIMER_CONFIG;
    return now >= START_TIME && now < END_TIME;
  };

  const formIsOpen = isFormOpen();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <WelcomeHeader />

        {/* Stats Grid */}
        {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatsCard
            title="Total Topics"
            value={stats.totalTopics}
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            delay={0.1}
          />
          <StatsCard
            title="Available Topics"
            value={stats.availableTopics}
            icon={<CheckCircle className="w-5 h-5 text-primary" />}
            delay={0.2}
          />
          <StatsCard
            title="Teams Registered"
            value={stats.totalResponses}
            icon={<Users className="w-5 h-5 text-primary" />}
            delay={0.3}
          />
          <StatsCard
            title="Time Remaining"
            value={`${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
            icon={<Clock className="w-5 h-5 text-primary" />}
            delay={0.4}
          />
        </div>*/}

        {/* Timer Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >

          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <TimerDisplay 
              value={String(timeLeft.hours).padStart(2, '0')} 
              label="Hours" 
            />
            <TimerDisplay 
              value={String(timeLeft.minutes).padStart(2, '0')} 
              label="Minutes" 
            />
            <TimerDisplay 
              value={String(timeLeft.seconds).padStart(2, '0')} 
              label="Seconds" 
            />
          </div>
        </motion.div>

        {/* Auth Section */}
        <AuthSection
          user={user}
          isFormOpen={formIsOpen}
          onEnter={handleEnter}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </div>
    </main>
  );
}

