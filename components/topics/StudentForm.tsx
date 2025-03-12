import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Topic {
  id: string;
  title: string;
  taken: boolean;
}

interface StudentFormProps {
  selectedTopic: Topic | undefined;
  student1Name: string;
  student1USN: string;
  student2Name: string;
  student2USN: string;
  isSubmitting: boolean;
  onStudent1NameChange: (value: string) => void;
  onStudent1USNChange: (value: string, field: 'student1') => void;
  onStudent2NameChange: (value: string) => void;
  onStudent2USNChange: (value: string, field: 'student2') => void;
  onBack: () => void;
  onSubmit: () => void;
  usnError: string | null;
  usnErrors?: {
    student1: string;
    student2: string;
  };
}

export function StudentForm({
  selectedTopic,
  student1Name,
  student1USN,
  student2Name,
  student2USN,
  isSubmitting,
  onStudent1NameChange,
  onStudent1USNChange,
  onStudent2NameChange,
  onStudent2USNChange,
  onBack,
  onSubmit,
  usnError,
  usnErrors = { student1: "", student2: "" }
}: StudentFormProps) {
  return (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
        <p className="text-center text-lg">
          You selected: <span className="font-semibold text-primary">{selectedTopic?.title}</span>
        </p>
      </div>

      {usnError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
          {usnError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Team Member 1 */}
        <div className="space-y-4">
          <div className="text-lg font-semibold text-center mb-4 bg-muted rounded-lg py-2">
            Team Member 1
          </div>
          <Input
            type="text"
            placeholder="Enter first student's name"
            value={student1Name}
            onChange={(e) => onStudent1NameChange(e.target.value)}
            disabled={isSubmitting}
            className="border-border/50 focus:border-primary/50"
          />
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Enter first student's USN"
              value={student1USN}
              onChange={(e) => onStudent1USNChange(e.target.value, 'student1')}
              disabled={isSubmitting}
              className={cn(
                "border-border/50 focus:border-primary/50",
                usnErrors.student1 && "border-destructive focus:border-destructive"
              )}
            />
            {usnErrors.student1 && (
              <p className="text-sm text-destructive px-1">{usnErrors.student1}</p>
            )}
          </div>
        </div>

        {/* Team Member 2 */}
        <div className="space-y-4">
          <div className="text-lg font-semibold text-center mb-4 bg-muted rounded-lg py-2">
            Team Member 2
          </div>
          <Input
            type="text"
            placeholder="Enter second student's name"
            value={student2Name}
            onChange={(e) => onStudent2NameChange(e.target.value)}
            disabled={isSubmitting}
            className="border-border/50 focus:border-primary/50"
          />
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Enter second student's USN"
              value={student2USN}
              onChange={(e) => onStudent2USNChange(e.target.value, 'student2')}
              disabled={isSubmitting}
              className={cn(
                "border-border/50 focus:border-primary/50",
                usnErrors.student2 && "border-destructive focus:border-destructive"
              )}
            />
            {usnErrors.student2 && (
              <p className="text-sm text-destructive px-1">{usnErrors.student2}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="outline"
          className="w-full sm:flex-1 hover:bg-muted/50 transition-colors"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back to Topics
        </Button>
        <Button
          onClick={onSubmit}
          className="w-full sm:flex-1 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all"
          disabled={isSubmitting || !!usnErrors.student1 || !!usnErrors.student2}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit Project Selection"
          )}
        </Button>
      </div>
    </motion.div>
  );
} 