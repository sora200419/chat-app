// src/context/ChatContext.tsx
import { createContext } from 'react';
import { 
  User,
  Group,
  Message
} from '../api';

// Define Chat interface
export interface Chat {
  id: number;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface ChatContextType {
  // User data
  currentUser: { id: number };
  users: User[];
  filteredUsers: User[];
  userSearchTerm: string;
  setUserSearchTerm: (term: string) => void;
  
  // Group data
  groups: Group[];
  
  // Chat data
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  selectedUser: User | null;
  selectUser: (userId: number) => Promise<void>;
  messages: Message[];
  filteredMessages: Message[];
  messageSearchTerm: string;
  setMessageSearchTerm: (term: string) => void;
  sendMessage: (message: string) => Promise<Message>;
  
  // Application state
  isLoading: boolean;
  isSending?: boolean;
  error: string | null;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);