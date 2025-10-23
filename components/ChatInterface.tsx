'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import UserList from '@/components/UserList'
import ChatWindow from '@/components/ChatWindow'
import NotificationPanel from '@/components/NotificationPanel'

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

interface Notification {
  _id: string
  userId: string
  type: string
  title: string
  content: string
  isRead: boolean
  data: any
  timestamp: string
}

export default function ChatInterface() {
  const { user, onLogout } = useAuth()
  const { socket, isConnected } = useSocket()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('Token from localStorage:', token)
        
        if (!token) {
          console.error('No token found in localStorage')
          setLoading(false)
          return
        }
        
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          throw new Error(errorData.error || 'Failed to fetch users')
        }
        
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('Token for notifications:', token)
        
        if (!token) {
          console.error('No token found for notifications')
          return
        }
        
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Notifications response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Notifications API Error:', errorData)
          return
        }
        
        const data = await response.json()
        setNotifications(data)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
  }, [])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    const handleReceiveMessage = (message: any) => {
      setMessages(prev => {
        // Check if this message is already in the state (to avoid duplicates)
        const messageExists = prev.some(msg => msg._id === message._id)
        if (messageExists) {
          return prev
        }
        return [...prev, message]
      })
    }

    const handleMessageSent = (data: any) => {
      // Replace temporary message with real message from server
      setMessages(prev => prev.map(msg => 
        msg._id.startsWith('temp_') && msg.content === data.content
          ? { ...msg, _id: data.id, timestamp: data.timestamp }
          : msg
      ))
    }

    const handleNewNotification = (notification: any) => {
      setNotifications(prev => [notification, ...prev])
    }

    const handleUserOnline = (userData: any) => {
      setUsers(prev => prev.map(user => 
        user._id === userData.userId 
          ? { ...user, isOnline: true }
          : user
      ))
    }

    const handleUserOffline = (userData: any) => {
      setUsers(prev => prev.map(user => 
        user._id === userData.userId 
          ? { ...user, isOnline: false }
          : user
      ))
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('message_sent', handleMessageSent)
    socket.on('new_notification', handleNewNotification)
    socket.on('user_online', handleUserOnline)
    socket.on('user_offline', handleUserOffline)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('message_sent', handleMessageSent)
      socket.off('new_notification', handleNewNotification)
      socket.off('user_online', handleUserOnline)
      socket.off('user_offline', handleUserOffline)
    }
  }, [socket])

  // Fetch messages when user is selected
  useEffect(() => {
    if (!selectedUser) return

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/messages/${selectedUser._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [selectedUser])

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  const handleNotificationRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setNotifications(prev => prev.map(notif => 
        notif._id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Messaging App</h1>
              <p className="text-sm text-blue-100">Welcome, {user?.username}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors"
              >
                🔔
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors"
                title="Logout"
              >
                🚪
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* User List */}
        <UserList 
          users={users} 
          selectedUser={selectedUser} 
          onUserSelect={handleUserSelect} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {selectedUser ? (
          <ChatWindow 
          selectedUser={selectedUser} 
          messages={messages} 
          currentUserId={user?.id || ''}
          setMessages={setMessages}
        />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                Select a user to start chatting
              </h2>
              <p className="text-gray-500">
                Choose someone from the sidebar to begin your conversation
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationPanel 
          notifications={notifications}
          onNotificationRead={handleNotificationRead}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  )
}
