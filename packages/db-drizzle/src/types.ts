import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import * as schema from './schema'

export { schema }

export { and, asc, desc, eq, like, not, or } from 'drizzle-orm'

export type Log = InferSelectModel<typeof schema.logs>
export type NewLog = InferInsertModel<typeof schema.logs>
