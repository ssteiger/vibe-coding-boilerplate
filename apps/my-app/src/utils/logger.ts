import { postgres_db, schema } from '@vibe-coding-boilerplate/db-drizzle'

/**
 * Logger utility for inserting log messages into the database
 */
export class Logger {
  /** Log an informational message to the database. */
  async info(message: string): Promise<void> {
    await this.log(message)
  }

  /** Log a warning message to the database. */
  async warn(message: string): Promise<void> {
    await this.log(`WARNING: ${message}`)
  }

  /** Log an error message to the database. */
  async error(message: string): Promise<void> {
    await this.log(`ERROR: ${message}`)
  }

  private async log(message: string): Promise<void> {
    console.log('LOG:', message)
    try {
      await postgres_db.insert(schema.logs).values({ message })
    } catch (error) {
      // Network/runtime failure - fall back to console only so callers don't crash.
      console.error('Failed to write to logs table:', error)
    }
  }
}

export const logger = new Logger()
