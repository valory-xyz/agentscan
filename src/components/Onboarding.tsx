import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface OnboardingProps {
  onStartChat: () => void;
}

export default function Onboarding({ onStartChat }: OnboardingProps) {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-4 md:gap-8 h-full px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 md:space-y-6"
      >
        <h1 className="text-3xl md:text-6xl font-bold text-purple-600">
          Welcome to agentscan
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto mb-4">
          Your AI-powered guide to understanding and exploring Olas AI agents.
          Ask questions, get examples, and learn how to build your own
          autonomous agents.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onStartChat}
          className="bg-purple-600 hover:bg-purple-700 text-white text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
        >
          Start Chatting with Andy
          <Send className="ml-2 h-4 md:h-5 w-4 md:w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
