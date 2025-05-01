// src\App.tsx
import React, { useState, useEffect } from 'react';
import { ChatProvider } from './context/ChatProvider';
import Sider from './components/Sider';
import UserList from './components/UserList';
import Groups from './components/Groups';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';
import ErrorBoundary from './components/ErrorBoundary';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showMobileContacts, setShowMobileContacts] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  
  // Close sidebar on window resize (for better mobile experience)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileMenu(false);
        setShowMobileContacts(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = (): void => {
    setShowMobileMenu(!showMobileMenu);
    // Close contacts if opening sidebar
    if (!showMobileMenu) {
      setShowMobileContacts(false);
      setShowProfile(false);
    }
  };
  
  const toggleMobileContacts = (): void => {
    setShowMobileContacts(!showMobileContacts);
    // Close sidebar if opening contacts
    if (!showMobileContacts) {
      setShowMobileMenu(false);
      setShowProfile(false);
    }
  };

  const toggleProfile = (): void => {
    setShowProfile(!showProfile);
    // Close other panels on mobile
    if (!showProfile && window.innerWidth < 1024) {
      setShowMobileMenu(false);
      setShowMobileContacts(false);
    }
  };

  return (
    <ErrorBoundary>
      <ChatProvider>
        <div className="flex h-screen bg-gray-100 overflow-hidden">
          {/* Mobile Toggle Buttons */}
          <div className="fixed top-4 left-4 z-50 flex space-x-2 lg:hidden">
            <button
              className="p-2 bg-primary text-white rounded-md shadow-md mobile-touch-target"
              onClick={toggleMobileMenu}
              aria-label="Toggle sidebar"
            >
              {showMobileMenu ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            
            {/* Add contact list toggle button for mobile */}
            <button
              className="p-2 bg-primary text-white rounded-md shadow-md mobile-touch-target"
              onClick={toggleMobileContacts}
              aria-label="Toggle contacts"
            >
              {showMobileContacts ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Sidebar - Overlay on mobile, fixed on desktop */}
          <div 
            className={`
              ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} 
              lg:translate-x-0 fixed lg:static z-40 transition-transform duration-300 ease-in-out h-full
            `}
          >
            <Sider />
          </div>

          {/* Main content wrapper */}
          <div className="flex flex-1 relative">
            {/* User List & Groups - Overlay on mobile, auto height on desktop */}
            <div 
              className={`
                fixed inset-0 z-30 w-full lg:w-72 lg:static
                ${showMobileContacts ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                transition-transform duration-300 ease-in-out
                pt-14 lg:pt-0 bg-white lg:flex lg:flex-col web-compact-layout no-gap-container
              `}
            >
              <div className="flex flex-col h-full overflow-hidden">
                <UserList />
                <Groups />
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 relative">
              <Chat toggleProfile={toggleProfile} />
            </div>

            {/* Profile Sidebar - Overlay on all screens */}
            <div 
              className={`
                fixed inset-y-0 right-0 z-50 
                ${showProfile ? 'translate-x-0' : 'translate-x-full'} 
                transition-transform duration-300 ease-in-out
                w-full sm:w-3/4 md:w-2/5 lg:w-1/4 xl:w-1/5 border-l bg-white
                pt-14 lg:pt-0
              `}
            >
              <UserProfile onClose={toggleProfile} />
            </div>
          </div>
          
          {/* Mobile overlay backdrop for sidebar and contact list */}
          {(showMobileMenu || showMobileContacts || showProfile) && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => {
                setShowMobileMenu(false);
                setShowMobileContacts(false);
                setShowProfile(false);
              }}
            />
          )}
        </div>
      </ChatProvider>
    </ErrorBoundary>
  );
};

export default App;