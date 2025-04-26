import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as relations from "./generated/relations";
import * as schema from "./generated/schema";

// Create connection string with fallback
const connectionString =
	process.env.SUPABASE_DB_URL ||
	"postgres://postgres:postgres@localhost:5432/postgres";

// Configure postgres client with better defaults for production
const postgresClient = postgres(connectionString, {
	max: 10, // Increase connection pool size
	idle_timeout: 20, // Shorter idle timeout (seconds)
	connect_timeout: 10, // Connection timeout (seconds)
	prepare: false, // Disable prepared statements for Supabase compatibility
	onnotice: (notice) => {
		console.info("Postgres notice", notice);
	},
	onclose: (client) => {
		console.info("Postgres client closed", client);
	},
});

// Create and export database instance
export const postgres_db = drizzle(postgresClient, {
	schema: {
		...schema,
		...relations,
	},
});

// Export helper for transactions
export const transaction = postgresClient.begin;
