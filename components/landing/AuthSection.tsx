import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "firebase/auth";

interface AuthSectionProps {
  user: User | null;
  isFormOpen: boolean;
  onEnter: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function AuthSection({
  user,
  isFormOpen,
  onEnter,
  onLogin,
  onLogout,
}: AuthSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      {user ? (
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {user.displayName}
            </p>
          </div>

          <div className="space-y-4">
            {isFormOpen ? (
              <Button
                onClick={onEnter}
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Enter Selection Portal →
              </Button>
            ) : (
              <Button
                disabled
                className="w-full bg-muted text-muted-foreground cursor-not-allowed"
              >
                Form Opens Soon
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full border-border/50 hover:bg-muted/50 transition-colors"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          onClick={onLogin}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Sign in with Google →
        </Button>
      )}
    </motion.div>
  );
} 