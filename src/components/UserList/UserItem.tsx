// src\components\UserList\UserItem.tsx
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { User } from '../../api';

interface UserItemProps {
  user: User;
  isSelected: boolean;
  onClick: (id: number) => void;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
}

const UserItem: React.FC<UserItemProps> = ({ 
  user, 
  isSelected, 
  onClick, 
  lastMessage, 
  timestamp, 
  unreadCount = 0 
}) => {
  const { id, name, username, avatar, status } = user;
  
  // Use either name or username based on what's available
  const displayName = name || username || 'Unknown User';
  
  // Safely generate initials with null checks
  const initials = displayName 
    ? displayName
        .split(' ')
        .map(part => part[0] || '')
        .join('')
        .toUpperCase()
        .substring(0, 2) 
    : 'UN';

  return (
    <div
      className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${isSelected ? 'bg-gray-100' : ''}`}
      onClick={() => onClick(id)}    
    >
      <div className='relative'>
        {avatar ? (
          <img 
            src={avatar} 
            alt={displayName} 
            className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm'          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
            {initials}
          </div>
        )}
        {status === 'online' && (
          <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
        )}
      </div>
      <div className='ml-3 flex-1'>
        <div className='flex justify-between'>
          <h3 className='font-medium text-gray-900'>{displayName}</h3>
          <span className='text-xs text-gray-500'>{timestamp}</span>
        </div>
        <div className='flex justify-between items-center'>
          <p className='text-sm text-gray-500 truncate max-w-[180px]'>{lastMessage || status || 'No messages yet'}</p>
          <div className="flex items-center">
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-1">
                {unreadCount}
              </span>
            )}
            {isSelected && (
              <CheckIcon className='h-4 w-4 text-primary' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;