"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react"; // Import signIn for use in the modal
// ButtonSignin component will be modified or its usage changed.
// For now, we'll define how Header expects to interact with a sign-in trigger.
import ButtonSignin from "./ButtonSignin"; // Keep original for authenticated state for now
import logo from "@/app/icon.png";
import config from "@/config";

// --- AuthModal Component (DaisyUI) ---
// This modal handles both Login and Register forms
const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [error, setError] = useState(''); // For displaying login/register errors
  const [loading, setLoading] = useState(false); // For loading state on submit

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode); // Reset to initial mode when modal opens
      setError(''); // Clear previous errors
      // Clear form fields
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, initialMode]);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false, // Important: handle redirect manually or based on result
        email,
        password,
        callbackUrl: config.auth.callbackUrl || '/',
      });

      setLoading(false);
      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
      } else if (result?.ok) {
        onClose(); // Close modal on successful login
        // Router will typically redirect if callbackUrl is set and signIn is successful
        // Or you can manually push router.push(result.url || config.auth.callbackUrl || '/');
      }
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn('google', { callbackUrl: config.auth.callbackUrl || '/' });
    // Modal will likely be obscured by Google sign-in page, no need to explicitly close for this path usually
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      // **IMPORTANT**: Replace with your actual API call to your registration endpoint
      const response = await fetch('/api/auth/register', { // Example endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      setLoading(false);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
      } else {
        // Registration successful, now attempt to sign in the new user
        console.log("Registration successful. Attempting login...");
        const loginResult = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: config.auth.callbackUrl || '/',
        });
        if (loginResult?.ok) {
          onClose();
        } else {
          setError("Registration successful, but auto-login failed. Please log in manually.");
          setMode('login'); // Switch to login mode
        }
      }
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred during registration.");
      console.error("Registration error:", err);
    }
  };


  return (
    <dialog id="auth_modal" className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-md p-6 md:p-8 rounded-lg shadow-xl bg-base-100 relative">
        <button // Changed from form to button for direct control
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-10"
          >
            ✕
        </button>

        {mode === 'login' && (
          <>
            <h3 className="font-bold text-2xl text-center mb-6 text-base-content">
              <span className="text-primary">{config.appName}</span> Login
            </h3>
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-base-content mb-1">Email</label>
                <input type="email" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="input input-bordered w-full rounded-md" />
              </div>
              <div>
                <label htmlFor="login-password"className="block text-sm font-medium text-base-content mb-1">Password</label>
                <input type="password" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your Password" className="input input-bordered w-full rounded-md" />
              </div>
              {error && <p className="text-error text-sm text-center">{error}</p>}
              <button type="submit" className="btn btn-primary w-full mt-6 rounded-md" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Sign In"}
              </button>
            </form>
            <div className="divider my-6">OR</div>
            <button onClick={handleGoogleSignIn} className="btn btn-outline w-full rounded-md flex items-center justify-center gap-2" disabled={loading}>
              <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5"/> Sign In with Google
            </button>
            <p className="text-center text-sm mt-6 text-base-content">
              Don&apos;t have an account?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="link link-primary font-medium">Sign Up</button>
            </p>
          </>
        )}

        {mode === 'register' && (
          <>
            <h3 className="font-bold text-2xl text-center mb-6 text-base-content">
              <span className="text-primary">{config.appName}</span> Register
            </h3>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-base-content mb-1">Name</label>
                <input type="text" id="reg-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your Name" className="input input-bordered w-full rounded-md" />
              </div>
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-base-content mb-1">Email</label>
                <input type="email" id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="input input-bordered w-full rounded-md" />
              </div>
              <div>
                <label htmlFor="reg-password"className="block text-sm font-medium text-base-content mb-1">Password</label>
                <input type="password" id="reg-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create Password" className="input input-bordered w-full rounded-md" />
              </div>
              <div>
                <label htmlFor="reg-confirmPassword"className="block text-sm font-medium text-base-content mb-1">Confirm Password</label>
                <input type="password" id="reg-confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm Password" className="input input-bordered w-full rounded-md" />
              </div>
              {error && <p className="text-error text-sm text-center">{error}</p>}
              <button type="submit" className="btn btn-primary w-full mt-6 rounded-md" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
              </button>
            </form>
            <p className="text-center text-sm mt-6 text-base-content">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="link link-primary font-medium">Sign In</button>
            </p>
          </>
        )}
      </div>
      {/* Click outside to close: The modal-backdrop part of DaisyUI handles this if the modal is opened with .showModal() on the dialog element,
          or by structure if using the checkbox hack. For controlled components, this form is one way. */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};


const navLinks = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

const Header = () => {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [searchParams]);

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAuthModalOpen]);

  const openAuthModal = useCallback((mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsSidebarOpen(false); // Ensure sidebar is closed when auth modal opens
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <>
      <header className="bg-base-200 sticky top-0 z-40 shadow-sm">
        <nav className="container flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 mx-auto" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link className="flex items-center gap-2 shrink-0" href="/" title={`${config.appName} homepage`}>
              <Image src={logo} alt={`${config.appName} logo`} className="w-8 h-8" placeholder="blur" priority={true} width={32} height={32} />
              <span className="font-extrabold text-lg text-base-content">{config.appName}</span>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-base-content" onClick={() => setIsSidebarOpen(true)} aria-label="Open main menu">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
          </div>

          <div className="hidden lg:flex lg:justify-center lg:gap-x-8 xl:gap-x-12 lg:items-center">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href} className="link link-hover text-sm font-medium text-base-content py-2" title={link.label}>{link.label}</Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:justify-end lg:flex-1 items-center gap-3"> {/* Increased gap slightly */}
            {/* Use OriginalButtonSignin for authenticated view, or custom button for login trigger */}
            <ButtonSignin extraStyle="btn-primary btn-outline btn-sm" onOpenLoginModal={() => openAuthModal('login')} />
          </div>
        </nav>

        {/* Mobile menu sidebar */}
        <div className={`lg:hidden relative z-50 ${isSidebarOpen ? "" : "hidden"}`}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" aria-hidden="true" onClick={() => setIsSidebarOpen(false)}></div>
          <div className={`fixed inset-y-0 right-0 z-50 w-full px-6 py-4 overflow-y-auto bg-base-200 sm:max-w-xs ring-1 ring-black/10 transform transition-transform ease-in-out duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex items-center justify-between mb-6">
              <Link className="flex items-center gap-2 shrink-0" title={`${config.appName} homepage`} href="/" onClick={() => setIsSidebarOpen(false)}>
                <Image src={logo} alt={`${config.appName} logo`} className="w-8 h-8" width={32} height={32} />
                <span className="font-extrabold text-lg text-base-content">{config.appName}</span>
              </Link>
              <button type="button" className="btn btn-sm btn-circle btn-ghost text-base-content" onClick={() => setIsSidebarOpen(false)} aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flow-root">
              <div className="py-2 divide-y divide-base-300">
                <div className="space-y-2 py-4">
                  {navLinks.map((link) => (
                    <Link href={link.href} key={link.href} className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-base-content hover:bg-base-300" title={link.label} onClick={() => setIsSidebarOpen(false)}>{link.label}</Link>
                  ))}
                </div>
                <div className="py-6 space-y-3">
                  {/* Mobile Sign In Button - now triggers modal */}
                  <ButtonSignin extraStyle="btn btn-outline btn-primary w-full" onOpenLoginModal={() => openAuthModal('login')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} />
    </>
  );
};

export default Header;
