'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the wireframe map with SSR disabled
const BackgroundWireframeMap = dynamic(() => import('../src/components/BackgroundWireframeMap'), {
  ssr: false
});

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen p-4 md:p-8 bg-black text-white"
         style={{ zIndex: 1 }}>
      
      {/* Wireframe Map Layer - Above black background, below UI */}
      <BackgroundWireframeMap />
      
      {/* HUD Corner Brackets - Above everything */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white opacity-30" style={{ zIndex: 10 }}></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white opacity-30" style={{ zIndex: 10 }}></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white opacity-30" style={{ zIndex: 10 }}></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white opacity-30" style={{ zIndex: 10 }}></div>

      {/* Header - Above map */}
      <header className="w-full flex justify-between items-center p-4 border-b border-gray-700" style={{ zIndex: 10 }}>
        <div className="flex-shrink-0">
          <h1 className="font-terminal text-3xl md:text-5xl font-bold uppercase text-white">Clearwatch</h1>
          <p className="font-terminal text-sm md:text-base text-gray-400">Clearwater Police Intelligence Hub</p>
        </div>

        <nav className="hidden md:flex flex-grow items-center justify-end space-x-4 ml-16">
          <a href="/database" className="font-terminal text-lg uppercase p-3 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all duration-300">
            Database
          </a>
          <a href="/media" className="font-terminal text-lg uppercase p-3 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all duration-300">
            Media
          </a>
          <a href="/toolkit" className="font-terminal text-lg uppercase p-3 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all duration-300">
            Toolkit
          </a>
          <a href="/report" className="font-terminal text-lg uppercase p-3 bg-white text-black hover:bg-gray-300 transition-all duration-300">
            Submit Evidence
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area - Above map */}
      <main className="flex-grow flex flex-col items-center justify-center py-8 px-4" style={{ zIndex: 10 }}>
        <div className="text-center">
          <h2 className="font-terminal text-2xl text-white mb-4">Ready for Development</h2>
          <p className="text-gray-400">Your clean homepage - add new content here</p>
        </div>
      </main>

      {/* Floating AI Assistant Chatbar - Above map */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-center" style={{ zIndex: 10 }}>
        <div className="w-full max-w-2xl">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 flex items-center">
            <input 
              type="text" 
              className="flex-grow bg-transparent text-white font-terminal text-base focus:outline-none mx-2" 
              placeholder="Access intelligence grid or report an incident..." 
            />
            <button className="p-2 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}