// src/components/Groups/index.tsx
import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useChat } from '../../context/useChatHook';
import { Group, Participant } from '../../api';

interface GroupItemProps {
  group: Group;
}

const GroupItem: React.FC<GroupItemProps> = ({ group }) => {
  const { name, members, id } = group;

  // Extract first letter for the icon
  const groupInitial = name ? name.charAt(0).toUpperCase() : 'G';

  // Get color based on id or first letter
  const colors = ['bg-red-100 text-red-800', 'bg-blue-100 text-blue-800', 'bg-yellow-100 text-yellow-800', 'bg-purple-100 text-purple-800', 'bg-green-100 text-green-800'];
  const colorIndex = ((id || (name ? name.charCodeAt(0) : 0)) % colors.length);
  const colorClass = colors[colorIndex];

  return (
    <div className='flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-100 rounded-md'>
      <div className={`flex items-center justify-center w-7 h-7 rounded-md ${colorClass}`}>
        {groupInitial}
      </div>
      <div className='ml-2 flex-1'>
        <div className='flex justify-between'>
          <h3 className='font-medium text-gray-900 text-sm'>{name}</h3>
        </div>
        {members && members.length > 0 && (
          <div className='flex -space-x-1 mt-0.5'>
            {members.slice(0, 3).map((member: Participant, index: number) => (
              <div
                key={index}
                className='w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs border border-white'
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {members.length > 3 && (
              <div className='w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white'>
                +{members.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Groups: React.FC = () => {
  const { groups } = useChat();

  return (
      <div className='py-3 px-3 border-t'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='font-bold text-gray-700 text-sm'>Groups ({groups.length || 0})</h3>
          <button className='text-primary hover:text-primary-light'>
            <PlusIcon className='h-4 w-4'/>
          </button>
        </div>
        <div className='space-y-1 overflow-y-auto' style={{ maxHeight: '180px' }}>
        {(!groups || groups.length === 0) ? (
          <p className="text-gray-500 text-xs">No groups available</p>
        ) : (
          groups.map(group => (
            <GroupItem key={group.id} group={group} />
          ))
        )}
        </div>
      </div>
  );
};

export default Groups;