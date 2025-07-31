import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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

    // Get incident ID from URL
    const url = new URL(req.url)
    const incidentId = url.searchParams.get('id')

    if (!incidentId) {
      return new Response(
        JSON.stringify({ error: 'Incident ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Fetch incident details with related data
    const { data: incident, error: incidentError } = await supabaseClient
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
            department:departments(
              id,
              name,
              city,
              state
            )
          ),
          role
        ),
        complaints(
          id,
          status,
          description,
          evidence_urls,
          witness_contact_info,
          created_at,
          submitted_by:auth.users!complaints_submitted_by_fkey(
            email
          )
        )
      `)
      .eq('id', incidentId)
      .single()

    if (incidentError) {
      return new Response(
        JSON.stringify({ error: incidentError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!incident) {
      return new Response(
        JSON.stringify({ error: 'Incident not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get statistics for the involved officers
    const officerIds = incident.officers.map(o => o.officer.id)
    const { data: officerStats, error: statsError } = await supabaseClient
      .from('officer_incidents')
      .select(`
        officer_id,
        incident:incidents(
          type,
          created_at
        )
      `)
      .in('officer_id', officerIds)

    if (statsError) {
      console.error('Error fetching officer statistics:', statsError)
    }

    // Process officer statistics
    const stats = officerIds.map(officerId => {
      const officerIncidents = officerStats?.filter(s => s.officer_id === officerId) ?? []
      return {
        officer_id: officerId,
        total_incidents: officerIncidents.length,
        incidents_by_type: officerIncidents.reduce((acc, curr) => {
          const type = curr.incident.type
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        incidents_timeline: officerIncidents
          .sort((a, b) => new Date(a.incident.created_at).getTime() - new Date(b.incident.created_at).getTime())
          .map(i => ({
            type: i.incident.type,
            date: i.incident.created_at
          }))
      }
    })

    return new Response(
      JSON.stringify({
        data: {
          incident,
          officer_statistics: stats
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