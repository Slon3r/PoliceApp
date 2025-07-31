import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface TimeRange {
  start_date?: string
  end_date?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get department ID and time range from query params
    const url = new URL(req.url)
    const departmentId = url.searchParams.get('department_id')
    const timeRange: TimeRange = {
      start_date: url.searchParams.get('start_date') ?? undefined,
      end_date: url.searchParams.get('end_date') ?? undefined,
    }

    if (!departmentId) {
      return new Response(
        JSON.stringify({ error: 'Department ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get department details
    const { data: department, error: deptError } = await supabaseClient
      .from('departments')
      .select('*')
      .eq('id', departmentId)
      .single()

    if (deptError || !department) {
      return new Response(
        JSON.stringify({ error: 'Department not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Build incident query
    let incidentQuery = supabaseClient
      .from('incidents')
      .select(`
        *,
        officers:officer_incidents(
          officer:officers(
            id,
            badge_number,
            first_name,
            last_name,
            rank,
            department_id
          )
        )
      `)
      .eq('officer_incidents.officer.department_id', departmentId)

    if (timeRange.start_date) {
      incidentQuery = incidentQuery.gte('occurred_at', timeRange.start_date)
    }
    if (timeRange.end_date) {
      incidentQuery = incidentQuery.lte('occurred_at', timeRange.end_date)
    }

    const { data: incidents, error: incidentError } = await incidentQuery

    if (incidentError) {
      return new Response(
        JSON.stringify({ error: incidentError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get officer statistics
    const { data: officers, error: officerError } = await supabaseClient
      .from('officers')
      .select('*')
      .eq('department_id', departmentId)

    if (officerError) {
      return new Response(
        JSON.stringify({ error: officerError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Calculate statistics
    const stats = {
      department: department,
      total_officers: officers?.length ?? 0,
      total_incidents: incidents?.length ?? 0,
      incidents_by_type: incidents?.reduce((acc, incident) => {
        const type = incident.type
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      incidents_by_month: incidents?.reduce((acc, incident) => {
        const month = new Date(incident.occurred_at).toISOString().slice(0, 7) // YYYY-MM
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      officers_with_incidents: new Set(
        incidents?.flatMap(i => 
          i.officers.map(o => o.officer.id)
        )
      ).size,
      repeat_officers: incidents?.reduce((acc, incident) => {
        incident.officers.forEach(o => {
          const officerId = o.officer.id
          acc[officerId] = (acc[officerId] || 0) + 1
        })
        return acc
      }, {} as Record<string, number>),
      incident_locations: incidents?.map(i => ({
        type: i.type,
        location: i.location,
        occurred_at: i.occurred_at
      }))
    }

    // Calculate trends
    const trends = {
      incident_growth: calculateGrowthRate(stats.incidents_by_month),
      high_risk_officers: Object.entries(stats.repeat_officers || {})
        .filter(([_, count]) => count > 2)
        .map(([officerId, count]) => ({
          officer: officers?.find(o => o.id === officerId),
          incident_count: count
        })),
      most_common_type: Object.entries(stats.incidents_by_type || {})
        .sort(([, a], [, b]) => b - a)[0]?.[0]
    }

    return new Response(
      JSON.stringify({
        data: {
          stats,
          trends
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function calculateGrowthRate(monthlyData: Record<string, number>): number {
  const months = Object.keys(monthlyData).sort()
  if (months.length < 2) return 0

  const firstMonth = monthlyData[months[0]]
  const lastMonth = monthlyData[months[months.length - 1]]
  const monthCount = months.length

  // Calculate monthly growth rate
  return monthCount > 1
    ? ((lastMonth / firstMonth) ** (1 / (monthCount - 1)) - 1) * 100
    : 0
}