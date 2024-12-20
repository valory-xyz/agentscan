"use client";
import { useState, useEffect, use } from "react";

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
  const unwrappedParams = "then" in params ? use(params) : params;
  const [instance, setInstance] = useState<Instance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const formatEthValue = (value: string) => {
    if (!value) return "0 ETH";
    const ethValue = parseInt(value) / 1e18;
    return `${ethValue} ETH`;
  };

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
    return <div className="container mx-auto px-4 pt-20">Loading...</div>;
  }

  if (!instance) {
    return <div className="container mx-auto px-4 pt-20">Agent not found</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      {/* Agent Header */}
      <div className="mb-6 border-b pb-6">
        <div className="flex items-center gap-4">
          <img
            src={instance.agent.image}
            alt={instance.agent.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{instance.agent.name}</h1>
            <div className="mt-2">
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                Trader
              </span>
            </div>
          </div>
          <div>
            <p className="text-gray-500">
              Last active{" "}
              {new Date(instance.timestamp * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-4 gap-8">
        {/* Left sidebar */}
        <div className="col-span-1">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Agent Details</h2>
            <p className="text-gray-600">{instance.agent.description}</p>
            <div className="mt-4">
              <a
                href={instance.agent.codeUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                View Code Repository
              </a>
            </div>
          </div>
        </div>

        {/* Right content area */}
        <div className="col-span-3">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Agent Activity</h2>
            <p className="text-gray-600 mb-6">Instance ID: {instance?.id}</p>

            {/* Transactions List */}
            <div className="space-y-4">
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
                        {new Date(tx.timestamp * 1000).toLocaleDateString()}
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
      </div>
    </div>
  );
}
