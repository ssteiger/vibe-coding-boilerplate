-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "job_run_status" (
	"job_run_status" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mb_type" (
	"membership_benefit_type" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "migration_import_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"migration_import_id" uuid NOT NULL,
	"customer_id" text,
	"email" text,
	"points_balance" integer NOT NULL,
	"birthday" date,
	"membership_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store_credit_usage_type" (
	"store_credit_usage_type" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_membership" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"customer_id" text NOT NULL,
	"membership_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "airdrop_campaign" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"customer_segment_id" text NOT NULL,
	"amount" integer NOT NULL,
	"credit_expiry_days" integer,
	"customer_count" integer DEFAULT 0 NOT NULL,
	"customer_segment_name" text NOT NULL,
	"event_id" text,
	"status" text DEFAULT 'QUEUED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "birthday_reward_program" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"amount" integer NOT NULL,
	"credit_expiry_days" integer,
	"credit_advance_days" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branding_settings" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"show_branding" boolean DEFAULT true NOT NULL,
	"primary_color" varchar(7) DEFAULT '#003049' NOT NULL,
	"primary_foreground_color" varchar(7) DEFAULT '#ffffff' NOT NULL,
	"radius" smallint DEFAULT 8 NOT NULL,
	"launcher_vertical_alignment" text DEFAULT 'middle' NOT NULL,
	"launcher_horizontal_alignment" text DEFAULT 'right' NOT NULL,
	"launcher_spacing_x" integer DEFAULT 20 NOT NULL,
	"launcher_spacing_y" integer DEFAULT 20 NOT NULL,
	"launcher_is_active" boolean DEFAULT false NOT NULL,
	"launcher_hide_on_mobile" boolean DEFAULT false NOT NULL,
	"launcher_type" text DEFAULT 'icon_and_text' NOT NULL,
	"launcher_text" text DEFAULT 'Store Credit' NOT NULL,
	CONSTRAINT "branding_settings_launcher_horizontal_alignment_check" CHECK (launcher_horizontal_alignment = ANY (ARRAY['left'::text, 'center'::text, 'right'::text])),
	CONSTRAINT "branding_settings_launcher_type_check" CHECK (launcher_type = ANY (ARRAY['icon'::text, 'text'::text, 'icon_and_text'::text])),
	CONSTRAINT "branding_settings_launcher_vertical_alignment_check" CHECK (launcher_vertical_alignment = ANY (ARRAY['top'::text, 'middle'::text, 'bottom'::text])),
	CONSTRAINT "branding_settings_primary_color_check" CHECK ((primary_color)::text ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'::text),
	CONSTRAINT "branding_settings_primary_foreground_color_check" CHECK ((primary_foreground_color)::text ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'::text),
	CONSTRAINT "branding_settings_radius_check" CHECK ((radius >= 0) AND (radius <= 9999))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cashback_program" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean NOT NULL,
	"cashback_percentage" real NOT NULL,
	"credit_expiry_days" integer,
	"credit_availability_delay_days" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_run" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"status" text DEFAULT 'QUEUED' NOT NULL,
	"type" text NOT NULL,
	"metadata" jsonb,
	"event_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mb_cashback_override" (
	"membership_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cashback_percentage" real NOT NULL,
	"credit_expiry_days" integer,
	"credit_availability_delay_days" integer DEFAULT 0 NOT NULL,
	"is_active" boolean NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mb_free_products" (
	"membership_id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean NOT NULL,
	"collection_id" text NOT NULL,
	"max_selectable_free_products" smallint NOT NULL,
	"hide_cart_lines" boolean NOT NULL,
	"minimum_order_value" integer NOT NULL,
	"discount_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mb_free_shipping" (
	"membership_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_active" boolean NOT NULL,
	"discount_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mb_referral_override" (
	"membership_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"referring_customer_gets_type" text NOT NULL,
	"referring_customer_gets_value" integer NOT NULL,
	"referring_customer_expiry_days" integer,
	"referring_customer_availability_delay_days" integer DEFAULT 0 NOT NULL,
	"referred_customer_gets_type" text NOT NULL,
	"referred_customer_gets_value" integer,
	"referred_customer_minimum_order_value" integer,
	"referred_customer_must_be_new_customer" boolean NOT NULL,
	"is_active" boolean NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mb_tier_reached_bonus" (
	"membership_id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean NOT NULL,
	"is_one_time" boolean NOT NULL,
	"amount" integer NOT NULL,
	"credit_expiry_days" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_active" boolean NOT NULL,
	"name" text NOT NULL,
	"revenue_threshold" integer NOT NULL,
	"qualification_period_days" integer,
	"membership_duration_days" integer,
	"is_locked" boolean DEFAULT false NOT NULL,
	"is_manual" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "migration_import" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'UPLOAD_PENDING' NOT NULL,
	"file_id" uuid,
	"field_mapping" jsonb,
	"source_name" text NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"referring_customer_id" text NOT NULL,
	"referred_customer_id" text NOT NULL,
	"order_id" text NOT NULL,
	CONSTRAINT "referral_order_id_key" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review_reward_program" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"text_reward" integer DEFAULT 0 NOT NULL,
	"photo_reward" integer DEFAULT 0 NOT NULL,
	"video_reward" integer DEFAULT 0 NOT NULL,
	"max_rewarded_reviews" integer DEFAULT 2 NOT NULL,
	"reward_period_days" integer DEFAULT 30 NOT NULL,
	CONSTRAINT "Not negative" CHECK (((text_reward)::numeric >= (0)::numeric) AND ((photo_reward)::numeric >= (0)::numeric) AND ((video_reward)::numeric >= (0)::numeric))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shop_customer" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text,
	"orders_count" integer NOT NULL,
	"total_spent" integer NOT NULL,
	"currency" text NOT NULL,
	"gift_card_id" text,
	"birthday" date,
	"is_blocked" boolean DEFAULT false NOT NULL,
	"birthday_updated_at" timestamp with time zone,
	"tags" text[],
	"locale" text DEFAULT 'de' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shop_order" (
	"organization_id" uuid NOT NULL,
	"order_name" text NOT NULL,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"currency" varchar(3) NOT NULL,
	"current_total_discounts" integer NOT NULL,
	"current_total_price" integer NOT NULL,
	"current_subtotal_price" integer NOT NULL,
	"current_total_tax" integer NOT NULL,
	"customer_id" text,
	"customer_locale" text,
	"email" text,
	"financial_status" text,
	"fulfillment_status" text,
	"landing_site" text,
	"processed_at" timestamp with time zone,
	"referring_site" text,
	"source_name" text,
	"subtotal_price" integer NOT NULL,
	"tags" text,
	"total_discounts" integer NOT NULL,
	"total_outstanding" integer NOT NULL,
	"total_price" integer NOT NULL,
	"total_tax" integer NOT NULL,
	"total_tip_received" integer NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"imported" boolean DEFAULT false NOT NULL,
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store_credit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"source_id" text,
	"amount" integer NOT NULL,
	"currency_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"amount_used" integer DEFAULT 0 NOT NULL,
	"amount_available" integer GENERATED ALWAYS AS ((amount - amount_used)) STORED,
	"validity_period" "tstzrange",
	CONSTRAINT "store_credit_source_id_customer_id_key" UNIQUE("customer_id","source_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store_credit_transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"store_credit_id" uuid NOT NULL,
	"customer_id" text NOT NULL,
	"transaction_type" varchar(10) NOT NULL,
	"source_type" varchar(255) NOT NULL,
	"source_id" text,
	"amount" integer NOT NULL,
	"currency_code" varchar(3) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "store_credit_transaction_transaction_type_store_credit_id_sourc" UNIQUE("store_credit_id","transaction_type","source_type","source_id"),
	CONSTRAINT "store_credit_transaction_transaction_type_check" CHECK ((transaction_type)::text = ANY (ARRAY[('credit'::character varying)::text, ('debit'::character varying)::text]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bulk_operation_job" (
	"source_id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"settings" jsonb,
	"url" text,
	"organization_id" uuid,
	"status" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"description" text NOT NULL,
	"auth" text NOT NULL,
	"categories" text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_run_task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"metadata" jsonb,
	"job_run_id" uuid NOT NULL,
	"idempotency_key" text NOT NULL,
	CONSTRAINT "unique_job_run_idempotency_key" UNIQUE("job_run_id","idempotency_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_subscription" (
	"id" text PRIMARY KEY DEFAULT nanoid('orgsub_'::text, 20) NOT NULL,
	"organization_id" uuid NOT NULL,
	"plan_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now(),
	"status" text DEFAULT 'inactive' NOT NULL,
	"start_date" timestamp with time zone DEFAULT now() NOT NULL,
	"end_date" timestamp with time zone,
	"provider" text DEFAULT 'shopify' NOT NULL,
	"provider_subscription_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "organization_subscription_provider_subscription_id_key" UNIQUE("provider_subscription_id"),
	CONSTRAINT "organization_subscription_status_check" CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'cancelled'::text]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_page_view" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"uid" uuid NOT NULL,
	"referring_customer_id" text NOT NULL,
	"referred_customer_id" text,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription_plan" (
	"id" text PRIMARY KEY DEFAULT nanoid('subplan_'::text, 20) NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price_amount" integer NOT NULL,
	"price_currency_code" text NOT NULL,
	"interval" text NOT NULL,
	"capped_amount" integer NOT NULL,
	"capped_currency_code" text NOT NULL,
	"terms" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_public" boolean DEFAULT true NOT NULL,
	"features" text[],
	"price_per_order" integer DEFAULT 25 NOT NULL,
	"orders_per_month_included" integer DEFAULT 100 NOT NULL,
	"allowed_organizations" jsonb,
	"trial_days" integer DEFAULT 0 NOT NULL,
	"billed_order_type" text DEFAULT 'EVERY_ORDER' NOT NULL,
	CONSTRAINT "subscription_plan_interval_check" CHECK ("interval" = ANY (ARRAY['ANNUAL'::text, 'EVERY_30_DAYS'::text]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referred_customer_gets_type" (
	"referred_customer_gets_type" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referring_customer_gets_type" (
	"referring_customer_gets_type" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store_credit_source_type" (
	"store_credit_source_type" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usage_record" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"idempotency_key" text NOT NULL,
	"price_amount" integer NOT NULL,
	"price_currency_code" varchar(3) NOT NULL,
	"organization_id" uuid NOT NULL,
	"plan_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"is_included" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usage_records_idempotency_key_key" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_member" (
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT transaction_timestamp() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "organization_member_user_id_organization_id_key" UNIQUE("user_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_member_invite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT transaction_timestamp() NOT NULL,
	"role" text,
	"status" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"inviter_id" uuid NOT NULL,
	CONSTRAINT "organization_member_invite_organization_id_email_key" UNIQUE("organization_id","email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"active_organization_id" text,
	"impersonated_by" uuid,
	CONSTRAINT "session_token_key" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT transaction_timestamp() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"locale" text DEFAULT 'en' NOT NULL,
	"role" text DEFAULT 'user',
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"last_seen_at" timestamp with time zone,
	"current_active_organization_id" uuid,
	CONSTRAINT "profiles_user_id_key" UNIQUE("id"),
	CONSTRAINT "user_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apikey" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" uuid NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp,
	"enabled" boolean,
	"rate_limit_enabled" boolean,
	"rate_limit_time_window" integer,
	"rate_limit_max" integer,
	"request_count" integer,
	"remaining" integer,
	"last_request" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"permissions" text,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store_credit_setting" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"discount_title" text NOT NULL,
	"is_using_gift_cards" boolean,
	"is_active" boolean DEFAULT false,
	"discount_id" text,
	"minimum_order_value" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_program" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"referring_customer_gets_type" text NOT NULL,
	"referring_customer_gets_value" integer NOT NULL,
	"referred_customer_gets_type" text NOT NULL,
	"referred_customer_gets_value" integer,
	"referred_customer_minimum_order_value" integer,
	"referred_customer_must_be_new_customer" boolean NOT NULL,
	"referred_customer_must_register" boolean NOT NULL,
	"cookie_duration_in_days" integer NOT NULL,
	"referring_customer_expiry_days" integer,
	"referring_customer_availability_delay_days" integer DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"active" boolean GENERATED ALWAYS AS (is_active) STORED,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"referred_customer_gets_shopify_collection_id" text,
	"referred_customer_gets_shopify_collection_handle" text,
	CONSTRAINT "referral_program_check" CHECK ((referred_customer_gets_type <> 'FREE_SHIPPING'::text) OR (referred_customer_gets_value IS NOT NULL)),
	CONSTRAINT "referral_program_cookie_duration_in_days_check" CHECK ((cookie_duration_in_days)::numeric >= (1)::numeric),
	CONSTRAINT "referral_program_referred_customer_gets_value_check" CHECK ((referred_customer_gets_value)::numeric >= (0)::numeric),
	CONSTRAINT "referral_program_referred_customer_minimum_order_check" CHECK ((referred_customer_minimum_order_value)::numeric >= (0)::numeric),
	CONSTRAINT "referral_program_referring_customer_gets_value_check" CHECK ((referring_customer_gets_value)::numeric >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shopify_flow_action" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"metadata" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"shop_domain" text,
	"onboarding_step" text,
	"logo" text,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"shopify_plan" text,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"public_key" text DEFAULT nanoid('pk_live_'::text, 100) NOT NULL,
	"secret_key" text DEFAULT nanoid('sk_live_'::text, 100) NOT NULL,
	"is_enterprise_customer" boolean DEFAULT false NOT NULL,
	"metadata" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"loyalty_program_type" text DEFAULT 'store_credit',
	"mantle_api_token" text,
	CONSTRAINT "organizations_name_unique" UNIQUE("name"),
	CONSTRAINT "organization_slug_key" UNIQUE("slug"),
	CONSTRAINT "organization_shopify_domain_key" UNIQUE("shop_domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_card_design" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"background_type" text DEFAULT 'gradient' NOT NULL,
	"background_color" jsonb DEFAULT '[150,0,0,1]'::jsonb NOT NULL,
	"background_gradient" jsonb DEFAULT '{"type":"linear","angle":90,"stops":[{"color":[210,100,50,1],"position":0},{"color":[280,100,65,1],"position":50},{"color":[340,100,55,1],"position":100}]}'::jsonb NOT NULL,
	"background_image_file_id" text,
	"text_color" jsonb DEFAULT '[0,100,100,1]'::jsonb NOT NULL,
	"text_font_family" text DEFAULT 'Inter' NOT NULL,
	"text_font_weight" text DEFAULT '400' NOT NULL,
	"text_font_url" text DEFAULT 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' NOT NULL,
	"logo_file_id" text,
	"logo_width" integer DEFAULT 40 NOT NULL,
	"qr_code_enabled" boolean DEFAULT true NOT NULL,
	"qr_code_light_color" jsonb DEFAULT '[255,255,255,1]'::jsonb NOT NULL,
	"qr_code_dark_color" jsonb DEFAULT '[0,0,0,1]'::jsonb NOT NULL,
	"qr_code_border_radius" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"membership_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_integration" (
	"organization_id" uuid NOT NULL,
	"integration" text NOT NULL,
	"key" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "organization_integration_pkey" PRIMARY KEY("organization_id","integration")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_membership" ADD CONSTRAINT "customer_membership_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."shop_customer"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_membership" ADD CONSTRAINT "customer_membership_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_membership" ADD CONSTRAINT "customer_membership_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "airdrop_campaign" ADD CONSTRAINT "airdrop_campaign_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "birthday_reward_program" ADD CONSTRAINT "birthday_reward_program_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branding_settings" ADD CONSTRAINT "fk_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cashback_program" ADD CONSTRAINT "cashback_program_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_run" ADD CONSTRAINT "job_run_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_cashback_override" ADD CONSTRAINT "membership_benefit_cashback_override_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_cashback_override" ADD CONSTRAINT "store_credit_membership_benefit_cashback_override_membership" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_free_products" ADD CONSTRAINT "membership_benefit_free_products_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_free_products" ADD CONSTRAINT "membership_benefit_free_products_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_free_shipping" ADD CONSTRAINT "store_credit_membership_benefit_free_shipp_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_free_shipping" ADD CONSTRAINT "store_credit_membership_benefit_free_shippin_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_referral_override" ADD CONSTRAINT "membership_benefit_referral_override_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_referral_override" ADD CONSTRAINT "store_credit_membership_benefit_referral_override_membership" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_referral_override" ADD CONSTRAINT "store_credit_membership_benefit_referral_override_referred_c" FOREIGN KEY ("referred_customer_gets_type") REFERENCES "public"."referred_customer_gets_type"("referred_customer_gets_type") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_referral_override" ADD CONSTRAINT "store_credit_membership_benefit_referral_override_referring_" FOREIGN KEY ("referring_customer_gets_type") REFERENCES "public"."referring_customer_gets_type"("referring_customer_gets_type") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_tier_reached_bonus" ADD CONSTRAINT "mb_tier_reached_bonus_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mb_tier_reached_bonus" ADD CONSTRAINT "mb_tier_reached_bonus_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "membership" ADD CONSTRAINT "membership_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "migration_import" ADD CONSTRAINT "migration_import_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral" ADD CONSTRAINT "referral_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral" ADD CONSTRAINT "referral_referring_customer_id_fkey" FOREIGN KEY ("referring_customer_id") REFERENCES "public"."shop_customer"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_reward_program" ADD CONSTRAINT "review_reward_program_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shop_customer" ADD CONSTRAINT "shop_customer_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shop_order" ADD CONSTRAINT "shop_order_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_credit" ADD CONSTRAINT "store_credit_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_credit" ADD CONSTRAINT "store_credit_source_type_fkey" FOREIGN KEY ("source_type") REFERENCES "public"."store_credit_source_type"("store_credit_source_type") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_credit_transaction" ADD CONSTRAINT "store_credit_transaction_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bulk_operation_job" ADD CONSTRAINT "bulk_operation_job_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_run_task" ADD CONSTRAINT "job_run_task_job_run_id_fkey" FOREIGN KEY ("job_run_id") REFERENCES "public"."job_run"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_run_task" ADD CONSTRAINT "job_run_task_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_subscription" ADD CONSTRAINT "organization_subscription_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_subscription" ADD CONSTRAINT "organization_subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plan"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_page_view" ADD CONSTRAINT "referral_page_view_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usage_record" ADD CONSTRAINT "usage_records_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usage_record" ADD CONSTRAINT "usage_records_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plan"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usage_record" ADD CONSTRAINT "usage_records_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."organization_subscription"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_user_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member_invite" ADD CONSTRAINT "organization_member_invite_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_member_invite" ADD CONSTRAINT "organization_member_invite_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apikey" ADD CONSTRAINT "apikey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store_credit_setting" ADD CONSTRAINT "store_credit_setting_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_program" ADD CONSTRAINT "referral_program_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_program" ADD CONSTRAINT "referral_program_referred_customer_gets_type_fkey" FOREIGN KEY ("referred_customer_gets_type") REFERENCES "public"."referred_customer_gets_type"("referred_customer_gets_type") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_program" ADD CONSTRAINT "referral_program_referring_customer_gets_type_fkey" FOREIGN KEY ("referring_customer_gets_type") REFERENCES "public"."referring_customer_gets_type"("referring_customer_gets_type") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_card_design" ADD CONSTRAINT "customer_card_design_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_card_design" ADD CONSTRAINT "customer_card_design_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_integration" ADD CONSTRAINT "organization_integration_integration_fkey" FOREIGN KEY ("integration") REFERENCES "public"."integration"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_integration" ADD CONSTRAINT "organization_integration_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_membership_customer_id" ON "customer_membership" USING btree ("customer_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_shop_customer_email" ON "shop_customer" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_shop_customer_organization_id" ON "shop_customer" USING btree ("organization_id" uuid_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shop_order_customer_idx" ON "shop_order" USING hash ("customer_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shop_order_organization_id_created_at" ON "shop_order" USING btree ("organization_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shop_order_organization_idx" ON "shop_order" USING hash ("organization_id" uuid_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_store_credit_customer_availability" ON "store_credit" USING btree ("customer_id" text_ops,"available_at" timestamptz_ops,"expires_at" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_store_credit_customer_validity" ON "store_credit" USING btree ("customer_id" uuid_ops,"organization_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_store_credit_org_customer_validity" ON "store_credit" USING btree ("organization_id" text_ops,"customer_id" uuid_ops,"amount_available" text_ops,"currency_code" text_ops,"validity_period" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_store_credit_organization_id" ON "store_credit" USING btree ("organization_id" uuid_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_store_credit_validity" ON "store_credit" USING gist ("validity_period" range_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_credit_transaction_created_at" ON "store_credit_transaction" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_credit_transaction_customer_id" ON "store_credit_transaction" USING btree ("customer_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_credit_transaction_store_credit_id" ON "store_credit_transaction" USING btree ("store_credit_id" uuid_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_subscription_plans_allowed_organizations" ON "subscription_plan" USING gin ("allowed_organizations" jsonb_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_usage_records_organization_id" ON "usage_record" USING btree ("organization_id" uuid_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_usage_records_plan_id" ON "usage_record" USING btree ("plan_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_usage_records_subscription_id" ON "usage_record" USING btree ("subscription_id" text_ops);--> statement-breakpoint
CREATE VIEW "public"."active_customer_membership" AS (SELECT scm.created_at, scm.updated_at, scm.expires_at, scm.customer_id, scm.membership_id, scm.id, scm.organization_id, sm.is_active, sm.name, sm.revenue_threshold, sm.qualification_period_days, sm.membership_duration_days, sm.is_locked, sm.is_manual FROM customer_membership scm JOIN membership sm ON scm.membership_id = sm.id WHERE (scm.expires_at > now() OR scm.expires_at IS NULL) AND scm.created_at < now() AND sm.is_active = true);--> statement-breakpoint
CREATE VIEW "public"."organization_billing_view" AS (WITH RECURSIVE billing_cycles AS ( SELECT organization_subscription.organization_id, organization_subscription.start_date, organization_subscription.end_date, organization_subscription.start_date AS cycle_start_date, organization_subscription.start_date + '30 days'::interval AS cycle_end_date, 1 AS cycle_number FROM organization_subscription UNION ALL SELECT billing_cycles.organization_id, billing_cycles.start_date, billing_cycles.end_date, billing_cycles.cycle_end_date AS cycle_start_date, billing_cycles.cycle_end_date + '30 days'::interval AS cycle_end_date, billing_cycles.cycle_number + 1 FROM billing_cycles WHERE billing_cycles.cycle_start_date <= ((CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)::date + '1 day'::interval) ), usage_counts AS ( SELECT ur.organization_id, bc_1.cycle_start_date, count(*) FILTER (WHERE ur.is_included) AS included_orders_count, count(*) FILTER (WHERE NOT ur.is_included) AS billed_orders_count FROM usage_record ur JOIN billing_cycles bc_1 ON ur.organization_id = bc_1.organization_id AND ur.created_at >= bc_1.cycle_start_date AND ur.created_at < bc_1.cycle_end_date GROUP BY ur.organization_id, bc_1.cycle_start_date ) SELECT os.organization_id, os.status, sp.name AS plan_name, bc.cycle_start_date AS billing_cycle_start, bc.cycle_end_date AS billing_cycle_end, sp.price_amount AS monthly_fixed_cost, sp.price_currency_code, sp.price_per_order AS cost_per_order, sp.orders_per_month_included AS included_orders, COALESCE(uc.included_orders_count, 0::bigint) AS included_orders_count, COALESCE(uc.billed_orders_count, 0::bigint) AS billed_orders_count, bc.cycle_number FROM organization_subscription os JOIN subscription_plan sp ON os.plan_id = sp.id JOIN billing_cycles bc ON os.organization_id = bc.organization_id LEFT JOIN usage_counts uc ON os.organization_id = uc.organization_id AND bc.cycle_start_date = uc.cycle_start_date WHERE bc.cycle_start_date <= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text));--> statement-breakpoint
CREATE VIEW "public"."store_credit_balance" AS (SELECT store_credit.customer_id, store_credit.organization_id, max(store_credit.currency_code) AS currency_code, sum( CASE WHEN now() <@ store_credit.validity_period THEN store_credit.amount_available ELSE 0 END)::integer AS current_balance, sum( CASE WHEN lower(store_credit.validity_period) > now() THEN store_credit.amount_available ELSE 0 END)::integer AS upcoming_balance FROM store_credit GROUP BY store_credit.customer_id, store_credit.organization_id);
*/