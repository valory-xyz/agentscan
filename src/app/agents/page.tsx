/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";

import { useEffect, useState, useRef, useCallback } from "react";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchTransactions = async (cursor?: string) => {
    if (loading) return;

    try {
      setLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/agents`);
      if (cursor) {
        url.searchParams.append("cursor", cursor);
      }

      const response = await fetch(url.toString());
      const data: TransactionsResponse = await response.json();

      if (data.transactions.length > 0) {
        setTransactions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const newTransactions = data.transactions.filter(
            (t) => !existingIds.has(t.id)
          );
          return [...prev, ...newTransactions];
        });
      }
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTransactions([]);
    setNextCursor(null);
    fetchTransactions();
  }, []);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && nextCursor && !loading) {
        const timeoutId = setTimeout(() => {
          fetchTransactions(nextCursor);
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    },
    [nextCursor, loading]
  );

  useEffect(() => {
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
  }, [handleObserver]);

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
    <div className="container mx-auto px-4 pt-20">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Recent Agents</h1>
        <p className="text-gray-500">Latest active Autonolas agents</p>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            {/* Agent Image */}
            <img
              src={tx.agent.image}
              alt={tx.agent.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />

            {/* Agent Name */}
            <h3 className="text-lg font-semibold mb-2 truncate">
              {tx.agent.name}
            </h3>

            {/* Agent Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {tx.agent.description}
            </p>

            {/* Last Active */}
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">Last Active:</span>
              <span className="text-gray-600">
                {getRelativeTime(tx.timestamp)}
              </span>
            </div>

            {/* Learn More Button */}
            <Link href={`/agent/${tx.id}`} className="mt-4 block w-full">
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                View Agent
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div
        ref={observerTarget}
        className="w-full h-10 flex items-center justify-center mt-4"
      >
        {loading && <div className="text-gray-500">Loading more agents...</div>}
      </div>
    </div>
  );
}
