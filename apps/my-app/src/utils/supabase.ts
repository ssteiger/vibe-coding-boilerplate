import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import type { Database } from '../types/supabase'

// Load environment variables from .env file
dotenv.config()

// Initialize the Supabase client with environment variables
export const createSupabaseClient = (useServiceRole = false) => {
  const supabaseUrl = process.env.SUPABASE_API_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL')
  }

  // Select the appropriate key based on the context
  const supabaseKey = useServiceRole ? serviceRoleKey : anonKey

  if (!supabaseKey) {
    throw new Error(
      useServiceRole ? 'Missing Supabase service role key' : 'Missing Supabase anon key',
    )
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}
