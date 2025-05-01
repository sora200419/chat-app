// src\context\ChatProvider.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { 
  getUsers, 
  getGroups, 
  getChatByUserId, 
  addNewChat, 
  getUserById,
  User,
  Group,
  Message
} from '../api';
import { ChatContext, ChatContextType, Chat } from './ChatContext';

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Current user (assumed to be user with id 5 as per requirements)
  const [currentUser] = useState<{ id: number; initials: string }>({ 
    id: 5, 
    initials: 'JD' // Replace with actual initials for your user
  });  
  // Application state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  
  // Groups state
  const [groups, setGroups] = useState<Group[]>([]);
  
  // Chat state
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageSearchTerm, setMessageSearchTerm] = useState<string>('');
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching users from API...');
        const data = await getUsers();
        console.log('Users data received:', data);
        
        // Users are already mapped in the API function
        // Filter out the current user
        const filteredData = data.filter(user => user.id !== currentUser.id);
        setUsers(filteredData);
        setFilteredUsers(filteredData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser.id]);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async (): Promise<void> => {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
      }
    };
    fetchGroups();
  }, []);

  // Fetch messages when selected user changes
  useEffect(() => {
    const fetchMessages = async (): Promise<void> => {
      if (selectedUser) {
        setIsLoading(true);
        try {
          const data = await getChatByUserId(selectedUser.id);
          
          // Process timestamps properly
          const processedMessages = data.map(message => {
            // Convert timestamp to proper format if needed
            if (typeof message.timestamp === 'number') {
              const timestamp = message.timestamp > 9999999999 
                ? message.timestamp 
                : message.timestamp * 1000;
                
              // Use correct date formatting
              const date = new Date(timestamp);
              if (!isNaN(date.getTime())) {
                // Apply any timestamp formatting needed
              }
            }
            
            return {
              ...message,
              // Add sender info to improve attribution
              senderName: message.fromUser === selectedUser.id ? selectedUser.name || selectedUser.username : undefined,
              senderAvatar: message.fromUser === selectedUser.id ? selectedUser.avatar || selectedUser.profileImage : undefined
            };
          });
          
          setMessages(processedMessages);
          setFilteredMessages(processedMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
          setFilteredMessages([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessages([]);
        setFilteredMessages([]);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Filter users based on search term
  useEffect(() => {
    if (userSearchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        (user.name?.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
        (user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
        user.status?.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [userSearchTerm, users]);

  // Filter messages based on search term
  useEffect(() => {
    if (messageSearchTerm.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(message => 
        message.message?.toLowerCase().includes(messageSearchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [messageSearchTerm, messages]);

  // Select user and fetch their details
  const selectUser = async (userId: number): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await getUserById(userId);
      // Normalize user data to ensure name and other fields are always defined
      const normalizedUserData = {
        ...userData,
        id: userData.id,
        name: userData.username || userData.name || `User ${userId}`,
        designation: userData.position || userData.designation || '',
        location: userData.address || userData.location || '',
        avatar: userData.profileImage || userData.avatar || '',
        email: userData.email || '',
        phone: userData.phone || '',
        groupParticipants: userData.groupParticipants || [],
        media: userData.media || []
      };
      setSelectedUser(normalizedUserData);
      
      try {
        const chatData = await getChatByUserId(userId);
        
        // Add sender information to messages
        const enhancedMessages = await Promise.all(chatData.map(async (message) => {
          // For messages received from the selected user
          if (message.fromUser === userId) {
            return {
              ...message,
              senderName: normalizedUserData.name,
              senderAvatar: normalizedUserData.avatar
            };
          }
          // For messages sent by the current user
          return message;
        }));
        
        setMessages(enhancedMessages);
        setFilteredMessages(enhancedMessages);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        setMessages([]);
        setFilteredMessages([]);
      }
    } catch (error) {
      console.error('Error selecting user:', error);
      setSelectedUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (message: string): Promise<Message> => {
    if (!selectedUser || !message.trim()) {
      throw new Error('Selected user or message is missing');
    }
    
    setIsSending(true);
    try {
      // Log to console instead of displaying in UI
      console.log('Chat sent', message);
      
      const newMessage = await addNewChat(currentUser.id, selectedUser.id, message);
      
      // Update the messages state with the new message
      setMessages(prev => [...prev, newMessage]);
      setFilteredMessages(prev => 
        messageSearchTerm ? 
          [...prev, newMessage].filter(msg => 
            msg.message.toLowerCase().includes(messageSearchTerm.toLowerCase())
          ) : 
          [...prev, newMessage]
      );
      
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  // Context value
  const value: ChatContextType = {
    currentUser,
    users,
    filteredUsers,
    userSearchTerm,
    setUserSearchTerm,
    groups,
    selectedChat,
    setSelectedChat,
    selectedUser,
    selectUser,
    messages,
    filteredMessages,
    messageSearchTerm,
    setMessageSearchTerm,
    sendMessage,
    isLoading,
    isSending,
    error
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};