import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const logs = pgTable('logs', {
	id: serial().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	message: text().notNull(),
})
