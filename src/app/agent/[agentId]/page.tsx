"use client";
import { useState, useEffect, use } from "react";
import ChatComponent from "@/components/ChatComponent";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AgentPage({
  params,
}: {
  params: Promise<{ agentId: string }> | { agentId: string };
}) {
  const unwrappedParams = "then" in params ? use(params) : params;
  const [instance, setInstance] = useState<Instance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const formatEthValue = (value: string) => {
    if (!value) return "0 ETH";
    const ethValue = parseInt(value) / 1e18;
    return `${ethValue} ETH`;
  };

  const exampleQuestions = [
    "What can this agent do?",
    "Show me its recent transactions",
    "How does it make decisions?",
    "What's its trading strategy?",
  ];

  const mobileExampleQuestions = exampleQuestions.slice(0, 3);
  const [showExampleQuestions, setShowExampleQuestions] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const sendMessage = async (message: string) => {
    try {
      // Add user message
      const userMessage: Message = { role: "user", content: message };
      setMessages((prev) => [...prev, userMessage]);

      // TODO: Add API call here to get agent's response
      // For now, simulate a response
      const botMessage: Message = {
        role: "assistant",
        content: "I received your message: " + message,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
    <div className="container mx-auto px-4 py-20 max-w-7xl">
      {/* Agent Header with Details */}
      <div className="mb-8 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-6">
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
                  target="_blank"
                  rel="noopener noreferrer"
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

        {/* Moved Agent Details here */}
        <div className="mt-6">
          <p className="text-gray-600 leading-relaxed">
            {instance.agent.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column - takes 3 columns on large screens */}
        <div className="lg:col-span-3 space-y-8">
          {/* Simplified Tabs - only showing Activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Agent Activity</h2>
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                        From: {tx.transaction.from}
                      </p>
                      <p className="text-sm text-gray-600">
                        To: {tx.transaction.to}
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

                  {/* Transaction Logs */}
                  <div className="space-y-2 mt-3">
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

                  <div className="mt-3">
                    <a
                      href={tx.transactionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline text-sm"
                    >
                      View on{" "}
                      {tx.chain === "gnosis" ? "Gnosis Scan" : "Explorer"} →
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

        {/* Right Column: Chat Component - takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm sticky top-8">
            <ChatComponent
              onSend={sendMessage}
              messages={messages}
              initialMessage={`Hi there! I'm ${instance?.agent.name}. Ask me anything about what I do!`}
              placeholder="Ask this agent anything..."
              onExternalLinkClick={(url) => window.open(url, "_blank")}
            >
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExampleQuestions(!showExampleQuestions)}
                  className="text-gray-500 hover:text-gray-700 mx-auto"
                >
                  {showExampleQuestions ? (
                    <>
                      Hide examples <ChevronUp className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Show examples <ChevronDown className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                {showExampleQuestions && (
                  <div className="flex flex-wrap gap-2 justify-center mb-2">
                    {(isMobile ? mobileExampleQuestions : exampleQuestions).map(
                      (question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => {
                            // Handle question click
                            // const userMessage = {
                            //   role: "user",
                            //   content: question,
                            // };
                            // setMessages((prev) => [...prev, userMessage]);
                            // sendMessage(question, [...messages, userMessage]);
                          }}
                          className="text-gray-600 hover:text-gray-800 text-sm py-1 px-4"
                        >
                          {question}
                        </Button>
                      )
                    )}
                  </div>
                )}
              </div>
            </ChatComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
