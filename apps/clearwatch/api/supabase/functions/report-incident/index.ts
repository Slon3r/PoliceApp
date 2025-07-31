import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface IncidentReport {
  type: 'use_of_force' | 'misconduct' | 'discrimination' | 'harassment' | 'other'
  description: string
  location: {
    latitude: number
    longitude: number
  }
  occurred_at: string
  officers: Array<{
    badge_number?: string
    department_id?: string
    role: string
    description?: string
  }>
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get the request body
    const report: IncidentReport = await req.json()

    // Validate required fields
    if (!report.type || !report.description || !report.location || !report.occurred_at) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Start a database transaction
    const { data: incident, error: incidentError } = await supabaseClient
      .from('incidents')
      .insert({
        type: report.type,
        description: report.description,
        location: `POINT(${report.location.longitude} ${report.location.latitude})`,
        occurred_at: report.occurred_at,
      })
      .select()
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

    // Link officers to the incident if provided
    if (report.officers && report.officers.length > 0) {
      const officerLinks = []

      for (const officer of report.officers) {
        let officerId = null

        // Try to find the officer by badge number and department if provided
        if (officer.badge_number && officer.department_id) {
          const { data: existingOfficer } = await supabaseClient
            .from('officers')
            .select('id')
            .eq('badge_number', officer.badge_number)
            .eq('department_id', officer.department_id)
            .single()

          if (existingOfficer) {
            officerId = existingOfficer.id
          }
        }

        // Link the officer to the incident
        if (officerId) {
          officerLinks.push({
            officer_id: officerId,
            incident_id: incident.id,
            role: officer.role,
          })
        }
      }

      // Insert officer links if any were found
      if (officerLinks.length > 0) {
        const { error: linkError } = await supabaseClient
          .from('officer_incidents')
          .insert(officerLinks)

        if (linkError) {
          console.error('Error linking officers:', linkError)
        }
      }
    }

    // Create an initial complaint for this incident
    const { data: complaint, error: complaintError } = await supabaseClient
      .from('complaints')
      .insert({
        incident_id: incident.id,
        submitted_by: user.id,
        status: 'pending',
        description: report.description,
      })
      .select()
      .single()

    if (complaintError) {
      return new Response(
        JSON.stringify({ error: complaintError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        data: {
          incident,
          complaint,
        },
      }),
      {
        status: 201,
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