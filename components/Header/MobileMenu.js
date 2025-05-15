"use client";
import ButtonSignin from "../ButtonSignin";
import NavLinks from "./NavLinks";
import Logo from "../Logo";

const MobileMenu = ({ isOpen, onClose, openAuthModal }) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden relative z-50">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" 
        aria-hidden="true" 
        onClick={onClose}
      ></div>
      
      <div className="fixed inset-y-0 right-0 z-50 w-full px-6 py-4 overflow-y-auto bg-base-200 sm:max-w-xs ring-1 ring-black/10">
        <div className="flex items-center justify-between mb-6">
          <Logo/>
          <button 
            type="button" 
            className="btn btn-sm btn-circle btn-ghost text-base-content" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flow-root">
          <div className="py-2 divide-y divide-base-300">
            <NavLinks className="space-y-2 py-4" />
            
            <div className="py-6 space-y-3">
              <ButtonSignin 
                extraStyle="btn btn-outline btn-primary w-full" 
                onOpenLoginModal={() => openAuthModal('login')} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;