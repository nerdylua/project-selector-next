'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, runTransaction, addDoc } from "firebase/firestore";
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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "topics"));
        const topicsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Topic[];
        setTopics(topicsData);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const availableTopics = topics.filter(topic => !topic.taken);
  const selectedTopic = topics.find(topic => topic.id === selectedTopicId);

  const filteredTopics = availableTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedTopic || !student1Name || !student2Name) {
      alert("Please fill all fields!");
      return;
    }

    const topicRef = doc(db, "topics", selectedTopic.id);

    try {
      await runTransaction(db, async (transaction) => {
        const topicDoc = await transaction.get(topicRef);
        if (!topicDoc.exists()) throw new Error("Topic does not exist!");

        const topicData = topicDoc.data();
        if (topicData.taken) {
          throw new Error("This topic has already been taken!");
        }

        transaction.update(topicRef, { taken: true });

        await addDoc(collection(db, "responses"), {
          topicId: selectedTopic.id,
          topicTitle: selectedTopic.title,
          student1Name,
          student2Name,
          timestamp: new Date(),
        });

        router.push("/progress");
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
              Choose Your Project Topic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div
                  key="topic-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="rounded-lg border bg-card">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80%]">Topic Title</TableHead>
                            <TableHead className="w-[20%]">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTopics.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center text-muted-foreground">
                                No topics found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredTopics.map((topic) => (
                              <TableRow 
                                key={topic.id}
                                className={cn(
                                  "cursor-pointer transition-colors",
                                  selectedTopicId === topic.id ? "bg-muted" : "hover:bg-muted/50"
                                )}
                                onClick={() => setSelectedTopicId(topic.id)}
                              >
                                <TableCell className="font-medium">{topic.title}</TableCell>
                                <TableCell>
                                  <Button
                                    variant={selectedTopicId === topic.id ? "default" : "ghost"}
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTopicId(topic.id);
                                      setIsConfirmed(true);
                                    }}
                                  >
                                    Select
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-muted p-6 rounded-lg border">
                    <p className="text-center mb-4">
                      You selected: <span className="font-semibold text-primary">{selectedTopic?.title}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Enter first student's name"
                      value={student1Name}
                      onChange={(e) => setStudent1Name(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Enter second student's name"
                      value={student2Name}
                      onChange={(e) => setStudent2Name(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      className="w-full sm:flex-1 hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setIsConfirmed(false);
                        setSelectedTopicId(null);
                      }}
                    >
                      Back to Topics
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="w-full sm:flex-1 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all"
                    >
                      Submit Project Selection
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
