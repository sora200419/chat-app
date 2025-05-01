import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import UserItem from './UserItem';
import { useChat } from '../../context/useChatHook';

const UserList: React.FC = () => {
  const {
    filteredUsers,
    userSearchTerm,
    setUserSearchTerm,
    selectedUser,
    selectUser,
    isLoading,
    error
  } = useChat();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserSearchTerm(e.target.value);
  };

  // Mock unread counts for demonstration
  const getUnreadCount = (userId: number): number => {
    // This would normally come from your API or state
    const counts: Record<number, number> = {
      1: 2,
      2: 0,
      3: 1,
      4: 0
    };
    return counts[userId] || 0;
  };

  return (
    <div className='border-r h-screen overflow-hidden flex flex-col bg-white'>
      <div className='p-4 border-b'>
        <div className='relative mb-4'>
          <input 
            type='text' 
            id="search-contact"
            name="search-contact"
            placeholder='Search Contact'
            className='w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            value={userSearchTerm}
            onChange={handleSearch}
          />
          <MagnifyingGlassIcon className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
        </div>
      </div>
      
      <div className='overflow-y-auto flex-1'>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">
            <p>{error}</p>
            <button 
              className="mt-2 text-primary underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            {userSearchTerm ? 'No users match your search' : 'No users available'}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              isSelected={selectedUser ? selectedUser.id === user.id : false}
              onClick={selectUser}
              lastMessage={user.lastMessage}
              timestamp={user.lastMessageTime}
              unreadCount={getUnreadCount(user.id)}
            />
          ))
        )}
      </div>
      
      <div className='p-4 border-t flex space-x-2'>
        <button className='flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-primary-light transition-colors'>
          Meeting
        </button>
        <button className='flex-1 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors'>
          Schedule
        </button>
      </div>
    </div>
  );
};

export default UserList;