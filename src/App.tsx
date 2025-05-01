import React, { useState } from 'react';
import { ChatProvider } from './context/ChatProvider';
import Sider from './components/Sider';
import UserList from './components/UserList';
import Groups from './components/Groups';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';
import ErrorBoundary from './components/ErrorBoundary';
import { XMarkIcon, Bars3Icon, UserIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const toggleMobileMenu = (): void => {
    setShowMobileMenu(!showMobileMenu);
    
    // If opening mobile menu, close profile panel
    if (!showMobileMenu) {
      setShowProfile(false);
    }
  };

  const toggleProfile = (): void => {
    setShowProfile(!showProfile);
    
    // If opening profile on mobile, close sidebar
    if (!showProfile && window.innerWidth < 1024) {
      setShowMobileMenu(false);
    }
  };

  return (
    <ErrorBoundary>
      <ChatProvider>
        <div className="flex h-screen bg-gray-100 overflow-hidden">
          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <button
              className="p-2 bg-primary text-white rounded-md shadow-md"
              onClick={toggleMobileMenu}
              aria-label="Toggle sidebar"
            >
              {showMobileMenu ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Sidebar - Hidden on mobile unless toggled */}
          <div className={`${showMobileMenu ? 'block' : 'hidden'} lg:block fixed lg:relative z-40`}>
            <Sider />
          </div>

          {/* Main content */}
          <div className="flex flex-1 ml-0 lg:ml-16">
            {/* User List - Hidden on mobile unless toggled */}
            <div 
              className={`
                ${showMobileMenu ? 'block fixed inset-0 z-30 pt-16' : 'hidden'} 
                lg:block lg:relative lg:pt-0 lg:inset-auto lg:z-auto w-full lg:w-1/4 xl:w-1/5
              `}
            >
              <div className="flex flex-col h-full">
                <UserList />
                <div className="lg:block">
                  <Groups />
                </div>
              </div>
            </div>

            {/* Chat Area - Hidden on mobile when sidebar is shown */}
            <div 
              className={`
                flex-1 
                ${showMobileMenu ? 'hidden' : 'block'} 
                lg:block
              `}
            >
              <Chat toggleProfile={toggleProfile} />
            </div>

            {/* Profile Sidebar - Hidden by default, toggle with button */}
            <div 
              className={`
                ${showProfile ? 'block fixed inset-0 z-50 pt-16 lg:pt-0 lg:w-1/4 xl:w-1/5 lg:relative lg:inset-auto' : 'hidden'} 
                lg:w-1/4 xl:w-1/5 border-l
              `}
            >
              <UserProfile onClose={toggleProfile} />
            </div>

            {/* Profile Toggle Button - Mobile only */}
            <div className="fixed bottom-4 right-4 lg:hidden z-30">
              <button
                className="p-3 bg-primary text-white rounded-full shadow-lg"
                onClick={toggleProfile}
                aria-label="Toggle user profile"
              >
                {showProfile ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <UserIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </ChatProvider>
    </ErrorBoundary>
  );
};

export default App;