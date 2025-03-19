/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAgent } from "@/contexts/AgentContext";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { env } from "next-runtime-env";
import { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";

interface Transaction {
  id: string;
  timestamp: number;
  agent: {
    image: string;
    name: string;
    description: string;
    codeUri: string;
    timestamp: number;
  };
}

interface TransactionsResponse {
  transactions: Transaction[];
  nextCursor: string | null;
}

export default function TransactionsPage() {
  const { setExternalUrl } = useAgent();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const activeRequestRef = useRef<boolean>(false);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && nextCursor && !loading) {
        fetchTransactions(nextCursor);
      }
    },
    [nextCursor, loading]
  );

  const fetchTransactions = async (cursor?: string) => {
    if (loading || activeRequestRef.current) return;

    try {
      setLoading(true);
      activeRequestRef.current = true;

      const url = new URL(`${env("NEXT_PUBLIC_API_URL")}/agents`);
      if (cursor) {
        url.searchParams.append("cursor", cursor);
      }

      const response = await fetch(url.toString());
      const data: TransactionsResponse = await response.json();

      if (data.transactions.length > 0) {
        setTransactions((prev) => [...prev, ...data.transactions]);
      }
      setNextCursor(data.nextCursor);

      // Set initialFetchDone after first fetch
      if (!cursor) {
        setInitialFetchDone(true);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      activeRequestRef.current = false;
    }
  };

  // Initial fetch
  useEffect(() => {
    setTransactions([]);
    setNextCursor(null);
    setInitialFetchDone(false);
    fetchTransactions();
  }, []);

  // Only set up the intersection observer after initial fetch and when we have a cursor
  useEffect(() => {
    if (!initialFetchDone || !nextCursor) return;

    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver, initialFetchDone, nextCursor]);

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp * 1000; // Convert timestamp to milliseconds

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="">
      <div className="container mx-auto px-8 py-16">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 mt-8">
          Highlighted Agents
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {transactions.map((tx, index) => (
            <Link
              key={index}
              href={`/agent/${tx.id}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tx.agent.image}
                  alt={tx.agent.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-white text-sm">
                    Active {getRelativeTime(tx.timestamp)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (href) {
                              setExternalUrl(href);
                            }
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          {children} <ExternalLink className="inline h-3 w-4" />
                        </a>
                      ),
                    }}
                  >
                    {tx.agent.name}
                  </ReactMarkdown>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {tx.agent.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading Indicator */}
        <div
          ref={observerTarget}
          className="w-full flex items-center justify-center mt-12"
        >
          {loading && (
            <div className="flex items-center space-x-2 text-purple-600">
              <div className="w-2 h-2 rounded-full animate-bounce bg-purple-600"></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce bg-purple-600"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce bg-purple-600"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
