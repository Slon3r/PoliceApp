import React from 'react';
import { Header } from '@/components/Header';
import { AIChatbar } from '@/components/AIChatbar';

// --- Main Page Component ---
export default function MediaHubPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow flex flex-col items-center w-full p-4 md:p-8">
        <div className="w-full max-w-4xl text-center">
          
          <div className="mb-12">
              <h2 className="font-sans text-4xl md:text-6xl font-bold uppercase tracking-wider">Media Command</h2>
              <p className="text-gray-400 mt-2 font-terminal">Control the narrative. Share the truth.</p>
          </div>

          {/* Core Action Buttons */}
          <div className="space-y-6">
              
              {/* Porkchop Feed Link */}
              <a href="/media/porkchop-feed" className="block p-8 border-2 border-gray-700 hover:border-white hover:bg-gray-900 transition-all duration-300">
                  <h3 className="font-sans text-3xl font-bold uppercase tracking-wider">Porkchop Feed</h3>
                  <p className="mt-2 text-gray-400 max-w-2xl mx-auto">Watch a short-form video feed of comical, entertaining, and empowering interactions with law enforcement.</p>
              </a>

              {/* Clearwatch Newsdesk Link */}
              <a href="/media/newsdesk" className="block p-8 border-2 border-gray-700 hover:border-white hover:bg-gray-900 transition-all duration-300">
                  <h3 className="font-sans text-3xl font-bold uppercase tracking-wider">Clearwatch Newsdesk</h3>
                  <p className="mt-2 text-gray-400 max-w-2xl mx-auto">Access our daily, in-depth, AI-generated video reports on user-submitted incidents, focusing on the legally technical details.</p>
              </a>

              {/* Submit Evidence Link */}
              <a href="/submit-evidence" className="block p-8 border-2 border-white bg-white text-black hover:bg-gray-300 hover:border-gray-300 transition-all duration-300">
                  <h3 className="font-sans text-3xl font-bold uppercase tracking-wider">Submit Evidence</h3>
                  <p className="mt-2 max-w-2xl mx-auto">Your evidence fuels your media. Submit videos and reports to be featured.</p>
              </a>

          </div>

        </div>
      </main>

      {/* AI Assistant Chatbar */}
      <AIChatbar placeholder="Explore our media, search videos, or create one..." />
    </div>
  );
} 