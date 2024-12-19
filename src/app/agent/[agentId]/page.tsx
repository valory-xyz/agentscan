"use client";

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
  const agentName = params.agentId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const mockStats: AgentStats = {
    bets_made: 6280,
    prediction_accuracy: 51,
    created_date: "15 months ago"
  };

  const mockActivities: Activity[] = [
    {
      type: "bet",
      amount: "$0.16000",
      prediction: "No",
      question: "Will the FCC revoke CBS's license on 20 October 2024?",
      timestamp: "2 months ago"
    },
    // Add more activities as needed
  ];

  return (
    <div className="container mx-auto px-4 pt-20">
      {/* Agent Header */}
      <div className="mb-6 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-500 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">{agentName}</h1>
            <div className="mt-2">
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                Trader
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <p className="text-gray-500">Last active 2 months ago</p>
          </div>
        </div>
      </div>

      {/* Agent Statistics */}
      <div className="mb-8 border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Agent statistics</h2>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-gray-500">Bets made</p>
            <p className="text-2xl font-bold">{mockStats.bets_made}</p>
          </div>
          <div>
            <p className="text-gray-500">Prediction accuracy</p>
            <p className="text-2xl font-bold">{mockStats.prediction_accuracy}%</p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p className="text-2xl font-bold">{mockStats.created_date}</p>
          </div>
        </div>
      </div>

      {/* Latest Activity */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Latest activity</h2>
        <div className="space-y-6">
          {mockActivities.map((activity, index) => (
            <div key={index} className="border-l-2 border-purple-500 pl-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">Trader agent</span>
                <span>bet {activity.amount} on {activity.prediction}</span>
              </div>
              <p className="mt-2">{activity.question}</p>
              <p className="text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 