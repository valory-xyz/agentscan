"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, Bot, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedRobot from '@/components/AnimatedRobot';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const humanoidAnimation = {
  opacity: [0, 1],
  y: [20, 0],
  transition: {
    duration: 1,
    ease: "easeOut"
  }
};

const textAnimation = {
  opacity: [0, 1],
  x: [-20, 0],
  transition: {
    delay: 1,
    duration: 0.8,
    ease: "easeOut"
  }
};

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [query, setQuery] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi there 👋 - this is Andy the agent. What would you like to learn about me?`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exampleQuestions = [
    "What is an OLAS Agent?",
    "What activities can OLAS agents do?",
    "How can I launch my own agent?",
    "How many agents exist today?",
    "How can agents interact with each other?"
  ];

  const router = useRouter();

  const [showExternalDialog, setShowExternalDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');

  const ExternalLinkDialog = () => (
    <AlertDialog open={showExternalDialog} onOpenChange={setShowExternalDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leaving Agentscan</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to leave Agentscan to visit an external website. Please note that we cannot guarantee the safety or reliability of external sites. Use any external software at your own risk.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            window.open(pendingUrl, '_blank');
            setShowExternalDialog(false);
          }}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(messagesEndRef.current);
      return () => observer.disconnect();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);
    const newMessages = [...messages, userMessage];

    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: query,
          messages: newMessages,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      // Add initial assistant message
      const assistantMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";
      let textContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value);

        const chunks = buffer.split("\n\n");

        buffer = chunks.pop() || ""; // Keep the last incomplete chunk

        for (const chunk of chunks) {
          if (chunk.trim()) {
            try {
              const data = JSON.parse(chunk);
              console.log("data", data);

              if (data.done) {
                setIsLoading(false);
                return;
              }

              if (data.error) {
                throw new Error(data.error);
              }

              if (data.content) {
                textContent += data.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  lastMessage.content = textContent;
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      handleError();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to handle errors
  const handleError = () => {
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage.role === "assistant" && !lastMessage.content) {
        lastMessage.content =
          "Sorry, there was an error processing your request. Please try again.";
      }
      return newMessages;
    });
    setIsLoading(false);
  };

  const handleQuestionClick = (question: string) => {
    setQuery(question);
    handleSubmit(new Event("submit") as unknown as React.FormEvent<Element>);
  };

  const Logo = ({ size = "large" }: { size?: "large" | "small" }) => {
    const router = useRouter();

    return (
      <div className="fixed top-0 left-0 right-0 bg-white z-50 pt-8 pb-6 px-4">
        <div className="text-center cursor-pointer max-w-screen-xl mx-auto">
          <div className={`flex justify-center items-center gap-14 mb-6`}>
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className={`
                  ${size === "large" ? "w-12 h-12" : "w-8 h-8"}
                  transition-all
                  hover:scale-110
                `}
                style={{
                  background: '#A855F7',
                  transform: 'rotate(45deg)',
                  aspectRatio: '1',
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  filter: 'drop-shadow(0 4px 12px rgba(168, 85, 247, 0.15))'
                }}
              />
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">agentscan</h1>
          <p className="text-gray-500 text-xl">An OLAS Explorer</p>
        </div>
      </div>
    );
  };

  const BackgroundStars = () => {
    const stars = Array(20).fill(null);
    
    return (
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-purple-200 text-2xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ⭐
          </motion.span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <motion.main
        className="flex-grow container mx-auto px-4 py-8 max-w-5xl flex flex-col justify-center"
        initial={false}
        animate={showChat ? {
          x: '-100%',
          opacity: 0,
          display: 'none',
        } : {
          x: 0,
          opacity: 1,
          display: 'flex',
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {/* Landing page content */}
        <div className="min-h-screen bg-white flex flex-col relative">
          <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl flex flex-col justify-center relative">
            <Logo />

            <div className="max-w-3xl mx-auto text-center">
              <motion.p 
                className="text-gray-700 text-2xl font-bold italic mb-12 max-w-3xl mx-auto leading-relaxed"
                style={{
                  textShadow: '0 0 1px rgba(0,0,0,0.1)'
                }}
              >
                Chat to learn all about Autonolas - how to setup an agent, how the broader ecosystem works, and other fun questions :)
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 flex justify-center"
              >
                <AnimatedRobot />
              </motion.div>

              {/* Welcome Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mb-12"
              >
                <h2 className="text-4xl font-bold mb-4">
                  👋 Hi, I'm Andy the OLAS Agent
                </h2>
              </motion.div>

              {/* Pulsing Button */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowChat(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xl px-8 py-6 rounded-xl"
                >
                  Chat with Agent
                </Button>
              </motion.div>
            </div>
          </main>
        </div>
      </motion.main>

      <motion.div
        initial={false}
        animate={showChat ? {
          x: 0,
          opacity: 1,
          display: 'block',
        } : {
          x: '100%',
          opacity: 0,
          display: 'none',
        }}
        transition={{ 
          duration: 1.2,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.3
        }}
      >
        {/* Chat interface */}
        <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl flex flex-col justify-center">
          <Logo />

          <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="space-y-6 mb-4 max-h-[60vh] overflow-y-auto">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-100">
                            <motion.svg
                              viewBox="0 0 24 32"
                              className="w-5 h-5 text-purple-500"
                              animate={{
                                opacity: [1, 0.5, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <path
                                d="M12 0L24 16L12 32L0 16L12 0Z"
                                className="fill-current"
                              />
                            </motion.svg>
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-purple-500 text-white" : "bg-muted"
                        }`}
                      >
                        <div className={`prose prose-sm dark:prose-invert max-w-none ${
                          message.role === "user" ? "prose-invert text-white" : ""
                        }`}>
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc ml-4 mb-2">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal ml-4 mb-2">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="mb-1">{children}</li>
                              ),
                              a: ({ href, children }) => (
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPendingUrl(href || '');
                                    setShowExternalDialog(true);
                                  }}
                                  className="text-blue-500 hover:underline"
                                >
                                  {children} <ExternalLink className="inline h-3 w-3" />
                                </a>
                              ),
                              code: ({ children }) => (
                                <code className="bg-muted-foreground/20 rounded px-1 py-0.5 text-xs">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className=" rounded p-2 overflow-x-auto my-2 text-xs">
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="mt-4">
                <form onSubmit={handleSubmit} className="relative mb-4">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask Andy Anything..."
                    className="w-full h-14 pl-5 pr-14"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 top-3 h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>

                <div className="flex flex-wrap gap-2 justify-center">
                  {exampleQuestions.map((question, index) => {
                    const getEmoji = (q: string) => {
                      if (q.includes("What is")) return "🤔";
                      if (q.includes("activities")) return "🎯";
                      if (q.includes("launch")) return "🚀";
                      if (q.includes("how many")) return "📊";
                      if (q.includes("interact")) return "🤝";
                      return "❓";
                    };

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleQuestionClick(question)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {getEmoji(question)} {question}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center space-x-4 mt-8 max-w-3xl mx-auto">
            <Button 
              size="lg"
              onClick={() => {
                setPendingUrl('https://docs.autonolas.network/get_started/');
                setShowExternalDialog(true);
              }}
            >
              Launch your agent
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => {
                setPendingUrl('https://docs.olas.network');
                setShowExternalDialog(true);
              }}
            >
              Documentation
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>
      </motion.div>
      <ExternalLinkDialog />
    </div>
  );
}
