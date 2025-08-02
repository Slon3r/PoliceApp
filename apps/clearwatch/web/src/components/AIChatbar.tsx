'use client';

import React, { useState } from 'react';

interface AIChatbarProps {
  placeholder?: string;
}

export function AIChatbar({ placeholder = "Access intelligence grid or report an incident..." }: AIChatbarProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: Implement AI chat functionality
      console.log('AI Message:', message);
      setMessage('');
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none" style={{ zIndex: 10 }}>
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 flex items-center pointer-events-auto">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-transparent text-white font-terminal text-base focus:outline-none mx-2" 
            placeholder={placeholder}
          />
          <button type="submit" className="p-2 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
      </div>
    </footer>
  );
} 