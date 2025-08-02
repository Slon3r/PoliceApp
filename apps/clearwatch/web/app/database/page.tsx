'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { AIChatbar } from '@/components/AIChatbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DatabasePage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center w-full p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h2 className="font-terminal text-4xl md:text-6xl font-bold uppercase tracking-wider">Database</h2>
            <p className="text-gray-400 mt-2 font-terminal">Explore the intelligence we've gathered.</p>
          </div>

          {/* Database Sections */}
          <div className="space-y-6">
            {/* Incident Map Section */}
            <Link href="/">
              <Card className="group p-8 border-2 border-gray-700 hover:border-white transition-all duration-300 bg-black/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-terminal text-3xl font-bold uppercase tracking-wider text-white">Incident Map</h3>
                    <p className="mt-2 text-gray-400">View a real-time, interactive map of all reported incidents across the city.</p>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/50">
                    Interactive
                  </Badge>
                </div>
              </Card>
            </Link>

            {/* Officer Search Section */}
            <Link href="/database/officers">
              <Card className="group p-8 border-2 border-gray-700 hover:border-white transition-all duration-300 bg-black/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-terminal text-3xl font-bold uppercase tracking-wider text-white">Cop-Watch Officer Search</h3>
                    <p className="mt-2 text-gray-400">Search our database of officers, view their public records, and see associated incident reports.</p>
                  </div>
                  <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/50">
                    Searchable
                  </Badge>
                </div>
              </Card>
            </Link>

            {/* Data Dashboards Section */}
            <Link href="/database/dashboards">
              <Card className="group p-8 border-2 border-gray-700 hover:border-white transition-all duration-300 bg-black/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-terminal text-3xl font-bold uppercase tracking-wider text-white">Data Dashboards</h3>
                    <p className="mt-2 text-gray-400">Analyze high-level trends, statistics, and patterns in police misconduct with our data visualizations.</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border border-green-500/50">
                    Analytics
                  </Badge>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* AI Assistant Chatbar */}
      <AIChatbar placeholder="Search any information on the Clearwater Police..." />
    </div>
  );
}