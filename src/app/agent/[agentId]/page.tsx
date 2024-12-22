/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, use } from "react";
import ChatComponent from "@/components/ChatComponent";

import Link from "next/link";
import { useMessages } from "@/hooks/use-messages";
import { useAgent } from "@/contexts/AgentContext";

const getRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
};

const getExplorerUrl = (chain: string, address: string) => {
  const baseUrl =
    chain === "gnosis"
      ? "https://gnosisscan.io/address/"
      : "https://etherscan.io/address/";
  return `${baseUrl}${address}`;
};

interface Instance {
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

interface Transaction {
  timestamp: number;
  transactionHash: string;
  chain: string;
  transaction: {
    from: string;
    to: string;
    value?: string;
    logs: {
      decodedData: string;
      eventName: string;
    }[];
  };
  transactionLink: string;
}

interface InstanceResponse {
  instance: Instance;
  transactions: Transaction[];
}

export default function AgentPage({
  params,
}: {
  params: Promise<{ agentId: string }> | { agentId: string };
}) {
  const { setExternalUrl } = useAgent();
  const unwrappedParams = "then" in params ? use(params) : params;
  const [instance, setInstance] = useState<Instance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { messages, sendMessage } = useMessages({
    teamId: process.env.NEXT_PUBLIC_TEAM_ID,
    instanceId: unwrappedParams.agentId,
    type: "agent",
  });

  const formatEthValue = (value: string) => {
    if (!value) return "0 ETH";
    const ethValue = parseInt(value) / 1e18;
    return `${ethValue} ETH`;
  };

  const exampleQuestions = [
    "What can this agent do?",
    "Tell me about this agents recent transactions",
    "How does it make decisions?",
    "What's its trading strategy?",
  ];

  useEffect(() => {
    const fetchInstance = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/instance`);
        url.searchParams.append("id", unwrappedParams.agentId);

        const response = await fetch(url.toString());
        const data: InstanceResponse = await response.json();
        setInstance(data.instance);
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Error fetching instance:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/transactions`);
      url.searchParams.append("instance", unwrappedParams.agentId);

      const response = await fetch(url.toString());
      const data = await response.json();
      console.log(data);
      setTransactions(data.transactions || []);
    };

    const fetchInstanceAndTransactions = async () => {
      await Promise.all([fetchInstance(), fetchTransactions()]);
    };

    fetchInstanceAndTransactions();
  }, [unwrappedParams.agentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full flex-1">
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
      </div>
    );
  }

  if (!instance) {
    return <div className="container mx-auto px-4 pt-20">Agent not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Agent Header with Details */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6 flex-grow">
            <img
              src={instance.agent.image}
              alt={instance.agent.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-grow space-y-2">
              <h1 className="text-3xl font-bold">{instance.agent.name}</h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-500 text-sm">
                  Created {getRelativeTime(instance.timestamp)}
                </p>
                <div className="">
                  <a
                    href={instance.agent.codeUri}
                    onClick={(e) => {
                      e.preventDefault();
                      setExternalUrl(instance.agent.codeUri);
                    }}
                    className="text-purple-600 text-sm hover:text-purple-700 font-medium hover:underline inline-flex items-center"
                  >
                    View Code Repository
                    <svg
                      className="w-4 h-4 ml-1"
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
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button - Moved and aligned right */}
          <Link
            href="/agents"
            className="inline-flex items-center text-purple-600 hover:text-purple-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Agents
          </Link>
        </div>

        {/* Agent Description */}
        <div className="mt-6">
          <p className="text-gray-600 leading-relaxed">
            {instance.agent.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Transactions section - Updated width */}
        <div className="flex-1 space-y-8">
          <div className="bg-white border border-gray-200 p-8 h-[800px] flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Agent Activity</h2>
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {transactions.map((tx) => (
                <div
                  key={tx.transactionHash}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm mb-2">
                        {tx.chain.toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-600">
                        From:{" "}
                        <a
                          href={getExplorerUrl(tx.chain, tx.transaction.from)}
                          onClick={(e) => {
                            e.preventDefault();
                            setExternalUrl(
                              getExplorerUrl(tx.chain, tx.transaction.from)
                            );
                          }}
                          className="text-purple-600 hover:underline"
                        >
                          {tx.transaction.from}
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        To:{" "}
                        <a
                          href={getExplorerUrl(tx.chain, tx.transaction.to)}
                          onClick={(e) => {
                            e.preventDefault();
                            setExternalUrl(
                              getExplorerUrl(tx.chain, tx.transaction.to)
                            );
                          }}
                          className="text-purple-600 hover:underline"
                        >
                          {tx.transaction.to}
                        </a>
                      </p>
                      {tx.transaction.value && (
                        <p className="text-sm text-gray-600 mt-1">
                          Value: {formatEthValue(tx.transaction.value)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {getRelativeTime(tx.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Add collapsible logs section */}
                  {tx.transaction.logs.length > 0 && (
                    <div className="mt-3">
                      <details className="group">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 transition-transform group-open:rotate-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          View Transaction Logs ({tx.transaction.logs.length})
                        </summary>
                        <div className="space-y-2 mt-2 pl-2">
                          {tx.transaction.logs.map((log, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded">
                              <p className="text-sm font-medium text-gray-700">
                                {log.eventName}
                              </p>
                              <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                                {log.decodedData}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}

                  <div className="mt-3">
                    <a
                      href={tx.transactionLink}
                      onClick={(e) => {
                        e.preventDefault();
                        setExternalUrl(tx.transactionLink);
                      }}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      View on{" "}
                      {tx.chain === "gnosis"
                        ? "Gnosis Scan"
                        : tx.chain === "base"
                        ? "Base Scan"
                        : "Etherscan"}
                      →
                    </a>
                  </div>
                </div>
              ))}

              {transactions.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No transactions found for this agent
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Chat section - Updated width */}
        <div className="flex-1">
          <div className="p-2 md:p-4 flex flex-col h-[800px] border border-gray-200">
            <ChatComponent
              onSend={sendMessage}
              messages={messages}
              initialMessage={`Hi there! I'm ${instance?.agent.name}. Ask me anything about what I do!`}
              placeholder="Ask this agent anything..."
              onExternalLinkClick={(url) => {
                setExternalUrl(url);
              }}
              exampleQuestions={exampleQuestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
