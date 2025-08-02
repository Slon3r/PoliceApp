import React from 'react';
import { Header } from '@/components/Header';
import { AIChatbar } from '@/components/AIChatbar';

// --- Main Page Component ---
export default function ToolkitHubPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow flex flex-col items-center w-full p-4 md:p-8">
        <div className="w-full max-w-4xl text-center">
          
          <div className="mb-12">
              <h2 className="font-terminal text-4xl md:text-6xl font-bold uppercase">Activist Toolkit</h2>
              <p className="text-gray-400 mt-2">Knowledge and materials for direct action.</p>
          </div>

          {/* Core Toolkit Sections */}
          <div className="space-y-6">
              
              {/* The Arsenal */}
              <a href="/toolkit/arsenal" className="block p-8 border-2 border-gray-700 hover:border-white hover:bg-gray-900 transition-all duration-300">
                  <h3 className="font-terminal text-3xl font-bold uppercase">The Arsenal: Downloadable Pack</h3>
                  <p className="mt-2 text-gray-400 max-w-2xl mx-auto">Download a complete pack of printable assets for direct action, including high-resolution fliers, street art stencils, and 'business review' cards for officers.</p>
              </a>

              {/* The Dojo */}
              <a href="/toolkit/dojo" className="block p-8 border-2 border-gray-700 hover:border-white hover:bg-gray-900 transition-all duration-300">
                  <h3 className="font-terminal text-3xl font-bold uppercase">The Dojo: AI Tactical Training</h3>
                  <p className="mt-2 text-gray-400 max-w-2xl mx-auto">Access our library of AI-narrated tutorials on effective and safe tactics, including our 'Distraction and Deception' kit and guides on using interaction scripts.</p>
              </a>

              {/* The Law */}
              <a href="/toolkit/law" className="block p-8 border-2 border-gray-700 hover:border-white hover:bg-gray-900 transition-all duration-300">
                  <h3 className="font-terminal text-3xl font-bold uppercase">The Law: Know Your Rights</h3>
                  <p className="mt-2 text-gray-400 max-w-2xl mx-auto">An essential library of legal information, including breakdowns of key Florida statutes, guides on your constitutional rights during police encounters, and the Rebuttal Bank.</p>
              </a>

          </div>

        </div>
      </main>

      {/* AI Assistant Chatbar */}
      <AIChatbar placeholder="Make direct action in your community without breaking the law..." />
    </div>
  );
} 