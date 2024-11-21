"use client";

import Link from "next/link";
import { ArrowUp, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BlockPage() {
  const agents = [
    {
      id: 306,
      description: "Prediction Market Oracle - Bought $5000 of Japan YES",
    },
    { id: 207, description: "Sports Betting Agent - Placed 2.5 ETH on Lakers" },
    { id: 415, description: "NFT Trading Bot - Sold Bored Ape #1234" },
    { id: 129, description: "DeFi Yield Farmer - Added liquidity to Uniswap" },
    { id: 532, description: "Options Trading Bot - Executed BTC call option" },
    { id: 701, description: "Governance Voter - Voted on Uniswap proposal" },
    { id: 843, description: "MEV Bot - Extracted value from DEX trades" },
    { id: 956, description: "Arbitrage Bot - ETH/USDC cross-exchange trade" },
    { id: 164, description: "Liquidation Bot - Managed Aave positions" },
    { id: 275, description: "DAO Participant - Contributed to governance" },
    { id: 398, description: "Token Swapper - Optimized cross-chain bridges" },
    { id: 742, description: "Data Oracle - Provided price feeds" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-green-600">
            <span className="font-medium">$OLAS: $1.24</span>
            <ArrowUp className="h-4 w-4 ml-1" />
            <span className="text-sm ml-1">2.5%</span>
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center px-4 pt-8 pb-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex gap-2 mb-2">
            {[...Array(3)].map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 24 32"
                className={`w-12 h-12 ${
                  i === 1 ? "text-purple-500" : "text-purple-400"
                }`}
                style={{
                  filter:
                    i === 1
                      ? "drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))"
                      : undefined,
                }}
              >
                <path
                  d="M12 0L24 16L12 32L0 16L12 0Z"
                  className="fill-current"
                />
              </svg>
            ))}
          </div>
          <h1 className="font-bold text-3xl mb-1">agentscan</h1>
          <p className="text-muted-foreground">An OLAS Explorer</p>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold leading-tight">
            <span className="text-purple-600">2,345</span> agents deployed
            <br />
            by <span className="text-blue-600">1,234</span> services across{" "}
            <span className="text-blue-600">8</span> chains
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-12">
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

        {/* Agent Grid */}
        <div className="w-full max-w-6xl">
          <h3 className="text-2xl font-bold mb-6">
            Click to chat with an agent
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className="hover:shadow-lg transition-shadow"
              >
                <Link href={`/agent/${agent.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Agent #{agent.id}</h4>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {agent.description}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full py-4 bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            agentscan is a community-driven informational site separate to
            Autonolas (OLAS), Valory AG or any related products & services. All
            information and chats are not financial advice. Use at your own
            risk.
          </p>
        </div>
      </footer>
    </div>
  );
}
