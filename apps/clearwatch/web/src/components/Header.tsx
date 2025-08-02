'use client';

import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full flex justify-between items-center p-6 border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex-shrink-0">
        <Link href="/" className="block">
          <h1 className="font-terminal text-4xl font-bold tracking-widest uppercase text-white">CLEARWATCH</h1>
          <p className="font-terminal text-sm text-gray-400">Clearwater Police Intelligence Hub</p>
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <Link 
          href="/database" 
          className="font-terminal text-lg uppercase text-white hover:text-gray-300 transition-all duration-300"
        >
          Database
        </Link>
        <Link 
          href="/media" 
          className="font-terminal text-lg uppercase text-white hover:text-gray-300 transition-all duration-300"
        >
          Media
        </Link>
        <Link 
          href="/toolkit" 
          className="font-terminal text-lg uppercase text-white hover:text-gray-300 transition-all duration-300"
        >
          Toolkit
        </Link>
        <Link 
          href="/submit-evidence" 
          className="font-terminal text-lg uppercase py-3 px-6 bg-white text-black hover:bg-gray-200 transition-all duration-300"
        >
          Submit Evidence
        </Link>
      </nav>
    </header>
  );
}