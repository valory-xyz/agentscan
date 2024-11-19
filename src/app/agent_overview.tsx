'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUp, Send } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export default function AgentChat({ params = { id: '0' } }: { params?: { id: string } }) {
  const agentId = params.id || '0';
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi there 👋 - this is Agent #${agentId}. What would you like to learn about me?` }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const exampleQuestions = [
    "What is an OLAS Agent?",
    "What activities can OLAS agents do?",
    "What are some example transactions OLAS agents have done?",
    "What services can OLAS run?",
    "How many agents exist today?"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setMessages([...messages, { role: 'user', content: query }])
      setQuery('')
    }
  }

  const handleQuestionClick = (question: string) => {
    setMessages([...messages, { role: 'user', content: question }])
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <span className="font-bold text-xl">agentscan</span>
              <div className="flex items-center text-green-600">
                <span>$OLAS: $1.24</span>
                <ArrowUp className="h-4 w-4 ml-1" />
                <span className="text-sm ml-1">2.5%</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="space-y-6 mb-4 max-h-[60vh] overflow-y-auto">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100">
                          <svg
                            viewBox="0 0 24 32"
                            className="w-5 h-5 text-purple-500"
                          >
                            <path
                              d="M12 0L24 16L12 32L0 16L12 0Z"
                              className="fill-current"
                            />
                          </svg>
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-4">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {exampleQuestions.map((question, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="text-sm"
                      onClick={() => handleQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Message Agent #${agentId}...`}
                  className="w-full h-14 pl-5 pr-14"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="absolute right-2 top-3 h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center space-x-4 mt-8">
          <Button asChild size="lg">
            <Link href="https://docs.autonolas.network/get_started/">Launch your agent</Link>
          </Button>
          <Button variant="outline" size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
            <Link href="https://docs.olas.network">Documentation</Link>
          </Button>
        </div>
      </main>

      <footer className="w-full py-4 bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            agentscan is a community-driven informational site separate to Autonolas (OLAS), Valory AG or any related products & services. All information and chats are not financial advice. Use at your own risk.
          </p>
        </div>
      </footer>
    </div>
  )
}