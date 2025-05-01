// src/components/Chat/index.tsx
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatProps {
  toggleProfile?: (() => void) | undefined;
}

const Chat: React.FC<ChatProps> = ({ toggleProfile }) => {
  return (
    <div className='flex flex-col h-screen'>
      <ChatHeader toggleProfile={toggleProfile} />
      <div className='flex-1 overflow-auto'>
        <ChatMessages />
      </div>
      <ChatInput />
    </div>
  );
};

export default Chat;