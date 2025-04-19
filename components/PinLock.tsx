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

  // Create number buttons 0-9
  const numberButtons = [];
  for (let i = 1; i <= 9; i++) {
    numberButtons.push(
      <button
        key={i}
        onClick={() => handleNumberClick(i)}
        className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold flex items-center justify-center shadow-md transition-colors"
      >
        {i}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-100 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Enter PIN</h2>

        {/* PIN display */}
        <div className={`mb-6 flex gap-3 ${shake ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 ${
                pin.length > i
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-stone-300'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {numberButtons}
          <button
            onClick={handleClear}
            className="w-16 h-16 rounded-full bg-stone-300 hover:bg-stone-400 text-stone-800 text-sm font-bold flex items-center justify-center shadow-md transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick(0)}
            className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold flex items-center justify-center shadow-md transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-stone-300 hover:bg-stone-400 text-stone-800 text-xl font-bold flex items-center justify-center shadow-md transition-colors"
          >
            ←
          </button>
        </div>

        {/* Remember Me checkbox */}
        <div className="flex items-center mt-2 mb-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-blue-500 rounded border-stone-300 focus:ring-blue-500"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-stone-600">
            Remember me on this device
          </label>
        </div>
      </div>
    </div>
  );
}
