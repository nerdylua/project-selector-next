'use client';

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SectionSelectionPage() {
  const router = useRouter();

  const handleSectionSelect = (section: "A" | "B") => {
    router.push(`/topics?section=${section}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card text-card-foreground rounded-lg shadow-lg border p-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-center mb-8"
          >
            Choose Your Section
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-center mb-8"
          >
            Select the section you belong to continue with topic selection
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => handleSectionSelect("A")}
              className="group relative overflow-hidden rounded-lg bg-primary text-primary-foreground px-8 py-6 
                       transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 
                       focus:ring-ring focus:ring-offset-2"
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">Section A</h2>
                <p className="text-primary-foreground/80">First Section</p>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => handleSectionSelect("B")}
              className="group relative overflow-hidden rounded-lg bg-primary text-primary-foreground px-8 py-6 
                       transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 
                       focus:ring-ring focus:ring-offset-2"
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">Section B</h2>
                <p className="text-primary-foreground/80">Second Section</p>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
