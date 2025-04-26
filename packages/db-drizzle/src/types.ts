import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as schema from "./generated/schema";

// Export the schema itself
export { schema };

// Re-export useful Drizzle utilities
export { eq, and, or, like, not, desc, asc } from "drizzle-orm";

// Export select types (for fetching data)
//export type Log = InferSelectModel<typeof schema.logs>;
