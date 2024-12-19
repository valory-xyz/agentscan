"use client";
import { useState } from 'react';

interface AgentStats {
  bets_made: number;
  prediction_accuracy: number;
  created_date: string;
}

interface Activity {
  type: string;
  amount: string;
  prediction: string;
  question: string;
  timestamp: string;
}

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const [activeTab, setActiveTab] = useState('transactions');
  
  const agentName = params.agentId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const mockStats: AgentStats = {
    bets_made: 6280,
    prediction_accuracy: 51,
    created_date: "15 months ago"
  };

  const mockTransactions = [
    {
      type: "bet",
      amount: "$0.16000",
      prediction: "No",
      question: "Will the FCC revoke CBS's license on 20 October 2024?",
      timestamp: "2024-03-15T14:30:00Z",
      txHash: "0x1234...5678"
    },
    // Add more mock transactions
  ];

  return (
    <div className="container mx-auto px-4 pt-20">
      {/* Agent Header */}
      <div className="mb-6 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-500 rounded-full"></div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{agentName}</h1>
            <div className="mt-2">
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                Trader
              </span>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Last active 2 months ago</p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-4 gap-8">
        {/* Left sidebar */}
        <div className="col-span-1">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Agent Type</h2>
            <p className="text-gray-600">
              This is a trading agent that specializes in market prediction and automated betting.
              It uses advanced algorithms to analyze market trends and make informed decisions.
            </p>
          </div>
        </div>

        {/* Right content area */}
        <div className="col-span-3">
          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-2 px-1 ${
                  activeTab === 'transactions'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500'
                }`}
              >
                Recent Transactions
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`pb-2 px-1 ${
                  activeTab === 'code'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500'
                }`}
              >
                Agent Code
              </button>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'transactions' ? (
            <div className="space-y-6">
              {mockTransactions.map((tx, index) => (
                <div key={index} className="border-l-2 border-purple-500 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Trader agent</span>
                    <span>bet {tx.amount} on {tx.prediction}</span>
                  </div>
                  <p className="mt-2">{tx.question}</p>
                  <div className="flex justify-between items-center mt-1 text-sm">
                    <span className="text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </span>
                    <a
                      href={`https://etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      View on Explorer
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg">
              <pre className="overflow-x-auto">
                <code>
                  // Agent code would go here
                  function tradingAgent() {
                    // ...
                  }
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 