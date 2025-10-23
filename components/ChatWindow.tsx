'use client'

import { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/contexts/SocketContext'

interface User {
  _id: string
  username: string
  email: string
  avatar: string
  isOnline: boolean
  lastSeen: string
}

interface Message {
  _id: string
  senderId: string
  receiverId: string
  content: string
  messageType: string
  isRead: boolean
  timestamp: string
}

interface ChatWindowProps {
  selectedUser: User
  messages: Message[]
  currentUserId: string
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export default function ChatWindow({ selectedUser, messages, currentUserId, setMessages }: ChatWindowProps) {
  const { sendMessage, startTyping, stopTyping, socket } = useSocket()
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    const handleUserTyping = (data: any) => {
      if (data.userId === selectedUser._id) {
        setIsTyping(data.isTyping)
      }
    }

    socket.on('user_typing', handleUserTyping)

    return () => {
      socket.off('user_typing', handleUserTyping)
    }
  }, [socket, selectedUser._id])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageContent = newMessage.trim()
    
    // Add message to local state immediately for instant UI feedback
    const tempMessage = {
      _id: `temp_${Date.now()}`, // Temporary ID
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: messageContent,
      messageType: 'text',
      isRead: false,
      timestamp: new Date().toISOString()
    }
    
    // Add to messages state immediately
    setMessages(prev => [...prev, tempMessage])
    
    // Send via socket
    sendMessage(selectedUser._id, messageContent)
    setNewMessage('')
    
    // Stop typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    stopTyping(selectedUser._id)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    // Start typing indicator
    startTyping(selectedUser._id)

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout to stop typing
    const timeout = setTimeout(() => {
      stopTyping(selectedUser._id)
    }, 1000)

    setTypingTimeout(timeout)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedUser.username.charAt(0).toUpperCase()}
            </div>
            {selectedUser.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedUser.username}
            </h3>
            <p className="text-sm text-gray-500">
              {selectedUser.isOnline ? 'Online' : `Last seen ${new Date(selectedUser.lastSeen).toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
