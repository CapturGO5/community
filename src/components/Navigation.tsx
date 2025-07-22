'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { usePrivy } from '@privy-io/react-auth';
import Modal from './Modal';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout>();
  const { login, authenticated, logout } = usePrivy();

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleRedirect = () => {
    window.location.href = "https://capturgo.com";
  };

  return (
    <>
      <nav className="bg-black/50 backdrop-blur-md fixed w-full z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo */}
              <Logo />
            </div>
            
            <div className="hidden sm:flex sm:space-x-8 items-center">
              <button
                onClick={handleWebsiteClick}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Website
              </button>
              <Link href="/ecosystem" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Ecosystem
              </Link>
              <Link href="/leaderboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Leaderboard
              </Link>
              
              {authenticated ? (
                <div 
                  className="relative" 
                  onMouseEnter={() => {
                    if (closeTimeoutRef.current) {
                      clearTimeout(closeTimeoutRef.current);
                    }
                    setIsDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    closeTimeoutRef.current = setTimeout(() => {
                      setIsDropdownOpen(false);
                    }, 300); // 300ms delay before closing
                  }}
                >
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-white/70 hover:text-white transition flex items-center gap-2 select-none"
                  >
                    Profile
                    <svg
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className={`absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg rounded-md shadow-lg py-1 border border-white/10 transition-all duration-200 ${isDropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                  >
                    <div className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10">
                      Logout
                    </div>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => login()}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={handleWebsiteClick}
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Website
            </button>
            <Link
              href="/ecosystem"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Ecosystem
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Leaderboard
            </Link>

            {authenticated ? (
              <>
                <Link 
                  href="/profile" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white/70 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-white/70 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  login();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-white/70 hover:text-white"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRedirect}
        title="Main Website"
        message="You will be redirected to the capturGO.com main site. Would you like to proceed?"
      />
    </>
  );
}
