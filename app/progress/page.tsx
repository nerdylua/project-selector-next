'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/landing/StatsCard";
import { Users, BookOpen, CheckCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopicSelectionState, STORAGE_KEY } from "@/lib/types";

interface Response {
  id: string;
  topicTitle: string;
  student1Name: string;
  student1USN: string;
  student2Name: string;
  student2USN: string;
  timestamp: any;
}

interface Stats {
  totalTeams: number;
  totalTopics: number;
  availableTopics: number;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ProgressPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalTeams: 0,
    totalTopics: 0,
    availableTopics: 0,
  });
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [userSelection, setUserSelection] = useState<TopicSelectionState | null>(null);
  const router = useRouter();

  function calculateTimeLeft(): TimeLeft {
    const now = new Date();
    const startTime = new Date("2025-03-11T09:00:00");
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

  // Block back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch responses
        const querySnapshot = await getDocs(collection(db, "responses"));
        const responsesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Response[];
        setResponses(responsesData);

        // Fetch topics for stats
        const topicsSnapshot = await getDocs(collection(db, "topics"));
        const totalTopics = topicsSnapshot.size;
        const availableTopics = topicsSnapshot.docs.filter(doc => !doc.data().taken).length;

        // Calculate stats
        const totalTeams = responsesData.length;

        setStats({
          totalTeams,
          totalTopics,
          availableTopics,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Set up interval for real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Check if user has made a selection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (!savedState) {
        router.push('/');
      } else {
        setUserSelection(JSON.parse(savedState));
      }
    }
  }, [router]);

  return (
    <div className="container py-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
          value={stats.totalTeams}
          icon={<Users className="w-5 h-5 text-primary" />}
          delay={0.3}
        />
        {/* <StatsCard
          title="Time Remaining"
          value={`${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
          icon={<Clock className="w-5 h-5 text-primary" />}
          delay={0.4}
        /> */}
      </div>

      {/* User Selection Card */}
      {userSelection && (
        <Card className="max-w-5xl mx-auto border-border/50 shadow-lg mb-8">
          <CardHeader className="text-center pb-6 border-b">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Your Topic Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Selected Topic</h3>
                <p className="text-muted-foreground">{userSelection.topicTitle}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Selected on: {new Date(userSelection.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {userSelection.student1Name} ({userSelection.student1USN})
                  </p>
                  <p className="text-muted-foreground">
                    {userSelection.student2Name} ({userSelection.student2USN})
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="max-w-5xl mx-auto border-border/50 shadow-lg">
        <CardHeader className="text-center pb-8 border-b">
          <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Project Topics Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No topics have been selected yet.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="text-base font-semibold text-primary/80 w-16">No.</TableHead>
                    <TableHead className="text-base font-semibold text-primary/80">Topic</TableHead>
                    <TableHead className="text-base font-semibold text-primary/80">Students</TableHead>
                    <TableHead className="text-base font-semibold text-primary/80">Time Selected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response, index) => (
                    <TableRow 
                      key={response.id}
                      className="border-border/50"
                    >
                      <TableCell className="font-medium w-16">{index + 1}</TableCell>
                      <TableCell className="font-medium">{response.topicTitle}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{response.student1Name} ({response.student1USN})</div>
                          <div>{response.student2Name} ({response.student2USN})</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {response.timestamp?.toDate().toLocaleString() || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}