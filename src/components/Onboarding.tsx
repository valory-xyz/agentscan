"use client";

import { motion as m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface OnboardingProps {
  onStartChat: () => void;
}

export default function Onboarding({ onStartChat }: OnboardingProps) {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-4 md:gap-8 h-screen px-4 md:px-8">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 md:space-y-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-purple-600">
          Welcome to agentscan
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          Your AI-powered guide to understanding and exploring Olas AI agents.
          Ask questions, get examples, and learn how to build your own
          autonomous agents.
        </p>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onStartChat}
          className="bg-purple-600 hover:bg-purple-700 text-white text-lg md:text-xl px-8 py-6 rounded-xl"
        >
          Start Chatting with Andy
          <Send className="ml-2 h-5 w-5" />
        </Button>
      </m.div>
    </div>
  );
}
