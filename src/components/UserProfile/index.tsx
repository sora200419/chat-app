//src\components\UserProfile\index.tsx
import React from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  XMarkIcon,
  InformationCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/solid';
import { useChat } from '../../context/useChatHook';
import { Participant, MediaItem } from '../../api';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { selectedUser } = useChat();
  
  // If no user is selected, provide default placeholder data
  const user = selectedUser || {
    id: 0,
    name: 'Kevin',
    username: 'Kevin',
    designation: 'UI / UX Designer',
    position: 'UI / UX Designer',
    location: 'San Francisco, California',
    address: 'San Francisco, California',
    email: 'kevin_at@technologies@gmail.com',
    phone: '+01-222-345678',
    profileImage: '',
    groupParticipants: [{
      id: 1,
      name: 'Marketing',
      avatar: ''
    }],
    media: [
      { url: '/api/placeholder/150/150', type: 'image' },
      { url: '/api/placeholder/150/150', type: 'image' },
      { url: '/api/placeholder/150/150', type: 'image' }
    ]
  };

  // Get user data with fallbacks for different field names
  const { 
    name: userName, 
    username,
    email, 
    phone, 
    location,
    address, 
    designation,
    position, 
    groupParticipants, 
    media,
    profileImage 
  } = user;

  // Provide fallbacks if fields are undefined
  const name = userName || username || 'Unknown User';
  const userDesignation = designation || position || '';
  const userLocation = location || address || '';
  const avatar = profileImage;
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Helper to generate random colors for participant badges
  const getColorClass = (id: number): string => {
    const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800'];
    return colors[id % colors.length];
  };

  return (
    <div className='h-full overflow-y-auto bg-white'>
      <div className='p-4 border-b flex justify-between items-center'>
        <h2 className='text-lg font-semibold'>User Information</h2>
        <button 
          className='text-gray-400 hover:text-gray-600'
          onClick={onClose}
        >
          <XMarkIcon className='h-5 w-5' />
        </button>
      </div>
      
      {/* User profile header */}
      <div className='p-6 flex flex-col items-center'>
        {avatar ? (
          <img 
            src={avatar} 
            alt={name} 
            className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm'
          />
        ) : (
          <div className='w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-light text-gray-500'>
            {initials}
          </div>
        )}
        <h2 className='text-xl font-semibold mt-4'>{name}</h2>
        <p className='text-gray-600 text-sm'>{userDesignation}</p>
        <p className='text-sm text-gray-500 flex items-center mt-2'>
          <MapPinIcon className='w-4 h-4 mr-1' />
          {userLocation}
        </p>
      </div>
      
      {/* Contact information */}
      <div className='px-6 py-4 border-t'>
        <h3 className='font-semibold text-gray-700 mb-3'>Contact Information</h3>
        <div className='space-y-4'>
          <div className='flex items-center'>
            <PhoneIcon className='h-5 w-5 text-gray-500 mr-3' />
            <div>
              <p className='text-xs text-gray-500'>Phone</p>
              <p className='text-sm text-gray-800'>{phone}</p>
            </div>
          </div>
        
          <div className='flex items-center'>
            <EnvelopeIcon className='h-5 w-5 text-gray-500 mr-3' />
            <div>
              <p className='text-xs text-gray-500'>Email</p>
              <p className='text-sm text-gray-800'>{email}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Group participants */}
      {groupParticipants && groupParticipants.length > 0 && (
        <div className='px-6 py-4 border-t'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-gray-700'>Group Participants</h3>
            <InformationCircleIcon className='h-5 w-5 text-gray-400' />
          </div>
          
          <div className='mt-3'>
            {groupParticipants.map((participant: Participant) => (
              <div key={participant.id} className='flex items-center mt-2'>
                <div className={`w-8 h-8 rounded-full ${getColorClass(participant.id)} flex items-center justify-center text-xs font-medium mr-2`}>
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                <span className='text-sm'>{participant.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Media gallery */}
      {media && media.length > 0 && (
        <div className='px-6 py-4 border-t'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-gray-700'>Media</h3>
            <InformationCircleIcon className='h-5 w-5 text-gray-400' />
          </div>
          <div className='grid grid-cols-3 gap-2 mt-3'>
            {media.map((item: MediaItem, index: number) => (
              <div key={index} className='rounded overflow-hidden'>
                <img 
                  src={item.url} 
                  alt={`Media ${index}`} 
                  className='w-full h-20 object-cover'
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;