/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useState, useEffect } from "react";

import { Bot, ExternalLink } from "lucide-react";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { logEvent } from "../lib/amplitude";

import Onboarding from "@/components/Onboarding";
import { useAuth } from "@/hooks/use-auth";
import ChatComponent from "@/components/ChatComponent";
import { useAgent } from "@/contexts/AgentContext";
import { useMessages } from "@/hooks/use-messages";

export default function Home() {
  const { setExternalUrl, setShowAuthDialog } = useAgent();
  const { messages, isLoading, sendMessage } = useMessages({
    teamId: process.env.NEXT_PUBLIC_TEAM_ID,
  });

  const exampleQuestions = [
    "🤖 What is an OLAS Agent?",
    "💡 Give me an example of an OLAS Agent",
    "📈 How does the trader agent work?",
    "🛠️ How do I make my own agent?",
    "💰 Can you tell me how to stake OLAS in the easiest way possible?",
    "📚 Give me content I can look at to learn more about OLAS",
  ];

  const [showLanding, setShowLanding] = useState(true);
  const [hasSeenLanding, setHasSeenLanding] = useState(false);

  useEffect(() => {
    const hasSeenBefore = localStorage.getItem("hasSeenLanding") === "true";
    setHasSeenLanding(hasSeenBefore);
    setShowLanding(!hasSeenBefore);
  }, []);

  const handleStartChat = () => {
    setShowLanding(false);
    localStorage.setItem("hasSeenLanding", "true");
    setHasSeenLanding(true);

    if (!hasSeenLanding) {
      logEvent("landing_page_viewed", {
        teamId: process.env.NEXT_PUBLIC_TEAM_ID || "",
      });
    }
    setShowOnboarding(false);
    localStorage.setItem("hasSeenOnboarding", "true");
    logEvent("chat_started", {
      teamId: process.env.NEXT_PUBLIC_TEAM_ID || "",
    });
  };

  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const hasSeenOnboarding =
      localStorage.getItem("hasSeenOnboarding") === "true";
    setShowOnboarding(!hasSeenOnboarding);
  }, []);

  return (
    <div className="bg-white flex flex-col min-h-screen justify-center">
      {showLanding || showOnboarding ? (
        <motion.main
          className="flex flex-col h-screen items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <Onboarding onStartChat={handleStartChat} />
        </motion.main>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <main className="flex-grow w-full h-full mx-auto px-2 md:px-4 py-2 max-w-6xl flex flex-col justify-center">
            <Card className="w-full mx-auto h-[70vh] flex flex-col">
              <div className="p-2 border-b flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLanding(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  About agentscan
                </Button>
              </div>
              <CardContent className="p-2 md:p-4 flex flex-col h-full overflow-hidden">
                <ChatComponent
                  onSend={sendMessage}
                  messages={messages}
                  initialMessage="Hi there 👋 - this is Andy the agent. What would you like to learn about me?"
                  placeholder="Ask Andy Anything..."
                  onExternalLinkClick={(url) => setExternalUrl(url)}
                  exampleQuestions={exampleQuestions}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-8 max-w-3xl mx-auto px-2">
              <Button
                variant="outline"
                className="w-full md:w-auto text-white bg-purple-600 hover:bg-white hover:text-black"
                onClick={() => {
                  setExternalUrl("https://operate.olas.network/agents");
                }}
              >
                Launch your agent
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full md:w-auto bg-black text-white hover:bg-white"
                onClick={() => {
                  setExternalUrl("https://olas.network/learn");
                }}
              >
                Learn more
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </main>
        </motion.div>
      )}
      <Toaster />
    </div>
  );
}
