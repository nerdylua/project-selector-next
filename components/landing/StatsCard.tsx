import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  delay?: number;
}

export function StatsCard({ title, value, icon, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-6 border-border/50 hover:border-border/80 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2 bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
              {value}
            </h3>
          </div>
          {icon && (
            <div className="p-2 bg-muted rounded-lg">
              {icon}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
} 