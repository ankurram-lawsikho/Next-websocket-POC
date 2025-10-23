'use client'

interface User {
  _id: string
  username: string
  email: string
  avatar: string
  isOnline: boolean
  lastSeen: string
}

interface UserListProps {
  users: User[]
  selectedUser: User | null
  onUserSelect: (user: User) => void
}

export default function UserList({ users, selectedUser, onUserSelect }: UserListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Online Users
        </h3>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => onUserSelect(user)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser?._id === user._id
                  ? 'bg-blue-100 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username}
                    </p>
                    {user.isOnline ? (
                      <span className="text-xs text-green-600 font-medium">Online</span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        {new Date(user.lastSeen).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
