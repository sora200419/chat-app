// src\components\Chat\ChatInput.tsx
import React, { useState } from 'react';
import {
  PaperClipIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  PhotoIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/solid';
import { useChat } from '../../context/useChatHook';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const { sendMessage, selectedUser, isSending } = useChat();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!message.trim() || !selectedUser || isSending) return;

    try {
      await sendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='p-4 border-t bg-white'>
      <form onSubmit={handleSubmit} className='flex items-center'>
        <button 
          type='button' 
          className='text-gray-500 hover:text-primary mr-2'
          title='Attach file'
          disabled={!selectedUser || isSending}
        >
          <PaperClipIcon className='h-6 w-6' />
        </button>
        <div className='flex-1 relative'>
          <input
            type='text'
            id="message-input"
            name="message-input"
            placeholder={selectedUser ? 'Type a message here...' : 'Select a contact to start chatting'}
            className='w-full py-3 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedUser || isSending}
          />
          <div className='absolute right-3 top-3 flex space-x-3'>
            <button 
              type='button' 
              className='text-gray-500 hover:text-primary'
              title='Emoji'
              disabled={!selectedUser || isSending}
            >
              <FaceSmileIcon className='h-5 w-5' />
            </button>
            <button 
              type='button' 
              className='text-gray-500 hover:text-primary'
              title='Voice message'
              disabled={!selectedUser || isSending}
            >
              <MicrophoneIcon className='h-5 w-5' />
            </button>
            <button 
              type='button' 
              className='text-gray-500 hover:text-primary'
              title='Share image'
              disabled={!selectedUser || isSending}
            >
              <PhotoIcon className='h-5 w-5' />
            </button>
          </div>
        </div>
        <button
          type='submit'
          className={`ml-3 p-3 ${isSending ? 'bg-gray-400' : 'bg-primary'} text-white rounded-full hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!message.trim() || !selectedUser || isSending}
        >
          {isSending ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <PaperAirplaneIcon className='h-5 w-5' />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;