import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for your database schema
export type Department = {
  id: string;
  name: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
};

export type Officer = {
  id: string;
  badge_number: string;
  first_name: string;
  last_name: string;
  department_id: string;
  rank: string;
  status: string;
  created_at: string;
  updated_at: string;
  department?: Department;
};

export type Incident = {
  id: string;
  type: 'use_of_force' | 'misconduct' | 'discrimination' | 'harassment' | 'other';
  description: string;
  location: any; // PostGIS geometry type
  occurred_at: string;
  created_at: string;
  updated_at: string;
  officers?: Officer[];
};

export type Complaint = {
  id: string;
  incident_id: string;
  submitted_by: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  description: string;
  evidence_urls: string[];
  witness_contact_info: any;
  created_at: string;
  updated_at: string;
  incident?: Incident;
};

// Helper functions for common database operations
export const queries = {
  officers: {
    search: async (query: string) => {
      const { data, error } = await supabase
        .from('officers')
        .select(`
          *,
          department:departments(*)
        `)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,badge_number.ilike.%${query}%`)
        .limit(50);

      if (error) throw error;
      return data;
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('officers')
        .select(`
          *,
          department:departments(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  },

  incidents: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          officers:officer_incidents(
            officer:officers(*)
          )
        `)
        .order('occurred_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          officers:officer_incidents(
            officer:officers(*)
          ),
          complaints(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    getNearby: async (lat: number, lng: number, radiusMeters: number = 5000) => {
      const { data, error } = await supabase
        .rpc('get_incidents_within_radius', {
          lat,
          lng,
          radius_meters: radiusMeters
        });

      if (error) throw error;
      return data;
    }
  },

  departments: {
    getStats: async (departmentId: string) => {
      const { data, error } = await supabase
        .rpc('get_department_stats', {
          department_id: departmentId
        });

      if (error) throw error;
      return data;
    }
  }
};