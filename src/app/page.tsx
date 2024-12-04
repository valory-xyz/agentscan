/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";

import { Send, Bot, ExternalLink, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedRobot from "@/components/AnimatedRobot";
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { logEvent } from "../lib/amplitude";
import ExternalLinkDialog from "@/components/ExternalLinkDialog";
import Onboarding from "@/components/Onboarding";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { isAuthenticated, login, getAccessToken } = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [userScrolled, setUserScrolled] = useState(false);

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
    "Give me an example of an OLAS Agent",
    "How does the trader agent work?",
    "How do I make my own agent?",
    "Can you tell me how to stake OLAS in the easiest way possible?",
    "Give me content I can look at to learn more about OLAS",
  ];

  const mobileExampleQuestions = exampleQuestions.slice(0, 3);

  const [externalUrl, setExternalUrl] = useState<string | null>(null);

  const cleanUrl = (url: string) => url.replace(/\/+$/, "");

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Check if user has scrolled up
      const isScrolledUp =
        container.scrollHeight - container.scrollTop - container.clientHeight >
        50;
      setUserScrolled(isScrolledUp);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || userScrolled) return;

    // Only auto-scroll if user hasn't scrolled up
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }, [messages, userScrolled]);

  const [isStreaming, setIsStreaming] = useState(false);

  const { toast } = useToast();

  const [questionCount, setQuestionCount] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const sendMessage = async (question: string, currentMessages: any[]) => {
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const accessToken = await getAccessToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            question,
            messages: currentMessages,
            teamId: process.env.NEXT_PUBLIC_TEAM_ID,
          }),
        }
      );

      if (response.status === 429) {
        const data = await response.json();

        if (
          data.error ===
          "You have reached the maximum number of free requests. Please sign in to continue using the service."
        ) {
          setShowAuthDialog(true);
          setMessages((prev) => prev.slice(0, -1));
          setIsLoading(false);
          setIsStreaming(false);
          return;
        }
        toast({
          variant: "destructive",
          title: data.message || "Please try again later",
        });
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      if (!response.ok) throw new Error("Network response was not ok");

      // Add initial assistant message
      const assistantMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            try {
              const jsonStr = line.replace(/^data: /, "").trim();
              const parsed = JSON.parse(jsonStr);

              if (parsed.content) {
                fullContent += parsed.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  lastMessage.content = fullContent;
                  return newMessages;
                });
              }
            } catch (e) {
              continue;
            }
          }
        }
      }

      if (buffer.trim()) {
        try {
          const jsonStr = buffer.replace(/^data: /, "").trim();
          const parsed = JSON.parse(jsonStr);
          if (parsed.content) {
            fullContent += parsed.content;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              lastMessage.content = fullContent;
              return newMessages;
            });
          }
        } catch (e) {}
      }
    } catch (error: any) {
      console.log("Error:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleQuestionClick = async (question: string) => {
    if (isLoading || isStreaming) return;

    // Set query and wait for state update
    setQuery(question);

    // Use the question directly instead of relying on query state
    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    const newMessages = [...messages, userMessage];
    await sendMessage(question, newMessages);
  };

  const getEmoji = (q: string) => {
    switch (q) {
      case "What is an OLAS Agent?":
        return "🤖";
      case "Give me an example of an OLAS Agent":
        return "💡";
      case "How does the trader agent work?":
        return "📈";
      case "How do I make my own agent?":
        return "🛠️";
      case "Can you tell me how to stake OLAS in the easiest way possible?":
        return "💰";
      case "Give me content I can look at to learn more about OLAS":
        return "📚";
      default:
        return "❓";
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || isStreaming) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    const newMessages = [...messages, userMessage];
    await sendMessage(query, newMessages);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto mb-4 min-h-0"
                >
                  {messages.map((message, i) => (
                    <div
                      key={i}
                      className={`flex mb-4 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[80%] ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <div
                          className={`${
                            message.role === "user" ? "hidden" : "block"
                          }`}
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-purple-100">
                              <AnimatedRobot scale={0.2} />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <motion.div
                          initial="initial"
                          animate="animate"
                          variants={{
                            initial: {
                              opacity: 0,
                              x: message.role === "user" ? 20 : -20,
                            },
                            animate: { opacity: 1, x: 0 },
                          }}
                          transition={{
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          className={`rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-purple-500 text-white"
                              : "bg-muted"
                          }`}
                        >
                          <div
                            className={`prose prose-sm dark:prose-invert max-w-none ${
                              message.role === "user"
                                ? "prose-invert text-white"
                                : ""
                            }`}
                          >
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
                                a: ({ href, children }) => {
                                  return (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setExternalUrl(href || null);
                                      }}
                                      className="text-blue-500 hover:underline"
                                    >
                                      {children}{" "}
                                      <ExternalLink className="inline h-3 w-4" />
                                    </a>
                                  );
                                },
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
                        </motion.div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex mb-4 justify-start">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-purple-100">
                            <AnimatedRobot scale={0.2} />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="shrink-0 mt-auto">
                  <form
                    onSubmit={handleSubmit}
                    className="relative mb-2 md:mb-4"
                  >
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask Andy Anything..."
                      className="w-full h-12 md:h-14 pl-3 md:pl-5 pr-12 md:pr-14 text-sm md:text-base"
                      disabled={isLoading || isStreaming}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-2 top-2 md:top-3 h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isLoading || isStreaming || !query.trim()}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>

                  <div className="flex flex-wrap gap-1 md:gap-2 justify-center mb-2 shrink-0">
                    {(isMobile ? mobileExampleQuestions : exampleQuestions).map(
                      (question, index) => {
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleQuestionClick(question)}
                            className="text-gray-600 hover:text-gray-800 text-sm py-1 px-4"
                          >
                            {getEmoji(question)} {question}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground text-center shrink-0">
                    Agentscan can make mistakes. Check important info.
                  </p>
                </div>
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
      <ExternalLinkDialog
        url={externalUrl}
        onClose={() => setExternalUrl(null)}
        onConfirm={(url) => {
          logEvent("external_link_clicked", {
            url: cleanUrl(url),
            teamId: process.env.NEXT_PUBLIC_TEAM_ID || "",
          });
          window.open(cleanUrl(url), "_blank");
          setExternalUrl(null);
        }}
      />
      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please sign in to continue using agentscan. Signing in helps us
              provide a better experience and prevent abuse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                login();
                setShowAuthDialog(false);
              }}
            >
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}
