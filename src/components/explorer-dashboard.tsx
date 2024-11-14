'use client'

import { ArrowUp, Search, Box, Users, History } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ExplorerDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="w-full h-full bg-background">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-xl">agentscan</span>
              <div className="flex items-center text-green-600">
                <span>$OLAS: $1.24</span>
                <ArrowUp className="h-4 w-4 ml-1" />
                <span className="text-sm ml-1">2.5%</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-1 max-w-xl mx-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by agent ID / service name..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Network Stats */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold leading-tight mb-6">
            <span className="text-purple-600">2,345</span> agents deployed
            <br />
            by <span className="text-blue-600">1,234</span> services across <span className="text-blue-600">8</span> chains
          </h2>
          <div className="flex justify-center space-x-4">
            <Button variant="default" size="lg">
              Deploy Agent
            </Button>
            <Button variant="outline" size="lg" className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white">
              Stake $OLAS
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions by Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b pb-4">
                  <div className="flex items-start space-x-3">
                    <History className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-base font-medium">Agent #306</p>
                      <p className="text-sm text-muted-foreground">0x1234...5678</p>
                      <p className="text-sm mt-1">Bought $5000 of Japan YES</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">1 min ago</p>
                  </div>
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start justify-between border-b pb-2">
                    <div className="flex items-start space-x-3">
                      <History className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Agent #{304 + i}</p>
                        <p className="text-xs text-muted-foreground">0x1234...5678</p>
                        <p className="text-sm mt-1">Bought $5000 of Japan YES</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{2 + i} mins ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Recent Agents Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">New Agent #{400 + i}</p>
                        <p className="text-xs text-muted-foreground">Created by 0x9876...4321</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">5 mins ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}