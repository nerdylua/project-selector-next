import { motion } from "framer-motion";
import { FORMATTED_START_TIME, FORMATTED_END_TIME } from "@/lib/constants";

export function WelcomeHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 mb-8"
    >
      <div className="relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            EL Topic Selection
          </span>
        </h1>
        <div className="text-center text-muted-foreground max-w-2xl mx-auto">
          <h2 className="font-semibold text-lg text-primary mb-4">Important Instructions:</h2>
          <ul className="text-left space-y-2 list-none mx-auto max-w-xl">
            <li>• Login with your RVCE Google account to start the selection process</li>
            <li>• Topics are allocated on a First Come, First Serve basis</li>
            <li>• Each team must have exactly two members</li>
            <li>• Once a topic is selected, it cannot be changed</li>
            <li>• Both team members' USNs are required and must be unique</li>
            <li>• Selection window: {FORMATTED_START_TIME} to {FORMATTED_END_TIME} IST</li>
          </ul>
          <p className="text-primary font-medium mt-4">
            Note: Make your selection carefully as it's final!
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
    </motion.div>
  );
} 