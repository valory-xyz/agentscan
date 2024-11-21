"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface AgentMetadata {
  image?: string;
  operator?: string;
  name?: string;
  description?: string;
}
export default function Home() {
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
    "What are some example transactions OLAS agents have done?",
    "What services can OLAS run?",
    "How many agents exist today?",
  ];

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

    try {
      const response = await fetch("http://localhost:4000/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: query,
          messages: messages.slice(1),
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <Card className="w-full">
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
                          <svg
                            viewBox="0 0 24 32"
                            className="w-5 h-5 text-purple-500"
                          >
                            <path
                              d="M12 0L24 16L12 32L0 16L12 0Z"
                              className="fill-current"
                            />
                          </svg>
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-purple-500 " : "bg-muted"
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
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
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Message Andy the agent..."
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
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center space-x-4 mt-8">
          <Button asChild size="lg">
            <Link href="https://docs.autonolas.network/get_started/">
              Launch your agent
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            <Link href="https://docs.olas.network">Documentation</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
