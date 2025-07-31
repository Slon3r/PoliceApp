'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface DashboardStats {
  totalIncidents: number
  totalOfficers: number
  totalDepartments: number
  recentIncidents: Array<{
    id: string
    type: string
    description: string
    occurred_at: string
  }>
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [incidentsResult, officersResult, departmentsResult] = await Promise.all([
        supabase.from('incidents').select('id, type, description, occurred_at').order('occurred_at', { ascending: false }).limit(5),
        supabase.from('officers').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true })
      ])

      setStats({
        totalIncidents: incidentsResult.count || 0,
        totalOfficers: officersResult.count || 0,
        totalDepartments: departmentsResult.count || 0,
        recentIncidents: incidentsResult.data || []
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen p-4 md:p-8 bg-black text-white">
      
      {/* HUD Corner Brackets for the tactical feel */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white opacity-30"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white opacity-30"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white opacity-30"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white opacity-30"></div>

      {/* Header */}
      <header className="w-full flex justify-between items-center p-4 border-b border-gray-700">
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

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-start py-8 px-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400 font-terminal">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl space-y-8">
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-700 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="font-terminal text-lg text-gray-300">Total Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-terminal text-white">{stats?.totalIncidents || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="font-terminal text-lg text-gray-300">Active Officers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-terminal text-white">{stats?.totalOfficers || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="font-terminal text-lg text-gray-300">Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-terminal text-white">{stats?.totalDepartments || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Incidents */}
            <Card className="bg-gray-900 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="font-terminal text-xl text-white">Recent Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recentIncidents && stats.recentIncidents.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentIncidents.map((incident) => (
                      <div key={incident.id} className="flex items-start justify-between p-3 border border-gray-700 rounded">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="font-terminal text-xs">
                              {incident.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-400 font-terminal">
                              {new Date(incident.occurred_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 font-terminal">{incident.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 font-terminal">No recent incidents available</p>
                )}
              </CardContent>
            </Card>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700 text-white hover:border-white transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="font-terminal text-lg text-white">Search Officers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 font-terminal text-sm">Search and view officer records, badges, and incident history.</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 text-white hover:border-white transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="font-terminal text-lg text-white">View Incident Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 font-terminal text-sm">Interactive map showing incident locations and patterns.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Assistant Chatbar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 flex items-center">
            <input 
              type="text" 
              className="flex-grow bg-transparent text-white font-terminal text-base focus:outline-none mx-2" 
              placeholder="Ask me anything or tell me about your police interaction..." 
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