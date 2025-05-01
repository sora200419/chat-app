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
          <span className='text-primary hover:text-primary-light text-sm'>
            Add New Profile
          </span>
        </div>
      </div>
      
      {/* Subheader with selected user information */}
      {selectedUser && (
        <div className='p-3 border-b bg-white flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='relative mr-3'>
              {selectedUser.avatar ? (
                <img 
                  src={selectedUser.avatar} 
                  alt={selectedUser.name || selectedUser.username || 'User'} 
                  className='w-10 h-10 rounded-full object-cover'
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                  {(selectedUser.name?.[0] || selectedUser.username?.[0] || 'U').toUpperCase()}
                </div>
              )}
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

          {/* Action buttons */}
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <input 
                type='text' 
                placeholder='Search messages...'
                className='py-1 pl-8 pr-3 border rounded-md text-sm w-32 search-field-mobile focus:outline-none focus:ring-1 focus:ring-primary'
                value={messageSearchTerm}
                onChange={handleSearch}
              />
              <MagnifyingGlassIcon className='absolute left-2 top-2 h-4 w-4 text-gray-400' />
            </div>
            <button className='text-gray-500 hover:text-primary'>
              <PhoneIcon className='h-5 w-5' />
            </button>
            <button className='text-gray-500 hover:text-primary'>
              <VideoCameraIcon className='h-5 w-5' />
            </button>
            {toggleProfile && (
              <button 
                className='text-gray-500 hover:text-primary'
                onClick={toggleProfile}
              >
                <EllipsisVerticalIcon className='h-5 w-5' />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;