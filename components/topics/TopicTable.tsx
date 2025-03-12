import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Topic {
  id: string;
  title: string;
  taken: boolean;
}

interface TopicTableProps {
  topics: Topic[];
  loading: boolean;
  selectedTopicId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTopicSelect: (topicId: string) => void;
  onConfirm: () => void;
}

export function TopicTable({
  topics,
  loading,
  selectedTopicId,
  searchQuery,
  onSearchChange,
  onTopicSelect,
  onConfirm,
}: TopicTableProps) {
  return (
    <motion.div
      key="topic-selection"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Search Bar Section */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex items-center flex-1 max-w-sm">
          <div className="absolute left-3 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-background border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="relative rounded-xl border border-border/50 bg-card/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50 bg-muted/50">
                  <TableHead className="h-12 px-6 text-base font-semibold text-primary/80 w-24">S.No</TableHead>
                  <TableHead className="h-12 px-6 text-base font-semibold text-primary/80">Topic Title</TableHead>
                  <TableHead className="h-12 px-6 text-base font-semibold text-primary/80 text-right w-32">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No topics found
                    </TableCell>
                  </TableRow>
                ) : (
                  topics.map((topic, index) => (
                    <TableRow 
                      key={topic.id}
                      className={cn(
                        "h-16 cursor-pointer transition-all border-b border-border/50 hover:bg-muted/50",
                        selectedTopicId === topic.id && "bg-primary/5 hover:bg-primary/10"
                      )}
                      onClick={() => onTopicSelect(topic.id)}
                    >
                      <TableCell className="px-6 font-medium w-24">{index + 1}</TableCell>
                      <TableCell className="px-6 font-medium">{topic.title}</TableCell>
                      <TableCell className="px-6 text-right w-32">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "rounded-full font-medium transition-all px-4",
                            selectedTopicId === topic.id
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTopicSelect(topic.id);
                            onConfirm();
                          }}
                        >
                          Select →
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </motion.div>
  );
} 