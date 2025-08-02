'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { queries, type Officer } from '@/lib/supabase';

export default function OfficerSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setOfficers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await queries.officers.search(query);
      setOfficers(results || []);
    } catch (err) {
      setError('Failed to search officers. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-terminal font-bold uppercase tracking-wider">Cop-Watch Officer Search</h1>
            <p className="text-gray-400 mt-2 font-terminal">Search our database of officers, view their public records, and see associated incident reports.</p>
          </div>

          {/* Search Interface */}
          <Card className="p-6 mb-8 bg-black/50 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, badge number, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white font-terminal placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSearch(searchQuery)}
                  disabled={loading}
                  className="px-6 py-4 bg-white text-black font-terminal uppercase font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-4 border border-gray-700 text-white font-terminal uppercase font-bold hover:border-white transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="p-4 mb-6 bg-red-900/20 border border-red-500/50">
              <p className="text-red-400 font-terminal">{error}</p>
            </Card>
          )}

          {/* Results */}
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-gray-400 font-terminal">Searching officers...</p>
              </div>
            )}

            {!loading && officers.length === 0 && searchQuery && (
              <Card className="p-8 text-center bg-black/50 border border-gray-700">
                <p className="text-gray-400 font-terminal">No officers found matching your search.</p>
              </Card>
            )}

            {!loading && officers.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 font-terminal">
                  Found {officers.length} officer{officers.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {officers.map((officer) => (
              <Card key={officer.id} className="p-6 bg-black/50 border border-gray-700 hover:border-white transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-terminal font-bold text-white">
                        {officer.first_name} {officer.last_name}
                      </h3>
                      <Badge className={`${
                        officer.status === 'active' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/50' 
                          : 'bg-red-500/10 text-red-400 border-red-500/50'
                      } border`}>
                        {officer.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 font-terminal">
                      <div>
                        <span className="text-gray-500">Badge:</span> {officer.badge_number}
                      </div>
                      <div>
                        <span className="text-gray-500">Rank:</span> {officer.rank || 'N/A'}
                      </div>
                      <div>
                        <span className="text-gray-500">Department:</span> {officer.department?.name || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-700 text-white font-terminal uppercase text-sm hover:border-white transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-white text-black font-terminal uppercase text-sm hover:bg-gray-200 transition-colors">
                      View Incidents
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}