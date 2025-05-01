// src/components/Sider/index.tsx

import React from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CogIcon
} from '@heroicons/react/24/solid';

interface SidebarIconProps {
  icon: React.ReactNode;
  tooltip?: string;
  isText?: boolean;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, tooltip, isText }) => (
  <div className={`sidebar-icon relative group ${isText ? 'bg-white text-primary' : ''}`}>
    {icon}
    {tooltip && (
      <span className="sidebar-tooltip group-hover:scale-100">
        {tooltip}
      </span>
    )}
  </div>
);

const Sider: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-primary text-white shadow-lg">
      <div className="flex items-center justify-center h-16 w-16">
        <div className="text-2xl font-bold">C</div>
      </div>
      
      <div className="flex-1 flex flex-col items-center mt-4">
        <SidebarIcon
          icon={<HomeIcon className="h-6 w-6" />}
          tooltip="Home"
        />
        <SidebarIcon
          icon={<UserGroupIcon className="h-6 w-6" />}
          tooltip="Users"
        />
        <SidebarIcon
          icon={<EnvelopeIcon className="h-6 w-6" />}
          tooltip="Messages"
        />
        <SidebarIcon
          icon={<CalendarIcon className="h-6 w-6" />}
          tooltip="Calendar"
        />
        <SidebarIcon
          icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
          tooltip="Chat"
        />
      </div>
      
      <div className="mb-16">
        <SidebarIcon
          icon={<CogIcon className="h-6 w-6" />}
          tooltip="Settings"
        />
      </div>
      
      <div className="mb-4">
        <SidebarIcon
          icon={<span className="text-base font-medium">US</span>}
          tooltip="Profile"
          isText={true}
        />
      </div>
    </div>
  );
};

export default Sider;