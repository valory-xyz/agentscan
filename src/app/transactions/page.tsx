// src/app/transactions/page.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

interface Transaction {
  transactionHash: string;
  agentInstance: {
    id: string;
    agent: {
      name: string;
      description: string;
    }
  };
  chain: string;
  timestamp: number;
  link: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  nextCursor: string | null;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const observerTarget = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const fetchTransactions = async (cursor?: string) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/transactions`);
      if (cursor) {
        url.searchParams.append('cursor', cursor);
      }
      if (selectedChain !== 'all') {
        url.searchParams.append('chain', selectedChain);
      }
      
      const response = await fetch(url.toString());
      const data: TransactionsResponse = await response.json();
      
      if (cursor) {
        setTransactions(prev => [...prev, ...data.transactions]);
      } else {
        setTransactions(data.transactions);
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
  }, [selectedChain]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && nextCursor && !loading) {
        fetchTransactions(nextCursor);
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
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20">

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-gray-500">Recent Autonolas agent transactions</p>
      </div>

      {/* Add Chain Filter */}
      <div className="mb-6">
        <select
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Chains</option>
          <option value="gnosis">Gnosis</option>
          <option value="base">Base</option>
          <option value="mainnet">Ethereum Mainnet</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Hash</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Agent</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Time</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500">Agent Link</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={tx.transactionHash} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <a href={tx.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {tx.transactionHash.slice(0, 6)}...{tx.transactionHash.slice(-4)}
                    </a>
                    <svg
                      className="w-4 h-4 ml-2 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </td>
                <td className="py-4 px-4">{tx.agentInstance.agent.name}</td>
                <td className="py-4 px-4">{tx.agentInstance.agent.description}</td>
                <td className="py-4 px-4 text-right text-gray-500">
                  {getRelativeTime(tx.timestamp)}
                </td>
                <td className="py-4 px-4 text-center">
                  <Link href={`/agent/${tx.agentInstance.id}`}>
                    <button className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-purple-100 transition-colors">
                      Learn More
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add this after the table */}
      <div 
        ref={observerTarget}
        className="w-full h-10 flex items-center justify-center"
      >
        {loading && <div className="text-gray-500">Loading more transactions...</div>}
      </div>
    </div>
  );
}