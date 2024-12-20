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
}

export default function ChatComponent({
  onSend,
  initialMessage = "Hi there",
  messages: propMessages = [],
  placeholder = "Send a message to this agent...",
  onExternalLinkClick,
}: ChatComponentProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [userScrolled, setUserScrolled] = useState(false);

  const messages = useMemo(() => {
    const initialMessageObj = {
      role: "assistant" as const,
      content: initialMessage,
    };

    // Always include initial message at the start
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

    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }, [messages, userScrolled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);

      if (onSend) {
        await onSend(message);
      }
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px]">
      <div ref={messagesContainerRef} className="flex-1 mb-4 overflow-y-auto">
        <div className="space-y-4 px-2">
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
                    initial: {
                      opacity: 0,
                      y: 10,
                    },
                    animate: { opacity: 1, y: 0 },
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className={`rounded-2xl px-4 py-2 shadow-sm ${
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
                            {children}{" "}
                            <ExternalLink className="inline h-3 w-4" />
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
        </div>
        {isLoading && (
          <div className="flex mb-4 justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative px-4">
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
          className="absolute right-6 top-2 h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
