"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "../Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import AuthModal from "./AuthModal/AuthModal";
import ButtonSignin from "../ButtonSignin";
import config from "@/config";

const Header = () => {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Close mobile menu when search params change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [searchParams]);

  // Handle body overflow when modals are open
  useEffect(() => {
    if (isAuthModalOpen || isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAuthModalOpen, isSidebarOpen]);

  const openAuthModal = useCallback((mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsSidebarOpen(false);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <>
      <header className="bg-base-200 sticky top-0 z-40 shadow-sm">
        <nav className="container flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 mx-auto" aria-label="Global">
          <Logo />
          
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-base-content" 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open main menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          <NavLinks className="hidden lg:flex" />
          
          <div className="hidden lg:flex lg:justify-end lg:flex-1 items-center gap-3">
            <ButtonSignin 
              extraStyle="btn-primary btn-outline btn-sm" 
              onOpenLoginModal={() => openAuthModal('login')} 
            />
          </div>
        </nav>

        <MobileMenu 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          openAuthModal={openAuthModal}
        />
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        initialMode={authModalMode} 
      />
    </>
  );
};

export default Header;