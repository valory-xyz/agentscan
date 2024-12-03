import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface OnboardingProps {
  onStartChat: () => void;
}

export default function Onboarding({ onStartChat }: OnboardingProps) {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-purple-600">
          Welcome to agentscan
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-4">
          Your AI-powered guide to understanding and exploring OLAS AI agents.
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
          className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6"
        >
          Start Chatting with Andy
          <Send className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
