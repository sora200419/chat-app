import axios from 'axios';

// Base URL setup - will be proxied by Vite in development
const API_BASE_URL = '/api/chatSystem';

// Define interfaces for API data types
export interface User {
  id: number;
  // API fields
  username?: string;
  position?: string; 
  address?: string;
  profileImage?: string;
  // Mapped fields for internal use
  name?: string;
  designation?: string;
  location?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  status?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  groupParticipants?: Participant[];
  media?: MediaItem[];
}

export interface Participant {
  id: number;
  name: string;
  avatar?: string;
}

export interface MediaItem {
  url: string;
  type: string;
}

export interface Group {
  id: number;
  name: string;
  icon?: string;
  members?: Participant[];
}

export interface Message {
  id: number;
  fromUser: number;
  toUser: number;
  message: string;
  image?: string | null;
  timestamp: number;
  senderName?: string;
  senderAvatar?: string;
}

// API client instance with error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// User API functions
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users/list');
  // Map API field names to our internal field names
  const mappedUsers = (response.data as User[]).map(user => ({
    ...user,
    name: user.username || user.name,
    designation: user.position || user.designation,
    location: user.address || user.location,
    avatar: user.profileImage || user.avatar
  }));
  return mappedUsers;
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get(`/user/${userId}`);
  // Map API field names to our internal field names
  const user = response.data as User;
  return {
    ...user,
    name: user.username || user.name,
    designation: user.position || user.designation,
    location: user.address || user.location,
    avatar: user.profileImage || user.avatar
  };
};

// Group API functions
export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get('/groups/list');
  return response.data as Group[];
};

// Chat API functions
export const getChats = async (): Promise<Message[]> => {
  const response = await api.get('/chat/list');
  return response.data as Message[];
};

export const getChatByUserId = async (userId: number): Promise<Message[]> => {
  const response = await api.get(`/chatByUserId/${userId}`);
  return response.data as Message[];
};

export const addNewChat = async (fromUser: number, toUser: number, message: string): Promise<Message> => {
  try {
    const response = await api.post('/chat/add', {
      fromUser,
      toUser,
      message,
    });
    console.log('API Response:', response);
    return response.data as Message;
  } catch (error) {
    console.error('API Error Details:', error);
    throw error;
  }
};