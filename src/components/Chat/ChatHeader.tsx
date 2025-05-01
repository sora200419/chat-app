// src\components\Chat\ChatHeader.tsx
import React from 'react';
import {
  PhoneIcon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/solid';
import { useChat } from '../../context/useChatHook';

interface ChatHeaderProps {
  toggleProfile?: (() => void) | undefined;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleProfile }) => {
  const { selectedUser, messageSearchTerm, setMessageSearchTerm } = useChat();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMessageSearchTerm(e.target.value);
  };

  return (
    <div className='flex flex-col shadow-sm chat-header'>
      {/* Main header */}
      <div className='p-4 border-b bg-white flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Chat</h2>
        <div>
          <span className='text-primary hover:text-primary-light text-sm hidden sm:inline'>
            Add New Profile
          </span>
        </div>
      </div>
      
      {/* Subheader with selected user information */}
      {selectedUser && (
        <div className='p-3 border-b bg-white flex items-center justify-between flex-wrap'>
          <div className='flex items-center'>
            <div className='relative mr-3'>
              {/* Avatar code remains the same */}
            </div>
            <div>
              <h3 className='text-base font-medium text-gray-800'>
                {selectedUser.name || selectedUser.username || 'Unknown User'}
              </h3>
              <p className='text-xs text-gray-500'>
                {selectedUser.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
  
          {/* Action buttons - better mobile layout */}
          <div className='flex items-center space-x-2 mt-2 sm:mt-0'>
            <div className='relative hidden sm:block'>
              <input 
                type='text' 
                placeholder='Search...'
                className='py-1 pl-8 pr-3 border rounded-md text-sm w-24 md:w-32 search-field-mobile focus:outline-none focus:ring-1 focus:ring-primary'
                value={messageSearchTerm}
                onChange={handleSearch}
              />
              <MagnifyingGlassIcon className='absolute left-2 top-2 h-4 w-4 text-gray-400' />
            </div>
            <button className='text-gray-500 hover:text-primary p-1'>
              <PhoneIcon className='h-5 w-5' />
            </button>
            <button className='text-gray-500 hover:text-primary p-1'>
              <VideoCameraIcon className='h-5 w-5' />
            </button>
            <button 
              className='text-gray-500 hover:text-primary p-1 sm:hidden'
              onClick={() => setMessageSearchTerm(messageSearchTerm ? '' : ' ')}
              aria-label="Search messages"
            >
              <MagnifyingGlassIcon className='h-5 w-5' />
            </button>
            {toggleProfile && (
              <button 
                className='text-gray-500 hover:text-primary p-1'
                onClick={toggleProfile}
              >
                <EllipsisVerticalIcon className='h-5 w-5' />
              </button>
            )}
          </div>
          
          {/* Mobile-only search field that appears when search button is clicked */}
          {messageSearchTerm !== '' && (
            <div className='w-full mt-2 sm:hidden'>
              <div className='relative'>
                <input 
                  type='text' 
                  placeholder='Search messages...'
                  className='w-full py-1 pl-8 pr-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary'
                  value={messageSearchTerm === ' ' ? '' : messageSearchTerm}
                  onChange={handleSearch}
                  autoFocus
                />
                <MagnifyingGlassIcon className='absolute left-2 top-2 h-4 w-4 text-gray-400' />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHeader;