'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, runTransaction, addDoc, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TopicTable } from "@/components/topics/TopicTable";
import { StudentForm } from "@/components/topics/StudentForm";
import { TopicSelectionState, STORAGE_KEY } from "@/lib/types";
import { usnSchema } from "@/lib/validations";
import { z } from "zod";

interface Topic {
  id: string;
  title: string;
  taken: boolean;
}

export default function TopicSelectionPage() {
  const router = useRouter();
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTopicId, setSelectedTopicId] = React.useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [student1Name, setStudent1Name] = React.useState("");
  const [student2Name, setStudent2Name] = React.useState("");
  const [student1USN, setStudent1USN] = React.useState("");
  const [student2USN, setStudent2USN] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [usnError, setUsnError] = React.useState<string | null>(null);
  const [usnErrors, setUsnErrors] = React.useState({
    student1: "",
    student2: "",
  });

  // Check if user has already selected a topic
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        router.push('/progress');
      }
    }
  }, [router]);

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "topics"));
        const topicsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "",
          taken: doc.data().taken || false,
        })) as Topic[];
        setTopics(topicsData);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setTopics([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const checkExistingUSNs = async (usn1: string, usn2: string) => {
    try {
      const responsesRef = collection(db, "responses");
      const usn1Query = query(responsesRef, 
        where("student1USN", "in", [usn1, usn2])
      );
      const usn2Query = query(responsesRef, 
        where("student2USN", "in", [usn1, usn2])
      );

      const [usn1Snapshot, usn2Snapshot] = await Promise.all([
        getDocs(usn1Query),
        getDocs(usn2Query)
      ]);

      const existingUSNs = new Set<string>();
      
      usn1Snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.student1USN === usn1) existingUSNs.add(usn1);
        if (data.student1USN === usn2) existingUSNs.add(usn2);
      });

      usn2Snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.student2USN === usn1) existingUSNs.add(usn1);
        if (data.student2USN === usn2) existingUSNs.add(usn2);
      });

      return Array.from(existingUSNs);
    } catch (error) {
      console.error("Error checking USNs:", error);
      return [];
    }
  };

  const validateUSN = (usn: string, field: 'student1' | 'student2') => {
    try {
      usnSchema.parse(usn);
      setUsnErrors(prev => ({ ...prev, [field]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsnErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleUSNChange = (value: string, field: 'student1' | 'student2') => {
    const upperValue = value.toUpperCase();
    if (field === 'student1') {
      setStudent1USN(upperValue);
      validateUSN(upperValue, 'student1');
    } else {
      setStudent2USN(upperValue);
      validateUSN(upperValue, 'student2');
    }
  };

  const handleSubmit = async () => {
    if (!selectedTopic || !student1Name || !student2Name || !student1USN || !student2USN) {
      alert("Please fill all fields!");
      return;
    }

    // Validate both USNs
    const isUSN1Valid = validateUSN(student1USN, 'student1');
    const isUSN2Valid = validateUSN(student2USN, 'student2');

    if (!isUSN1Valid || !isUSN2Valid) {
      return;
    }

    setIsSubmitting(true);
    setUsnError(null);

    try {
      // Check for existing USNs
      const existingUSNs = await checkExistingUSNs(student1USN, student2USN);
      
      if (existingUSNs.length > 0) {
        setUsnError(`The following USN(s) have already selected a topic: ${existingUSNs.join(", ")}`);
        setIsSubmitting(false);
        return;
      }

      const topicRef = doc(db, "topics", selectedTopic.id);

      await runTransaction(db, async (transaction) => {
        const topicDoc = await transaction.get(topicRef);
        if (!topicDoc.exists()) throw new Error("Topic does not exist!");

        const topicData = topicDoc.data();
        if (topicData.taken) {
          throw new Error("This topic has already been taken!");
        }

        transaction.update(topicRef, { taken: true });

        const timestamp = new Date();
        await addDoc(collection(db, "responses"), {
          topicId: selectedTopic.id,
          topicTitle: selectedTopic.title,
          student1Name,
          student1USN,
          student2Name,
          student2USN,
          timestamp,
        });

        // Save to localStorage
        const selectionState: TopicSelectionState = {
          topicId: selectedTopic.id,
          topicTitle: selectedTopic.title,
          student1Name,
          student1USN,
          student2Name,
          student2USN,
          timestamp: timestamp.toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectionState));

        router.push("/progress");
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe filtering of topics
  const availableTopics = topics.filter(topic => topic && !topic.taken);
  const selectedTopic = topics.find(topic => topic && topic.id === selectedTopicId);
  const filteredTopics = availableTopics.filter(topic => 
    topic && topic.title && topic.title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="container py-8 space-y-8">
      {/* Title Section */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Choose Your Project Topic
        </h1>
      </div>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {!isConfirmed ? (
          <TopicTable
            topics={filteredTopics}
            loading={loading}
            selectedTopicId={selectedTopicId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTopicSelect={setSelectedTopicId}
            onConfirm={() => setIsConfirmed(true)}
          />
        ) : (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <StudentForm
                selectedTopic={selectedTopic}
                student1Name={student1Name}
                student1USN={student1USN}
                student2Name={student2Name}
                student2USN={student2USN}
                isSubmitting={isSubmitting}
                onStudent1NameChange={setStudent1Name}
                onStudent1USNChange={(value) => handleUSNChange(value, 'student1')}
                onStudent2NameChange={setStudent2Name}
                onStudent2USNChange={(value) => handleUSNChange(value, 'student2')}
                onBack={() => {
                  setIsConfirmed(false);
                  setSelectedTopicId(null);
                }}
                onSubmit={handleSubmit}
                usnError={usnError}
                usnErrors={usnErrors}
              />
            </CardContent>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
}
