import React, { useEffect, useRef, Fragment } from 'react';
import { useChat } from '../../context/useChatHook';

interface DisplayMessage {
  id?: number;
  content: string;
  timestamp: string;
  fromUserId: number;
  toUserId: number;
  senderName?: string;
  senderAvatar?: string;
  image?: string | null;
  isFromMe: boolean;
}

interface GroupedMessages {
  [date: string]: DisplayMessage[][];
}


const ChatMessageGroup = ({ 
  messages, 
  isFromMe 
}: { 
  messages: DisplayMessage[],
  isFromMe: boolean
}) => {
  if (!messages.length) return null;
  
  const message = messages[0];
  
  return (
    <div className={`flex my-2 ${isFromMe ? 'justify-end' : 'justify-start'} message-container`}>
      {!isFromMe && (
        <div className="relative mr-2 mt-1 flex-shrink-0">
          <img 
            src={message.senderAvatar || `https://ui-avatars.com/api/?name=${message.senderName || 'User'}`} 
            alt="avatar" 
            className="user-avatar"
          />
        </div>
      )}
      <div className="flex flex-col max-w-full">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col mb-1">
            <div 
              className={`chat-message ${isFromMe ? 'message-from-me' : 'message-to-me'}`}
            >
              {msg.content}
              
              {msg.image && (
                <div className='mt-2'>
                  <img 
                    src={msg.image} 
                    alt="Image attachment" 
                    className="max-w-full max-h-[150px] rounded-md object-cover"
                  />
                </div>
              )}
            </div>
            
            {idx === messages.length - 1 && (
              <div className={`message-timestamp ${isFromMe ? 'from-me ml-auto' : 'to-me'}`}>
                {msg.timestamp}
              </div>
            )}
          </div>
        ))}
      </div>
      {isFromMe && (
        <div className="relative ml-2 mt-1 flex-shrink-0">
          <div className="user-avatar bg-primary text-white flex items-center justify-center text-xs">
            US
          </div>
        </div>
      )}
    </div>
  );
};

const DateSeparator = ({ date }: { date: string }) => {
  const isToday = date === new Date().toLocaleDateString();
  const displayDate = isToday ? 'Today' : date;
  
  return (
    <div className='flex items-center justify-center my-4'>
      <div className='bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600'>
        {displayDate}
      </div>
    </div>
  );
};

const ChatMessages: React.FC = () => {
  const { filteredMessages, currentUser, isLoading, selectedUser, error } = useChat();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to the bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  // Display loading state
  if (isLoading) {
    return (
      <div className='flex-1 p-4 flex items-center justify-center text-gray-500'>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading messages...
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className='flex-1 p-4 flex flex-col items-center justify-center text-red-500'>
        <svg className="h-12 w-12 text-red-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Display empty state
  if (!filteredMessages || filteredMessages.length === 0) {
    return (
      <div className='flex-1 p-4 flex flex-col items-center justify-center text-gray-500'>
        {selectedUser ? (
          <>
            <svg className="h-12 w-12 text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start a conversation with {selectedUser.name || selectedUser.username}</p>
          </>
        ) : (
          <>
            <svg className="h-12 w-12 text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Select a conversation to start chatting</p>
          </>
        )}
      </div>
    );
  }

  // Process messages for display
  const displayMessages = filteredMessages
  .filter(message => message.message !== "Chat sent")
  .map((message) => {
    // Format timestamp from Unix timestamp
    let formattedTime;
    try {
      // Handle both seconds and milliseconds timestamps
      const timestamp = typeof message.timestamp === 'number' 
        ? (message.timestamp > 9999999999 
          ? message.timestamp 
          : message.timestamp * 1000)
        : new Date().getTime(); // Default to current time if invalid
      
      formattedTime = new Date(timestamp).toLocaleTimeString(
        [], { hour: '2-digit', minute: '2-digit' });
    } catch {
      formattedTime = '';
    }
    
    return {
      id: message.id,
      content: message.message,
      timestamp: formattedTime,
      fromUserId: message.fromUser,
      toUserId: message.toUser,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      image: message.image,
      isFromMe: message.fromUser === currentUser.id
    };
  });

  // Group messages by date and sender
  const groupedByDate: GroupedMessages = {};
  
  displayMessages.forEach(message => {
    // Get message date
    let messageDate;
    try {
      // Try to extract date from timestamp
      const timestamp = message.timestamp;
      if (timestamp) {
        // Using the current date for demonstration
        // In a real app, you'd extract this from the timestamp
        messageDate = new Date().toLocaleDateString();
      } else {
        messageDate = 'Invalid Date';
      }
    } catch {
      messageDate = 'Invalid Date';
    }
    
    // Initialize date group if it doesn't exist
    if (!groupedByDate[messageDate]) {
      groupedByDate[messageDate] = [];
    }
    
    // Check if we should add to existing group or create a new one
    const lastGroup = groupedByDate[messageDate][groupedByDate[messageDate].length - 1];
    
    if (
      lastGroup && 
      lastGroup.length > 0 && 
      lastGroup[0].isFromMe === message.isFromMe
    ) {
      lastGroup.push(message);
    } else {
      groupedByDate[messageDate].push([message]);
    }
  });

  return (
    <div className='flex-1 p-4 overflow-y-auto bg-gray-50'>
      {Object.entries(groupedByDate).map(([date, messageGroups]) => (
        <Fragment key={date}>
          <DateSeparator date={date} />
          
          {messageGroups.map((group, groupIndex) => (
            <ChatMessageGroup 
              key={`${date}-${groupIndex}`}
              messages={group}
              isFromMe={group[0].isFromMe}
            />
          ))}
        </Fragment>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatMessages;