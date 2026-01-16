"use client";

import { useState, useEffect, useCallback } from 'react';

interface PinLockProps {
  correctPin: string;
  onUnlock: (rememberMe: boolean) => void;
}

export default function PinLock({ correctPin, onUnlock }: PinLockProps) {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Function to handle number button clicks
  const handleNumberClick = (number: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
    }
  };

  // Function to handle delete button click
  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  // Function to handle clear button click
  const handleClear = () => {
    setPin('');
    setError(null);
  };

  // Function to validate the PIN
  const validatePin = useCallback(() => {
    if (pin === correctPin) {
      // Only store the PIN in local storage if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem('journal_pin_validated', pin);
      }
      setError(null);
      onUnlock(rememberMe);
    } else {
      setError('Incorrect PIN');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setPin(''), 300);
    }
  }, [pin, correctPin, onUnlock, rememberMe]);

  // Check PIN when it reaches 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      validatePin();
    }
  }, [pin, validatePin]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle numbers 0-9
      if (/^\d$/.test(e.key)) {
        handleNumberClick(parseInt(e.key));
      } 
      // Handle backspace
      else if (e.key === 'Backspace') {
        handleDelete();
      }
      // Handle escape to clear
      else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]); // Re-register if pin length changes to ensure handleNumberClick has latest state if needed
  // Actually, handleNumberClick uses functional update, so pin dependency might not be strictly necessary 
  // but it's safer if we ever change how handleNumberClick works.
  // Wait, handleNumberClick checks pin.length < 4. If it's not using functional update for that check, it needs pin.

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 animate-fade-in">
      <div className="glass p-10 rounded-3xl shadow-2xl w-80 flex flex-col items-center transition-all-custom border-glass-border">
        <h2 className="text-xl font-medium text-foreground/80 mb-8 font-outfit uppercase tracking-widest">Enter PIN</h2>

        {/* PIN display */}
        <div className={`mb-10 flex gap-4 ${shake ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all-custom border ${
                pin.length > i
                  ? 'bg-primary border-primary scale-110 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                  : 'bg-transparent border-foreground/20'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        <div className="h-6 mb-2">
          {error && (
            <p className="text-red-500 font-outfit text-xs animate-shake">{error}</p>
          )}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <button
              key={i}
              onClick={() => handleNumberClick(i)}
              className="w-14 h-14 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground text-2xl font-light font-outfit flex items-center justify-center transition-all-custom active:scale-90"
            >
              {i}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="w-14 h-14 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 text-[10px] uppercase font-bold font-outfit flex items-center justify-center transition-all-custom active:scale-95"
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick(0)}
            className="w-14 h-14 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground text-2xl font-light font-outfit flex items-center justify-center transition-all-custom active:scale-90"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground text-xl flex items-center justify-center transition-all-custom active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>

        {/* Remember Me checkbox */}
        <div className="flex items-center group cursor-pointer">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="hidden"
          />
          <div 
            onClick={() => setRememberMe(!rememberMe)}
            className={`h-4 w-4 rounded-sm border mr-3 flex items-center justify-center transition-all-custom ${
              rememberMe ? 'bg-primary border-primary' : 'border-foreground/20 group-hover:border-foreground/40'
            }`}
          >
            {rememberMe && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <label htmlFor="rememberMe" className="text-xs text-foreground/50 font-outfit cursor-pointer group-hover:text-foreground/70 transition-colors">
            Remember this device
          </label>
        </div>
      </div>
    </div>
  );
}
