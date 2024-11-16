'use client'

import Link from "next/link"
import { ArrowUp, ArrowUpRight, ExternalLink, History, MessageSquare, Search, Send, ThumbsDown, ThumbsUp, Volume2, Wallet, Atom } from 'lucide-react'
import { useState, useRef, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for the value over time chart
const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}d`,
  value: 10 + Math.random() * 10
}))

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m Agent #306. How can I help you today?' }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestedPrompts = [
    "What was your most recent transaction?",
    "Describe your strategy",
    "What was your most profitable trade?"
  ]

  const sendMessage = (content: string) => {
    setMessages([...messages, { role: 'user', content }])
    setMessageInput("")
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
<div>

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        {/* Agent Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
                Agent #306
                <Button variant="outline" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                  Clone <Atom className="ml-2 h-4 w-4" />
                </Button>
              </h1>
              <p className="text-muted-foreground mb-2 flex items-center gap-2">
                Service: Prediction Market Oracle
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium">Total Value</p>
              <p className="text-2xl font-bold">15.5 ETH</p>
              <p className="text-muted-foreground">$29,140.25 USD</p>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <Tabs defaultValue="chat" className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/50 p-0.5 text-sm">
            <TabsTrigger
              value="chat"
              className="rounded-lg px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="rounded-lg px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-lg px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
            >
              Agent Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-grow flex flex-col mt-4">
            <Card className="flex-grow flex flex-col">
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex-grow flex flex-col space-y-4 overflow-y-auto mb-4">
                  {messages.map((message, i) => (
                    <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${i === 0 ? 'mb-6' : ''}`}>
                      <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {message.role === 'assistant' && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-lg px-4 py-2 ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Prompts */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestedPrompts.map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="text-sm"
                      onClick={() => sendMessage(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Message Agent #306..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => messageInput && sendMessage(messageInput)}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">0x1234...5678</span>
                          </div>
                        </TableCell>
                        <TableCell>{i + 1} mins ago</TableCell>
                        <TableCell>
                          <Link href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
                            Japan YES Market
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </TableCell>
                        <TableCell>Bought $5000 of Japan YES</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span>2.5 ETH</span>
                            <span className="text-sm text-muted-foreground">$4,700 USD</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Current Service</h3>
                      <Link href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                        Autonolas Prediction Market Service
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Associated Wallets</h3>
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">0x9876...4321</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Recent Apps</h3>
                      <div className="space-y-2">
                        <Link href="#" className="block text-blue-600 hover:underline">Japan YES Market</Link>
                        <Link href="#" className="block text-blue-600 hover:underline">US Election Markets</Link>
                        <Link href="#" className="block text-blue-600 hover:underline">Sports Predictions</Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Value Over Time (30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}