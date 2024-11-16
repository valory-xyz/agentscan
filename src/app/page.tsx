import Link from 'next/link'
import { ArrowUp, Search, Box, Users, History, ArrowUpRight } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ExplorerDashboard() {
  const transactions = [
    { id: 306, wallet: '0x1234...5678', description: 'Bought $5000 of Japan YES' },
    { id: 207, wallet: '0xabcd...efgh', description: 'Sold $3000 of US Election NO' },
    { id: 415, wallet: '0x9876...5432', description: 'Created new market: "World Cup 2026"' },
    { id: 129, wallet: '0xijkl...mnop', description: 'Staked 1000 OLAS tokens' },
    { id: 532, wallet: '0x2468...1357', description: 'Bought $2500 of Sports Prediction' },
    { id: 701, wallet: '0xqrst...uvwx', description: 'Withdrew 5 ETH from pool' },
    { id: 843, wallet: '0x1357...2468', description: 'Added liquidity: 10 ETH' },
    { id: 956, wallet: '0xyzab...cdef', description: 'Claimed 500 OLAS rewards' },
  ]

  return (
    <div className="min-h-screen bg-background">

     

      <main className="container mx-auto px-4 py-8">
        {/* Network Stats */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold leading-tight">
            <span className="text-purple-600">2,345</span> agents deployed
            <br />
            by <span className="text-blue-600">1,234</span> services across <span className="text-blue-600">8</span> chains
          </h2>
          <div className="flex justify-center space-x-4 mt-4">
            <Button asChild size="lg">
              <Link href="/agent/306">Example Agent</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white">
              Deploy Agent
            </Button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Recent Transactions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="flex flex-col justify-between h-full">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <Link href={`/agent/${transaction.id}`} className="text-sm font-semibold hover:underline">
                      Agent #{transaction.id}
                    </Link>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{transaction.wallet}</p>
                  <p className="text-xs line-clamp-2">{transaction.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}