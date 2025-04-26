import { createSupabaseClient } from './utils/supabase'

async function startServer() {
  console.log('Starting server...')

  try {
    console.log('Hello world')
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()
