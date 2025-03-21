/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { ExternalLink, Loader2, Copy, Check } from "lucide-react";
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

    const currentMessage = message;

    try {
      setIsLoading(true);
      if (onSend) {
        await onSend(currentMessage);
        setMessage("");
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setMessage((prev) => prev + "\n");
      } else {
        handleSubmit(e);
      }
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;

      if (textarea.scrollHeight > 400) {
        requestAnimationFrame(() => {
          textarea.scrollTop = textarea.scrollHeight;
        });
      }
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
                      code: ({
                        inline,
                        children,
                        ...props
                      }: {
                        node?: any;
                        inline?: boolean;
                        children?: any;
                      }) => {
                        const code = String(children).replace(/\n$/, "");
                        if (inline) {
                          return (
                            <code
                              className="bg-muted-foreground/20 rounded px-1 py-0.5 text-xs"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                        return (
                          <div className="relative group">
                            <button
                              onClick={() => handleCopyCode(code)}
                              className="absolute right-2 top-2 p-1 rounded bg-gray-800/30 hover:bg-gray-800/50 invisible group-hover:visible"
                            >
                              {copiedCode === code ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-300" />
                              )}
                            </button>
                            <code className="block bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto select-text">
                              {code}
                            </code>
                          </div>
                        );
                      },
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
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full min-h-[56px] max-h-[400px] pl-4 pr-12 py-4 text-sm rounded-2xl border border-gray-200 resize-none"
            disabled={isLoading}
            rows={1}
            style={{
              lineHeight: "1.5",
              overflowY: "auto",
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-3 h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
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
