'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { AIChatbar } from '@/components/AIChatbar';

// --- Main Page Component ---
export default function BuildCasePage() {
  const caseId = "7B4-E21-X9C"; // Example Case ID from previous step
  const [selectedCaseType, setSelectedCaseType] = useState('');

  const caseTypes = [
    { id: 'general', label: 'General Encounter', description: 'Any interaction with law enforcement' },
    { id: 'arrest', label: 'Arrest', description: 'You were arrested or detained' },
    { id: 'citation', label: 'Citation', description: 'You received a ticket or citation' },
    { id: 'traffic-stop', label: 'Traffic Stop', description: 'Vehicle was stopped by police' }
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow flex flex-col items-center w-full p-4 md:p-8 pb-64">
        <div className="w-full max-w-5xl">
          
          <div className="text-center mb-12">
              <h2 className="font-sans text-4xl md:text-6xl font-bold uppercase tracking-wider">Build a Case</h2>
              <p className="text-gray-400 mt-2 font-terminal">CASE ID: {caseId}</p>
          </div>

          <div className="space-y-8">
              {/* Step 1: Choose Case Type */}
              <div className="border border-gray-700 p-6">
                  <h3 className="font-terminal text-2xl font-bold text-white mb-4">// STEP 1: CHOOSE CASE TYPE</h3>
                  <p className="text-gray-300 mb-6">Select the type of encounter you experienced with law enforcement.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {caseTypes.map((type) => (
                          <button
                              key={type.id}
                              onClick={() => setSelectedCaseType(type.id)}
                              className={`p-6 border-2 text-left transition-all duration-300 ${
                                  selectedCaseType === type.id
                                      ? 'border-white bg-gray-900'
                                      : 'border-gray-700 hover:border-gray-500'
                              }`}
                          >
                              <h4 className="font-sans text-xl font-bold uppercase text-white">{type.label}</h4>
                              <p className="text-gray-400 mt-2">{type.description}</p>
                          </button>
                      ))}
                  </div>
              </div>

              {/* Step 2: Upload Evidence */}
              <div className="border border-gray-700 p-6">
                  <h3 className="font-terminal text-2xl font-bold text-white mb-4">// STEP 2: UPLOAD EVIDENCE</h3>
                  <p className="text-gray-300 mb-4">Add video evidence of your encounter. This will be analyzed by our AI.</p>
                  <div className="bg-gray-900 border-2 border-dashed border-gray-600 p-8 text-center">
                      <div className="text-gray-400 mb-4">
                          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                      </div>
                      <p className="text-white font-terminal">Drop your video file here or click to browse</p>
                      <p className="text-gray-400 text-sm mt-2">MP4, MOV, AVI files accepted</p>
                      <button className="mt-4 px-6 py-2 bg-white text-black font-terminal uppercase hover:bg-gray-300 transition-all duration-300">
                          Choose File
                      </button>
                  </div>
              </div>

                             {/* Step 3: AI Assistant */}
               <div className="border border-gray-700 p-6">
                   <h3 className="font-terminal text-2xl font-bold text-white mb-4">// STEP 3: AI ASSISTANT</h3>
                   <p className="text-gray-300 mb-4">Describe your encounter to our AI. It will help analyze your case and identify potential violations.</p>
               </div>

               {/* Extra space to prevent overlap with chatbar */}
               <div className="h-32"></div>

          </div>

        </div>
      </main>

      {/* AI Assistant Chatbar */}
      <AIChatbar placeholder="Describe your encounter in as much detail as possible..." />
    </div>
  );
} 