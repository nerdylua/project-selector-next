import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface TimerDisplayProps {
  value: string;
  label: string;
}

export function TimerDisplay({ value, label }: TimerDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <div className="p-6 text-center">
          <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent block">
            {value}
          </span>
          <span className="text-sm text-muted-foreground mt-2 block">
            {label}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      </Card>
    </motion.div>
  );
} 