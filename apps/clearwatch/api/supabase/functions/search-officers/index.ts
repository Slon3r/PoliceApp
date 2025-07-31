import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SearchParams {
  badge_number?: string
  first_name?: string
  last_name?: string
  department_id?: string
  rank?: string
  limit?: number
  offset?: number
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

    // Get search parameters from query string
    const url = new URL(req.url)
    const searchParams: SearchParams = {
      badge_number: url.searchParams.get('badge_number') || undefined,
      first_name: url.searchParams.get('first_name') || undefined,
      last_name: url.searchParams.get('last_name') || undefined,
      department_id: url.searchParams.get('department_id') || undefined,
      rank: url.searchParams.get('rank') || undefined,
      limit: parseInt(url.searchParams.get('limit') || '10'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
    }

    // Build the query
    let query = supabaseClient
      .from('officers')
      .select(`
        *,
        department:departments(name, city, state),
        incidents:officer_incidents(
          incident:incidents(
            id,
            type,
            description,
            occurred_at
          )
        )
      `)

    // Add filters
    if (searchParams.badge_number) {
      query = query.ilike('badge_number', `%${searchParams.badge_number}%`)
    }
    if (searchParams.first_name) {
      query = query.ilike('first_name', `%${searchParams.first_name}%`)
    }
    if (searchParams.last_name) {
      query = query.ilike('last_name', `%${searchParams.last_name}%`)
    }
    if (searchParams.department_id) {
      query = query.eq('department_id', searchParams.department_id)
    }
    if (searchParams.rank) {
      query = query.ilike('rank', `%${searchParams.rank}%`)
    }

    // Add pagination
    query = query
      .limit(searchParams.limit)
      .offset(searchParams.offset)
      .order('last_name', { ascending: true })

    // Execute the query
    const { data, error } = await query

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get total count for pagination
    const { count } = await supabaseClient
      .from('officers')
      .select('*', { count: 'exact', head: true })

    return new Response(
      JSON.stringify({ 
        data,
        pagination: {
          total: count,
          limit: searchParams.limit,
          offset: searchParams.offset
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