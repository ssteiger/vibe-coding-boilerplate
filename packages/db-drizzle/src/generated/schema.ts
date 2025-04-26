import { pgTable, text, serial, uuid, integer, date, index, foreignKey, timestamp, boolean, check, varchar, smallint, real, jsonb, unique, bigserial, primaryKey, pgView, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const job_run_status = pgTable("job_run_status", {
	job_run_status: text().primaryKey().notNull(),
});

export const mb_type = pgTable("mb_type", {
	membership_benefit_type: text().primaryKey().notNull(),
});

export const migration_import_data = pgTable("migration_import_data", {
	id: serial().primaryKey().notNull(),
	organization_id: uuid().notNull(),
	migration_import_id: uuid().notNull(),
	customer_id: text(),
	email: text(),
	points_balance: integer().notNull(),
	birthday: date(),
	membership_name: text(),
});

export const store_credit_usage_type = pgTable("store_credit_usage_type", {
	store_credit_usage_type: text().primaryKey().notNull(),
});

export const customer_membership = pgTable("customer_membership", {
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expires_at: timestamp({ withTimezone: true, mode: 'string' }),
	customer_id: text().notNull(),
	membership_id: uuid().notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	organization_id: uuid().notNull(),
}, (table) => {
	return {
		customer_id: index("customer_membership_customer_id").using("btree", table.customer_id.asc().nullsLast().op("text_ops")),
		customer_membership_customer_id_fkey: foreignKey({
			columns: [table.customer_id],
			foreignColumns: [shop_customer.id],
			name: "customer_membership_customer_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
		customer_membership_membership_id_fkey: foreignKey({
			columns: [table.membership_id],
			foreignColumns: [membership.id],
			name: "customer_membership_membership_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
		customer_membership_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "customer_membership_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const airdrop_campaign = pgTable("airdrop_campaign", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organization_id: uuid().notNull(),
	customer_segment_id: text().notNull(),
	amount: integer().notNull(),
	credit_expiry_days: integer(),
	customer_count: integer().default(0).notNull(),
	customer_segment_name: text().notNull(),
	event_id: text(),
	status: text().default('QUEUED').notNull(),
}, (table) => {
	return {
		airdrop_campaign_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "airdrop_campaign_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const birthday_reward_program = pgTable("birthday_reward_program", {
	organization_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	is_active: boolean().default(false).notNull(),
	amount: integer().notNull(),
	credit_expiry_days: integer(),
	credit_advance_days: integer().default(1).notNull(),
}, (table) => {
	return {
		birthday_reward_program_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "birthday_reward_program_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const branding_settings = pgTable("branding_settings", {
	organization_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ mode: 'string' }).defaultNow(),
	updated_at: timestamp({ mode: 'string' }).defaultNow(),
	show_branding: boolean().default(true).notNull(),
	primary_color: varchar({ length: 7 }).default('#003049').notNull(),
	primary_foreground_color: varchar({ length: 7 }).default('#ffffff').notNull(),
	radius: smallint().default(8).notNull(),
	launcher_vertical_alignment: text().default('middle').notNull(),
	launcher_horizontal_alignment: text().default('right').notNull(),
	launcher_spacing_x: integer().default(20).notNull(),
	launcher_spacing_y: integer().default(20).notNull(),
	launcher_is_active: boolean().default(false).notNull(),
	launcher_hide_on_mobile: boolean().default(false).notNull(),
	launcher_type: text().default('icon_and_text').notNull(),
	launcher_text: text().default('Store Credit').notNull(),
}, (table) => {
	return {
		fk_organization: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "fk_organization"
		}).onUpdate("cascade").onDelete("cascade"),
		branding_settings_launcher_horizontal_alignment_check: check("branding_settings_launcher_horizontal_alignment_check", sql`launcher_horizontal_alignment = ANY (ARRAY['left'::text, 'center'::text, 'right'::text])`),
		branding_settings_launcher_type_check: check("branding_settings_launcher_type_check", sql`launcher_type = ANY (ARRAY['icon'::text, 'text'::text, 'icon_and_text'::text])`),
		branding_settings_launcher_vertical_alignment_check: check("branding_settings_launcher_vertical_alignment_check", sql`launcher_vertical_alignment = ANY (ARRAY['top'::text, 'middle'::text, 'bottom'::text])`),
		branding_settings_primary_color_check: check("branding_settings_primary_color_check", sql`(primary_color)::text ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'::text`),
		branding_settings_primary_foreground_color_check: check("branding_settings_primary_foreground_color_check", sql`(primary_foreground_color)::text ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'::text`),
		branding_settings_radius_check: check("branding_settings_radius_check", sql`(radius >= 0) AND (radius <= 9999)`),
	}
});

export const cashback_program = pgTable("cashback_program", {
	organization_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	is_active: boolean().notNull(),
	cashback_percentage: real().notNull(),
	credit_expiry_days: integer(),
	credit_availability_delay_days: integer().default(0).notNull(),
}, (table) => {
	return {
		cashback_program_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "cashback_program_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const job_run = pgTable("job_run", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organization_id: uuid().notNull(),
	status: text().default('QUEUED').notNull(),
	type: text().notNull(),
	metadata: jsonb(),
	event_id: text(),
}, (table) => {
	return {
		job_run_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "job_run_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const mb_cashback_override = pgTable("mb_cashback_override", {
	membership_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	cashback_percentage: real().notNull(),
	credit_expiry_days: integer(),
	credit_availability_delay_days: integer().default(0).notNull(),
	is_active: boolean().notNull(),
	organization_id: uuid().notNull(),
}, (table) => {
	return {
		membership_benefit_cashback_override_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "membership_benefit_cashback_override_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		store_credit_membership_benefit_cashback_override_membership: foreignKey({
			columns: [table.membership_id],
			foreignColumns: [membership.id],
			name: "store_credit_membership_benefit_cashback_override_membership"
		}).onUpdate("restrict").onDelete("restrict"),
	}
});

export const mb_free_products = pgTable("mb_free_products", {
	membership_id: uuid().primaryKey().notNull(),
	organization_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	is_active: boolean().notNull(),
	collection_id: text().notNull(),
	max_selectable_free_products: smallint().notNull(),
	hide_cart_lines: boolean().notNull(),
	minimum_order_value: integer().notNull(),
	discount_id: text(),
}, (table) => {
	return {
		membership_benefit_free_products_membership_id_fkey: foreignKey({
			columns: [table.membership_id],
			foreignColumns: [membership.id],
			name: "membership_benefit_free_products_membership_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		membership_benefit_free_products_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "membership_benefit_free_products_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const mb_free_shipping = pgTable("mb_free_shipping", {
	membership_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organization_id: uuid().notNull(),
	is_active: boolean().notNull(),
	discount_id: text(),
}, (table) => {
	return {
		store_credit_membership_benefit_free_shipp_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "store_credit_membership_benefit_free_shipp_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		store_credit_membership_benefit_free_shippin_membership_id_fkey: foreignKey({
			columns: [table.membership_id],
			foreignColumns: [membership.id],
			name: "store_credit_membership_benefit_free_shippin_membership_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const mb_referral_override = pgTable("mb_referral_override", {
	membership_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	referring_customer_gets_type: text().notNull(),
	referring_customer_gets_value: integer().notNull(),
	referring_customer_expiry_days: integer(),
	referring_customer_availability_delay_days: integer().default(0).notNull(),
	referred_customer_gets_type: text().notNull(),
	referred_customer_gets_value: integer(),
	referred_customer_minimum_order_value: integer(),
	referred_customer_must_be_new_customer: boolean().notNull(),
	is_active: boolean().notNull(),
	organization_id: uuid().notNull(),
}, (table) => {
	return {
		membership_benefit_referral_override_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "membership_benefit_referral_override_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		store_credit_membership_benefit_referral_override_membership: foreignKey({
			columns: [table.membership_id],
			foreignColumns: [membership.id],
			name: "store_credit_membership_benefit_referral_override_membership"
		}).onUpdate("restrict").onDelete("restrict"),
		store_credit_membership_benefit_referral_override_referred_c: foreignKey({
			columns: [table.referred_customer_gets_type],
			foreignColumns: [referred_customer_gets_type.referred_customer_gets_type],
			name: "store_credit_membership_benefit_referral_override_referred_c"
		}).onUpdate("restrict").onDelete("restrict"),
		store_credit_membership_benefit_referral_override_referring_: foreignKey({
			columns: [table.referring_customer_gets_type],
			foreignColumns: [referring_customer_gets_type.referring_customer_gets_type],
			name: "store_credit_membership_benefit_referral_override_referring_"
		}).onUpdate("restrict").onDelete("restrict"),
	}
});

export const mb_tier_reached_bonus = pgTable("mb_tier_reached_bonus", {
	membership_id: uuid().primaryKey().notNull(),
	organization_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	is_active: boolean().notNull(),
	is_one_time: boolean().notNull(),
	amount: integer().notNull(),
	credit_expiry_days: integer(),
}, (table) => {
	return {
		mb_tier_reached_bonus_membership_id_fkey: foreignKey({
			columns: [table.membership_id],
			foreignColumns: [membership.id],
			name: "mb_tier_reached_bonus_membership_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		mb_tier_reached_bonus_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "mb_tier_reached_bonus_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const membership = pgTable("membership", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organization_id: uuid().notNull(),
	is_active: boolean().notNull(),
	name: text().notNull(),
	revenue_threshold: integer().notNull(),
	qualification_period_days: integer(),
	membership_duration_days: integer(),
	is_locked: boolean().default(false).notNull(),
	is_manual: boolean().default(false).notNull(),
}, (table) => {
	return {
		membership_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "membership_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const migration_import = pgTable("migration_import", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organization_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	status: text().default('UPLOAD_PENDING').notNull(),
	file_id: uuid(),
	field_mapping: jsonb(),
	source_name: text().notNull(),
	metadata: jsonb(),
}, (table) => {
	return {
		migration_import_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "migration_import_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const referral = pgTable("referral", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organization_id: uuid().notNull(),
	referring_customer_id: text().notNull(),
	referred_customer_id: text().notNull(),
	order_id: text().notNull(),
}, (table) => {
	return {
		referral_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "referral_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		referral_referring_customer_id_fkey: foreignKey({
			columns: [table.referring_customer_id],
			foreignColumns: [shop_customer.id],
			name: "referral_referring_customer_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
		referral_order_id_key: unique("referral_order_id_key").on(table.order_id),
	}
});

export const review_reward_program = pgTable("review_reward_program", {
	organization_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	is_active: boolean().default(false).notNull(),
	text_reward: integer().default(0).notNull(),
	photo_reward: integer().default(0).notNull(),
	video_reward: integer().default(0).notNull(),
	max_rewarded_reviews: integer().default(2).notNull(),
	reward_period_days: integer().default(30).notNull(),
}, (table) => {
	return {
		review_reward_program_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "review_reward_program_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		"Not negative": check("Not negative", sql`((text_reward)::numeric >= (0)::numeric) AND ((photo_reward)::numeric >= (0)::numeric) AND ((video_reward)::numeric >= (0)::numeric)`),
	}
});

export const shop_customer = pgTable("shop_customer", {
	id: text().primaryKey().notNull(),
	organization_id: uuid().notNull(),
	first_name: text(),
	last_name: text(),
	email: text(),
	phone: text(),
	orders_count: integer().notNull(),
	total_spent: integer().notNull(),
	currency: text().notNull(),
	gift_card_id: text(),
	birthday: date(),
	is_blocked: boolean().default(false).notNull(),
	birthday_updated_at: timestamp({ withTimezone: true, mode: 'string' }),
	tags: text().array(),
	locale: text().default('de').notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		idx_shop_customer_email: index("idx_shop_customer_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
		idx_shop_customer_organization_id: index("idx_shop_customer_organization_id").using("btree", table.organization_id.asc().nullsLast().op("uuid_ops")),
		shop_customer_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "shop_customer_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const shop_order = pgTable("shop_order", {
	organization_id: uuid().notNull(),
	order_name: text().notNull(),
	cancelled_at: timestamp({ withTimezone: true, mode: 'string' }),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	currency: varchar({ length: 3 }).notNull(),
	current_total_discounts: integer().notNull(),
	current_total_price: integer().notNull(),
	current_subtotal_price: integer().notNull(),
	current_total_tax: integer().notNull(),
	customer_id: text(),
	customer_locale: text(),
	email: text(),
	financial_status: text(),
	fulfillment_status: text(),
	landing_site: text(),
	processed_at: timestamp({ withTimezone: true, mode: 'string' }),
	referring_site: text(),
	source_name: text(),
	subtotal_price: integer().notNull(),
	tags: text(),
	total_discounts: integer().notNull(),
	total_outstanding: integer().notNull(),
	total_price: integer().notNull(),
	total_tax: integer().notNull(),
	total_tip_received: integer().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	imported: boolean().default(false).notNull(),
	id: text().primaryKey().notNull(),
}, (table) => {
	return {
		customer_idx: index("shop_order_customer_idx").using("hash", table.customer_id.asc().nullsLast().op("text_ops")),
		organization_id_created_at: index("shop_order_organization_id_created_at").using("btree", table.organization_id.asc().nullsLast().op("timestamptz_ops"), table.created_at.asc().nullsLast().op("timestamptz_ops")),
		organization_idx: index("shop_order_organization_idx").using("hash", table.organization_id.asc().nullsLast().op("uuid_ops")),
		shop_order_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "shop_order_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const store_credit = pgTable("store_credit", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	customer_id: text().notNull(),
	organization_id: uuid().notNull(),
	source_type: text().notNull(),
	source_id: text(),
	amount: integer().notNull(),
	currency_code: text().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	available_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expires_at: timestamp({ withTimezone: true, mode: 'string' }),
	amount_used: integer().default(0).notNull(),
	amount_available: integer().generatedAlwaysAs(sql`(amount - amount_used)`),
	// TODO: failed to parse database type 'tstzrange'
	validity_period: unknown("validity_period"),
}, (table) => {
	return {
		idx_store_credit_customer_availability: index("idx_store_credit_customer_availability").using("btree", table.customer_id.asc().nullsLast().op("text_ops"), table.available_at.asc().nullsLast().op("timestamptz_ops"), table.expires_at.asc().nullsLast().op("text_ops")),
		idx_store_credit_customer_validity: index("idx_store_credit_customer_validity").using("btree", table.customer_id.asc().nullsLast().op("uuid_ops"), table.organization_id.asc().nullsLast().op("text_ops")),
		idx_store_credit_org_customer_validity: index("idx_store_credit_org_customer_validity").using("btree", table.organization_id.asc().nullsLast().op("text_ops"), table.customer_id.asc().nullsLast().op("uuid_ops"), table.amount_available.asc().nullsLast().op("text_ops"), table.currency_code.asc().nullsLast().op("text_ops"), table.validity_period.asc().nullsLast().op("text_ops")),
		idx_store_credit_organization_id: index("idx_store_credit_organization_id").using("btree", table.organization_id.asc().nullsLast().op("uuid_ops")),
		idx_store_credit_validity: index("idx_store_credit_validity").using("gist", table.validity_period.asc().nullsLast().op("range_ops")),
		store_credit_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "store_credit_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		store_credit_source_type_fkey: foreignKey({
			columns: [table.source_type],
			foreignColumns: [store_credit_source_type.store_credit_source_type],
			name: "store_credit_source_type_fkey"
		}),
		store_credit_source_id_customer_id_key: unique("store_credit_source_id_customer_id_key").on(table.customer_id, table.source_id),
	}
});

export const store_credit_transaction = pgTable("store_credit_transaction", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organization_id: uuid().notNull(),
	store_credit_id: uuid().notNull(),
	customer_id: text().notNull(),
	transaction_type: varchar({ length: 10 }).notNull(),
	source_type: varchar({ length: 255 }).notNull(),
	source_id: text(),
	amount: integer().notNull(),
	currency_code: varchar({ length: 3 }).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		created_at: index("store_credit_transaction_created_at").using("btree", table.created_at.asc().nullsLast().op("timestamptz_ops")),
		customer_id: index("store_credit_transaction_customer_id").using("btree", table.customer_id.asc().nullsLast().op("text_ops")),
		store_credit_id: index("store_credit_transaction_store_credit_id").using("btree", table.store_credit_id.asc().nullsLast().op("uuid_ops")),
		store_credit_transaction_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "store_credit_transaction_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		store_credit_transaction_transaction_type_store_credit_id_sourc: unique("store_credit_transaction_transaction_type_store_credit_id_sourc").on(table.store_credit_id, table.transaction_type, table.source_type, table.source_id),
		store_credit_transaction_transaction_type_check: check("store_credit_transaction_transaction_type_check", sql`(transaction_type)::text = ANY (ARRAY[('credit'::character varying)::text, ('debit'::character varying)::text])`),
	}
});

export const bulk_operation_job = pgTable("bulk_operation_job", {
	source_id: text().primaryKey().notNull(),
	type: text().notNull(),
	settings: jsonb(),
	url: text(),
	organization_id: uuid(),
	status: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		bulk_operation_job_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "bulk_operation_job_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const integration = pgTable("integration", {
	slug: text().primaryKey().notNull(),
	name: text().notNull(),
	url: text().notNull(),
	description: text().notNull(),
	auth: text().notNull(),
	categories: text().array().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const job_run_task = pgTable("job_run_task", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organization_id: uuid().notNull(),
	type: text().notNull(),
	status: text().notNull(),
	metadata: jsonb(),
	job_run_id: uuid().notNull(),
	idempotency_key: text().notNull(),
}, (table) => {
	return {
		job_run_task_job_run_id_fkey: foreignKey({
			columns: [table.job_run_id],
			foreignColumns: [job_run.id],
			name: "job_run_task_job_run_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		job_run_task_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "job_run_task_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		unique_job_run_idempotency_key: unique("unique_job_run_idempotency_key").on(table.job_run_id, table.idempotency_key),
	}
});

export const organization_subscription = pgTable("organization_subscription", {
	id: text().default(nanoid(\'orgsub_\'::text, 20)).primaryKey().notNull(),
	organization_id: uuid().notNull(),
	plan_id: text().notNull(),
	assigned_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	status: text().default('inactive').notNull(),
	start_date: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	end_date: timestamp({ withTimezone: true, mode: 'string' }),
	provider: text().default('shopify').notNull(),
	provider_subscription_id: text(),
	metadata: jsonb(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		organization_subscription_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "organization_subscription_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		organization_subscription_plan_id_fkey: foreignKey({
			columns: [table.plan_id],
			foreignColumns: [subscription_plan.id],
			name: "organization_subscription_plan_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		organization_subscription_provider_subscription_id_key: unique("organization_subscription_provider_subscription_id_key").on(table.provider_subscription_id),
		organization_subscription_status_check: check("organization_subscription_status_check", sql`status = ANY (ARRAY['active'::text, 'inactive'::text, 'cancelled'::text])`),
	}
});

export const referral_page_view = pgTable("referral_page_view", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organization_id: uuid().notNull(),
	uid: uuid().notNull(),
	referring_customer_id: text().notNull(),
	referred_customer_id: text(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		referral_page_view_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "referral_page_view_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const subscription_plan = pgTable("subscription_plan", {
	id: text().default(nanoid(\'subplan_\'::text, 20)).primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	price_amount: integer().notNull(),
	price_currency_code: text().notNull(),
	interval: text().notNull(),
	capped_amount: integer().notNull(),
	capped_currency_code: text().notNull(),
	terms: text().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	is_public: boolean().default(true).notNull(),
	features: text().array(),
	price_per_order: integer().default(25).notNull(),
	orders_per_month_included: integer().default(100).notNull(),
	allowed_organizations: jsonb(),
	trial_days: integer().default(0).notNull(),
	billed_order_type: text().default('EVERY_ORDER').notNull(),
}, (table) => {
	return {
		idx_subscription_plans_allowed_organizations: index("idx_subscription_plans_allowed_organizations").using("gin", table.allowed_organizations.asc().nullsLast().op("jsonb_ops")),
		subscription_plan_interval_check: check("subscription_plan_interval_check", sql`"interval" = ANY (ARRAY['ANNUAL'::text, 'EVERY_30_DAYS'::text])`),
	}
});

export const referred_customer_gets_type = pgTable("referred_customer_gets_type", {
	referred_customer_gets_type: text().primaryKey().notNull(),
});

export const referring_customer_gets_type = pgTable("referring_customer_gets_type", {
	referring_customer_gets_type: text().primaryKey().notNull(),
});

export const store_credit_source_type = pgTable("store_credit_source_type", {
	store_credit_source_type: text().primaryKey().notNull(),
});

export const usage_record = pgTable("usage_record", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	idempotency_key: text().notNull(),
	price_amount: integer().notNull(),
	price_currency_code: varchar({ length: 3 }).notNull(),
	organization_id: uuid().notNull(),
	plan_id: text().notNull(),
	subscription_id: text().notNull(),
	is_included: boolean().default(false).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		idx_usage_records_organization_id: index("idx_usage_records_organization_id").using("btree", table.organization_id.asc().nullsLast().op("uuid_ops")),
		idx_usage_records_plan_id: index("idx_usage_records_plan_id").using("btree", table.plan_id.asc().nullsLast().op("text_ops")),
		idx_usage_records_subscription_id: index("idx_usage_records_subscription_id").using("btree", table.subscription_id.asc().nullsLast().op("text_ops")),
		usage_records_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "usage_records_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		usage_records_plan_id_fkey: foreignKey({
			columns: [table.plan_id],
			foreignColumns: [subscription_plan.id],
			name: "usage_records_plan_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		usage_records_subscription_id_fkey: foreignKey({
			columns: [table.subscription_id],
			foreignColumns: [organization_subscription.id],
			name: "usage_records_subscription_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		usage_records_idempotency_key_key: unique("usage_records_idempotency_key_key").on(table.idempotency_key),
	}
});

export const account = pgTable("account", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	account_id: text().notNull(),
	provider_id: text().notNull(),
	user_id: uuid().notNull(),
	access_token: text(),
	refresh_token: text(),
	id_token: text(),
	access_token_expires_at: timestamp({ mode: 'string' }),
	refresh_token_expires_at: timestamp({ mode: 'string' }),
	scope: text(),
	password: text(),
	created_at: timestamp({ mode: 'string' }).notNull(),
	updated_at: timestamp({ mode: 'string' }).notNull(),
}, (table) => {
	return {
		account_user_id_fkey: foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "account_user_id_fkey"
		}).onDelete("cascade"),
	}
});

export const verification = pgTable("verification", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expires_at: timestamp({ mode: 'string' }).notNull(),
	created_at: timestamp({ mode: 'string' }),
	updated_at: timestamp({ mode: 'string' }),
});

export const organization_member = pgTable("organization_member", {
	user_id: uuid().notNull(),
	organization_id: uuid().notNull(),
	role: text().default('member').notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`transaction_timestamp()`).notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => {
	return {
		organization_member_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "organization_member_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		organization_member_user_profile_id_fkey: foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "organization_member_user_profile_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
		organization_member_user_id_organization_id_key: unique("organization_member_user_id_organization_id_key").on(table.user_id, table.organization_id),
	}
});

export const organization_member_invite = pgTable("organization_member_invite", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	organization_id: uuid().notNull(),
	email: text().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`transaction_timestamp()`).notNull(),
	role: text(),
	status: text().notNull(),
	expires_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	inviter_id: uuid().notNull(),
}, (table) => {
	return {
		organization_member_invite_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "organization_member_invite_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		organization_member_invite_inviter_id_fkey: foreignKey({
			columns: [table.inviter_id],
			foreignColumns: [user.id],
			name: "organization_member_invite_inviter_id_fkey"
		}).onDelete("cascade"),
		organization_member_invite_organization_id_email_key: unique("organization_member_invite_organization_id_email_key").on(table.organization_id, table.email),
	}
});

export const session = pgTable("session", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	expires_at: timestamp({ mode: 'string' }).notNull(),
	token: text().notNull(),
	created_at: timestamp({ mode: 'string' }).notNull(),
	updated_at: timestamp({ mode: 'string' }).notNull(),
	ip_address: text(),
	user_agent: text(),
	user_id: uuid().notNull(),
	active_organization_id: text(),
	impersonated_by: uuid(),
}, (table) => {
	return {
		session_user_id_fkey: foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "session_user_id_fkey"
		}).onDelete("cascade"),
		session_token_key: unique("session_token_key").on(table.token),
	}
});

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`transaction_timestamp()`).notNull(),
	email: text().notNull(),
	name: text().notNull(),
	email_verified: boolean().default(false).notNull(),
	image: text(),
	locale: text().default('en').notNull(),
	role: text().default('user'),
	banned: boolean().default(false),
	ban_reason: text(),
	ban_expires: timestamp({ mode: 'string' }),
	last_seen_at: timestamp({ withTimezone: true, mode: 'string' }),
	current_active_organization_id: uuid(),
}, (table) => {
	return {
		profiles_user_id_key: unique("profiles_user_id_key").on(table.id),
		user_email_key: unique("user_email_key").on(table.email),
	}
});

export const apikey = pgTable("apikey", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	start: text(),
	prefix: text(),
	key: text().notNull(),
	user_id: uuid().notNull(),
	refill_interval: integer(),
	refill_amount: integer(),
	last_refill_at: timestamp({ mode: 'string' }),
	enabled: boolean(),
	rate_limit_enabled: boolean(),
	rate_limit_time_window: integer(),
	rate_limit_max: integer(),
	request_count: integer(),
	remaining: integer(),
	last_request: timestamp({ mode: 'string' }),
	expires_at: timestamp({ mode: 'string' }),
	created_at: timestamp({ mode: 'string' }).notNull(),
	updated_at: timestamp({ mode: 'string' }).notNull(),
	permissions: text(),
	metadata: text(),
}, (table) => {
	return {
		apikey_user_id_fkey: foreignKey({
			columns: [table.user_id],
			foreignColumns: [user.id],
			name: "apikey_user_id_fkey"
		}).onDelete("cascade"),
	}
});

export const store_credit_setting = pgTable("store_credit_setting", {
	organization_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	discount_title: text().notNull(),
	is_using_gift_cards: boolean(),
	is_active: boolean().default(false),
	discount_id: text(),
	minimum_order_value: integer().notNull(),
}, (table) => {
	return {
		store_credit_setting_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "store_credit_setting_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const referral_program = pgTable("referral_program", {
	organization_id: uuid().primaryKey().notNull(),
	referring_customer_gets_type: text().notNull(),
	referring_customer_gets_value: integer().notNull(),
	referred_customer_gets_type: text().notNull(),
	referred_customer_gets_value: integer(),
	referred_customer_minimum_order_value: integer(),
	referred_customer_must_be_new_customer: boolean().notNull(),
	referred_customer_must_register: boolean().notNull(),
	cookie_duration_in_days: integer().notNull(),
	referring_customer_expiry_days: integer(),
	referring_customer_availability_delay_days: integer().default(sql`'0'`).notNull(),
	is_active: boolean().default(false).notNull(),
	active: boolean().generatedAlwaysAs(sql`is_active`),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	referred_customer_gets_shopify_collection_id: text(),
	referred_customer_gets_shopify_collection_handle: text(),
}, (table) => {
	return {
		referral_program_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "referral_program_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		referral_program_referred_customer_gets_type_fkey: foreignKey({
			columns: [table.referred_customer_gets_type],
			foreignColumns: [referred_customer_gets_type.referred_customer_gets_type],
			name: "referral_program_referred_customer_gets_type_fkey"
		}),
		referral_program_referring_customer_gets_type_fkey: foreignKey({
			columns: [table.referring_customer_gets_type],
			foreignColumns: [referring_customer_gets_type.referring_customer_gets_type],
			name: "referral_program_referring_customer_gets_type_fkey"
		}),
		referral_program_check: check("referral_program_check", sql`(referred_customer_gets_type <> 'FREE_SHIPPING'::text) OR (referred_customer_gets_value IS NOT NULL)`),
		referral_program_cookie_duration_in_days_check: check("referral_program_cookie_duration_in_days_check", sql`(cookie_duration_in_days)::numeric >= (1)::numeric`),
		referral_program_referred_customer_gets_value_check: check("referral_program_referred_customer_gets_value_check", sql`(referred_customer_gets_value)::numeric >= (0)::numeric`),
		referral_program_referred_customer_minimum_order_check: check("referral_program_referred_customer_minimum_order_check", sql`(referred_customer_minimum_order_value)::numeric >= (0)::numeric`),
		referral_program_referring_customer_gets_value_check: check("referral_program_referring_customer_gets_value_check", sql`(referring_customer_gets_value)::numeric >= (0)::numeric`),
	}
});

export const shopify_flow_action = pgTable("shopify_flow_action", {
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	organization_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	metadata: jsonb().notNull(),
});

export const organization = pgTable("organization", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	shop_domain: text(),
	onboarding_step: text(),
	logo: text(),
	currency: text().default('EUR').notNull(),
	shopify_plan: text(),
	onboarding_completed: boolean().default(false).notNull(),
	public_key: text().default(nanoid(\'pk_live_\'::text, 100)).notNull(),
	secret_key: text().default(nanoid(\'sk_live_\'::text, 100)).notNull(),
	is_enterprise_customer: boolean().default(false).notNull(),
	metadata: text(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	loyalty_program_type: text().default('store_credit'),
	mantle_api_token: text(),
}, (table) => {
	return {
		organizations_name_unique: unique("organizations_name_unique").on(table.name),
		organization_slug_key: unique("organization_slug_key").on(table.slug),
		organization_shopify_domain_key: unique("organization_shopify_domain_key").on(table.shop_domain),
	}
});

export const customer_card_design = pgTable("customer_card_design", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organization_id: uuid().notNull(),
	background_type: text().default('gradient').notNull(),
	background_color: jsonb().default([150,0,0,1]).notNull(),
	background_gradient: jsonb().default({"type":"linear","angle":90,"stops":[{"color":[210,100,50,1],"position":0},{"color":[280,100,65,1],"position":50},{"color":[340,100,55,1],"position":100}]}).notNull(),
	background_image_file_id: text(),
	text_color: jsonb().default([0,100,100,1]).notNull(),
	text_font_family: text().default('Inter').notNull(),
	text_font_weight: text().default('400').notNull(),
	text_font_url: text().default('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap').notNull(),
	logo_file_id: text(),
	logo_width: integer().default(40).notNull(),
	qr_code_enabled: boolean().default(true).notNull(),
	qr_code_light_color: jsonb().default([255,255,255,1]).notNull(),
	qr_code_dark_color: jsonb().default([0,0,0,1]).notNull(),
	qr_code_border_radius: integer().default(10).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	membership_id: uuid(),
}, (table) => {
	return {
		customer_card_design_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "customer_card_design_organization_id_fkey"
		}).onDelete("cascade"),
		customer_card_design_membership_id_fkey: foreignKey({
			columns: [table.membership_id],
			foreignColumns: [membership.id],
			name: "customer_card_design_membership_id_fkey"
		}),
	}
});

export const organization_integration = pgTable("organization_integration", {
	organization_id: uuid().notNull(),
	integration: text().notNull(),
	key: jsonb().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb(),
}, (table) => {
	return {
		organization_integration_integration_fkey: foreignKey({
			columns: [table.integration],
			foreignColumns: [integration.slug],
			name: "organization_integration_integration_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		organization_integration_organization_id_fkey: foreignKey({
			columns: [table.organization_id],
			foreignColumns: [organization.id],
			name: "organization_integration_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		organization_integration_pkey: primaryKey({ columns: [table.organization_id, table.integration], name: "organization_integration_pkey"}),
	}
});
export const active_customer_membership = pgView("active_customer_membership", {	created_at: timestamp({ withTimezone: true, mode: 'string' }),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }),
	expires_at: timestamp({ withTimezone: true, mode: 'string' }),
	customer_id: text(),
	membership_id: uuid(),
	id: uuid(),
	organization_id: uuid(),
	is_active: boolean(),
	name: text(),
	revenue_threshold: integer(),
	qualification_period_days: integer(),
	membership_duration_days: integer(),
	is_locked: boolean(),
	is_manual: boolean(),
}).as(sql`SELECT scm.created_at, scm.updated_at, scm.expires_at, scm.customer_id, scm.membership_id, scm.id, scm.organization_id, sm.is_active, sm.name, sm.revenue_threshold, sm.qualification_period_days, sm.membership_duration_days, sm.is_locked, sm.is_manual FROM customer_membership scm JOIN membership sm ON scm.membership_id = sm.id WHERE (scm.expires_at > now() OR scm.expires_at IS NULL) AND scm.created_at < now() AND sm.is_active = true`);

export const organization_billing_view = pgView("organization_billing_view", {	organization_id: uuid(),
	status: text(),
	plan_name: text(),
	billing_cycle_start: timestamp({ withTimezone: true, mode: 'string' }),
	billing_cycle_end: timestamp({ withTimezone: true, mode: 'string' }),
	monthly_fixed_cost: integer(),
	price_currency_code: text(),
	cost_per_order: integer(),
	included_orders: integer(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	included_orders_count: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	billed_orders_count: bigint({ mode: "number" }),
	cycle_number: integer(),
}).as(sql`WITH RECURSIVE billing_cycles AS ( SELECT organization_subscription.organization_id, organization_subscription.start_date, organization_subscription.end_date, organization_subscription.start_date AS cycle_start_date, organization_subscription.start_date + '30 days'::interval AS cycle_end_date, 1 AS cycle_number FROM organization_subscription UNION ALL SELECT billing_cycles.organization_id, billing_cycles.start_date, billing_cycles.end_date, billing_cycles.cycle_end_date AS cycle_start_date, billing_cycles.cycle_end_date + '30 days'::interval AS cycle_end_date, billing_cycles.cycle_number + 1 FROM billing_cycles WHERE billing_cycles.cycle_start_date <= ((CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)::date + '1 day'::interval) ), usage_counts AS ( SELECT ur.organization_id, bc_1.cycle_start_date, count(*) FILTER (WHERE ur.is_included) AS included_orders_count, count(*) FILTER (WHERE NOT ur.is_included) AS billed_orders_count FROM usage_record ur JOIN billing_cycles bc_1 ON ur.organization_id = bc_1.organization_id AND ur.created_at >= bc_1.cycle_start_date AND ur.created_at < bc_1.cycle_end_date GROUP BY ur.organization_id, bc_1.cycle_start_date ) SELECT os.organization_id, os.status, sp.name AS plan_name, bc.cycle_start_date AS billing_cycle_start, bc.cycle_end_date AS billing_cycle_end, sp.price_amount AS monthly_fixed_cost, sp.price_currency_code, sp.price_per_order AS cost_per_order, sp.orders_per_month_included AS included_orders, COALESCE(uc.included_orders_count, 0::bigint) AS included_orders_count, COALESCE(uc.billed_orders_count, 0::bigint) AS billed_orders_count, bc.cycle_number FROM organization_subscription os JOIN subscription_plan sp ON os.plan_id = sp.id JOIN billing_cycles bc ON os.organization_id = bc.organization_id LEFT JOIN usage_counts uc ON os.organization_id = uc.organization_id AND bc.cycle_start_date = uc.cycle_start_date WHERE bc.cycle_start_date <= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)`);

export const store_credit_balance = pgView("store_credit_balance", {	customer_id: text(),
	organization_id: uuid(),
	currency_code: text(),
	current_balance: integer(),
	upcoming_balance: integer(),
}).as(sql`SELECT store_credit.customer_id, store_credit.organization_id, max(store_credit.currency_code) AS currency_code, sum( CASE WHEN now() <@ store_credit.validity_period THEN store_credit.amount_available ELSE 0 END)::integer AS current_balance, sum( CASE WHEN lower(store_credit.validity_period) > now() THEN store_credit.amount_available ELSE 0 END)::integer AS upcoming_balance FROM store_credit GROUP BY store_credit.customer_id, store_credit.organization_id`);