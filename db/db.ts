import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { config } from 'dotenv'

config({ path: '.env' })

// Create postgres client with SSL enabled
const connectionString = process.env.DATABASE_URL

const client = postgres(connectionString!, {
  prepare: false,
  ssl: {
    rejectUnauthorized: false
  },
  max: 1
})

// Create drizzle database instance
export const db = drizzle(client, { schema })

// Export types
export type Database = typeof db 