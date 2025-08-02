'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Header } from '@/components/Header'
import { AIChatbar } from '@/components/AIChatbar'

// Dynamically import the wireframe map with SSR disabled
const BackgroundWireframeMap = dynamic(() => import('../src/components/BackgroundWireframeMap'), {
  ssr: false
});

export default function HomePage() {
  return (
    <div className="relative flex flex-col h-screen bg-black text-white overflow-hidden">
      
      {/* Header */}
      <Header />
      
      {/* Wireframe Map Layer - Above black background, below UI */}
      <BackgroundWireframeMap />
      
      {/* HUD Corner Brackets - Above everything */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white opacity-30" style={{ zIndex: 10 }}></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white opacity-30" style={{ zIndex: 10 }}></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white opacity-30" style={{ zIndex: 10 }}></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white opacity-30" style={{ zIndex: 10 }}></div>

      {/* Main Content Area - Allow map interaction below */}
      <main className="flex-grow flex flex-col items-center justify-center py-8 px-4 pointer-events-none" style={{ zIndex: 10 }}>
        {/* Content area ready for your components */}
        {/* Add pointer-events-auto to specific elements when you add content */}
      </main>

      {/* AI Assistant Chatbar */}
      <AIChatbar />
    </div>
  )
}