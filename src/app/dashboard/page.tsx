"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {useState} from 'react'
import { ChevronRight, Home, Layers, MessageSquare, PenTool, Send, Settings, Users } from "lucide-react"
import dynamic from "next/dynamic";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  },
);

export default function Component() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I assist you with your drawing today?" },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }])
      setInput("")
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "I understand. How else can I help you with your drawing?" },
        ])
      }, 1000)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Navbar */}
      <div className="w-64 bg-muted p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">DrawIO App</h2>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Layers className="mr-2 h-4 w-4" />
            Projects
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <PenTool className="mr-2 h-4 w-4" />
            Draw
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Collaborate
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content - Draw.io Space */}
      <div className="flex-1 bg-white p-4">
        <div className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <Excalidraw  />
        </div>
      </div>

      {/* Right Sidebar - Chatbot */}
      <div className="w-80 bg-muted p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Chatbot Assistant</h2>
        <ScrollArea className="flex-1 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                message.role === "user" ? "bg-primary text-primary-foreground ml-4" : "bg-muted-foreground/10 mr-4"
              }`}
            >
              {message.content}
            </div>
          ))}
        </ScrollArea>
        <div className="flex items-center">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 mr-2"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}