import Link from 'next/link'
import { ArrowUp, Search, Box, Users, History, ArrowUpRight } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AgentOverview } from '@/components/agent-overview'

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
    <AgentOverview />
    </div>
  )
}