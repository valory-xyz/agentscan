/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AnimatedRobot from "./AnimatedRobot";
import { ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatComponentProps {
  onSend?: (message: string) => Promise<void>;
  initialMessage?: string;
  messages?: Message[];
  placeholder?: string;
  onExternalLinkClick?: (url: string) => void;
  children?: React.ReactNode;
  exampleQuestions?: string[];
}

export default function ChatComponent({
  onSend,
  initialMessage = "Hi there",
  messages: propMessages = [],
  placeholder = "Send a message to this agent...",
  onExternalLinkClick,
  exampleQuestions = [],
}: ChatComponentProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [showExampleQuestions, setShowExampleQuestions] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const messages = useMemo(() => {
    const initialMessageObj = {
      role: "assistant" as const,
      content: initialMessage,
    };

    return [initialMessageObj, ...propMessages];
  }, [propMessages, initialMessage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
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

    // Scroll to bottom after new messages render
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }, [messages, userScrolled]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);

      if (onSend) {
        await onSend(message);
      }
      setMessage("");
    } catch {
      toast({
        title: "Error sending message",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = async (question: string) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      if (onSend) {
        await onSend(question);
      }
    } catch {
      toast({
        title: "Error sending message",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-2 pb-2 min-h-0"
      >
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex mb-4 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-3 max-w-[80%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-purple-100">
                    <AnimatedRobot scale={0.2} />
                  </AvatarFallback>
                </Avatar>
              )}
              <motion.div
                initial="initial"
                animate="animate"
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`rounded-2xl px-4 py-2 shadow-sm break-words ${
                  message.role === "user"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <div
                  className={`prose prose-sm max-w-none ${
                    message.role === "user" ? "prose-invert text-white" : ""
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-0 text-[15px]">{children}</p>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (onExternalLinkClick && href) {
                              onExternalLinkClick(href);
                            }
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          {children} <ExternalLink className="inline h-3 w-4" />
                        </a>
                      ),
                      code: ({ children }) => (
                        <code className="bg-muted-foreground/20 rounded px-1 py-0.5 text-xs">
                          {children}
                        </code>
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
          <div className="flex mb-4 py-4 justify-start">
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
      </div>

      <div className="bg-white border-t border-gray-200 p-2">
        {exampleQuestions.length > 0 && (
          <div className="flex flex-col gap-2 mb-2">
            <button
              onClick={() => setShowExampleQuestions(!showExampleQuestions)}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2"
            >
              {showExampleQuestions ? "Hide examples" : "Show examples"}
              {showExampleQuestions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showExampleQuestions && (
              <div className="flex flex-wrap gap-2 justify-center">
                {(isMobile
                  ? exampleQuestions.slice(0, 3)
                  : exampleQuestions
                ).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleQuestionClick(question)}
                    className="text-gray-600 hover:text-gray-800 text-sm py-1 px-4 whitespace-normal text-left"
                    disabled={isLoading}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full h-12 pl-4 pr-12 text-sm rounded-full border-gray-200"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
            disabled={isLoading || !message.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
