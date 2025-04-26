import { relations } from "drizzle-orm/relations";
import { shop_customer, customer_membership, membership, organization, airdrop_campaign, birthday_reward_program, branding_settings, cashback_program, job_run, mb_cashback_override, mb_free_products, mb_free_shipping, mb_referral_override, referred_customer_gets_type, referring_customer_gets_type, mb_tier_reached_bonus, migration_import, referral, review_reward_program, shop_order, store_credit, store_credit_source_type, store_credit_transaction, bulk_operation_job, job_run_task, organization_subscription, subscription_plan, referral_page_view, usage_record, user, account, organization_member, organization_member_invite, session, apikey, store_credit_setting, referral_program, customer_card_design, integration, organization_integration } from "./schema";

export const customer_membershipRelations = relations(customer_membership, ({one}) => ({
	shop_customer: one(shop_customer, {
		fields: [customer_membership.customer_id],
		references: [shop_customer.id]
	}),
	membership: one(membership, {
		fields: [customer_membership.membership_id],
		references: [membership.id]
	}),
	organization: one(organization, {
		fields: [customer_membership.organization_id],
		references: [organization.id]
	}),
}));

export const shop_customerRelations = relations(shop_customer, ({one, many}) => ({
	customer_memberships: many(customer_membership),
	referrals: many(referral),
	organization: one(organization, {
		fields: [shop_customer.organization_id],
		references: [organization.id]
	}),
}));

export const membershipRelations = relations(membership, ({one, many}) => ({
	customer_memberships: many(customer_membership),
	mb_cashback_overrides: many(mb_cashback_override),
	mb_free_products: many(mb_free_products),
	mb_free_shippings: many(mb_free_shipping),
	mb_referral_overrides: many(mb_referral_override),
	mb_tier_reached_bonuses: many(mb_tier_reached_bonus),
	organization: one(organization, {
		fields: [membership.organization_id],
		references: [organization.id]
	}),
	customer_card_designs: many(customer_card_design),
}));

export const organizationRelations = relations(organization, ({many}) => ({
	customer_memberships: many(customer_membership),
	airdrop_campaigns: many(airdrop_campaign),
	birthday_reward_programs: many(birthday_reward_program),
	branding_settings: many(branding_settings),
	cashback_programs: many(cashback_program),
	job_runs: many(job_run),
	mb_cashback_overrides: many(mb_cashback_override),
	mb_free_products: many(mb_free_products),
	mb_free_shippings: many(mb_free_shipping),
	mb_referral_overrides: many(mb_referral_override),
	mb_tier_reached_bonuses: many(mb_tier_reached_bonus),
	memberships: many(membership),
	migration_imports: many(migration_import),
	referrals: many(referral),
	review_reward_programs: many(review_reward_program),
	shop_customers: many(shop_customer),
	shop_orders: many(shop_order),
	store_credits: many(store_credit),
	store_credit_transactions: many(store_credit_transaction),
	bulk_operation_jobs: many(bulk_operation_job),
	job_run_tasks: many(job_run_task),
	organization_subscriptions: many(organization_subscription),
	referral_page_views: many(referral_page_view),
	usage_records: many(usage_record),
	organization_members: many(organization_member),
	organization_member_invites: many(organization_member_invite),
	store_credit_settings: many(store_credit_setting),
	referral_programs: many(referral_program),
	customer_card_designs: many(customer_card_design),
	organization_integrations: many(organization_integration),
}));

export const airdrop_campaignRelations = relations(airdrop_campaign, ({one}) => ({
	organization: one(organization, {
		fields: [airdrop_campaign.organization_id],
		references: [organization.id]
	}),
}));

export const birthday_reward_programRelations = relations(birthday_reward_program, ({one}) => ({
	organization: one(organization, {
		fields: [birthday_reward_program.organization_id],
		references: [organization.id]
	}),
}));

export const branding_settingsRelations = relations(branding_settings, ({one}) => ({
	organization: one(organization, {
		fields: [branding_settings.organization_id],
		references: [organization.id]
	}),
}));

export const cashback_programRelations = relations(cashback_program, ({one}) => ({
	organization: one(organization, {
		fields: [cashback_program.organization_id],
		references: [organization.id]
	}),
}));

export const job_runRelations = relations(job_run, ({one, many}) => ({
	organization: one(organization, {
		fields: [job_run.organization_id],
		references: [organization.id]
	}),
	job_run_tasks: many(job_run_task),
}));

export const mb_cashback_overrideRelations = relations(mb_cashback_override, ({one}) => ({
	organization: one(organization, {
		fields: [mb_cashback_override.organization_id],
		references: [organization.id]
	}),
	membership: one(membership, {
		fields: [mb_cashback_override.membership_id],
		references: [membership.id]
	}),
}));

export const mb_free_productsRelations = relations(mb_free_products, ({one}) => ({
	membership: one(membership, {
		fields: [mb_free_products.membership_id],
		references: [membership.id]
	}),
	organization: one(organization, {
		fields: [mb_free_products.organization_id],
		references: [organization.id]
	}),
}));

export const mb_free_shippingRelations = relations(mb_free_shipping, ({one}) => ({
	organization: one(organization, {
		fields: [mb_free_shipping.organization_id],
		references: [organization.id]
	}),
	membership: one(membership, {
		fields: [mb_free_shipping.membership_id],
		references: [membership.id]
	}),
}));

export const mb_referral_overrideRelations = relations(mb_referral_override, ({one}) => ({
	organization: one(organization, {
		fields: [mb_referral_override.organization_id],
		references: [organization.id]
	}),
	membership: one(membership, {
		fields: [mb_referral_override.membership_id],
		references: [membership.id]
	}),
	referred_customer_gets_type: one(referred_customer_gets_type, {
		fields: [mb_referral_override.referred_customer_gets_type],
		references: [referred_customer_gets_type.referred_customer_gets_type]
	}),
	referring_customer_gets_type: one(referring_customer_gets_type, {
		fields: [mb_referral_override.referring_customer_gets_type],
		references: [referring_customer_gets_type.referring_customer_gets_type]
	}),
}));

export const referred_customer_gets_typeRelations = relations(referred_customer_gets_type, ({many}) => ({
	mb_referral_overrides: many(mb_referral_override),
	referral_programs: many(referral_program),
}));

export const referring_customer_gets_typeRelations = relations(referring_customer_gets_type, ({many}) => ({
	mb_referral_overrides: many(mb_referral_override),
	referral_programs: many(referral_program),
}));

export const mb_tier_reached_bonusRelations = relations(mb_tier_reached_bonus, ({one}) => ({
	membership: one(membership, {
		fields: [mb_tier_reached_bonus.membership_id],
		references: [membership.id]
	}),
	organization: one(organization, {
		fields: [mb_tier_reached_bonus.organization_id],
		references: [organization.id]
	}),
}));

export const migration_importRelations = relations(migration_import, ({one}) => ({
	organization: one(organization, {
		fields: [migration_import.organization_id],
		references: [organization.id]
	}),
}));

export const referralRelations = relations(referral, ({one}) => ({
	organization: one(organization, {
		fields: [referral.organization_id],
		references: [organization.id]
	}),
	shop_customer: one(shop_customer, {
		fields: [referral.referring_customer_id],
		references: [shop_customer.id]
	}),
}));

export const review_reward_programRelations = relations(review_reward_program, ({one}) => ({
	organization: one(organization, {
		fields: [review_reward_program.organization_id],
		references: [organization.id]
	}),
}));

export const shop_orderRelations = relations(shop_order, ({one}) => ({
	organization: one(organization, {
		fields: [shop_order.organization_id],
		references: [organization.id]
	}),
}));

export const store_creditRelations = relations(store_credit, ({one}) => ({
	organization: one(organization, {
		fields: [store_credit.organization_id],
		references: [organization.id]
	}),
	store_credit_source_type: one(store_credit_source_type, {
		fields: [store_credit.source_type],
		references: [store_credit_source_type.store_credit_source_type]
	}),
}));

export const store_credit_source_typeRelations = relations(store_credit_source_type, ({many}) => ({
	store_credits: many(store_credit),
}));

export const store_credit_transactionRelations = relations(store_credit_transaction, ({one}) => ({
	organization: one(organization, {
		fields: [store_credit_transaction.organization_id],
		references: [organization.id]
	}),
}));

export const bulk_operation_jobRelations = relations(bulk_operation_job, ({one}) => ({
	organization: one(organization, {
		fields: [bulk_operation_job.organization_id],
		references: [organization.id]
	}),
}));

export const job_run_taskRelations = relations(job_run_task, ({one}) => ({
	job_run: one(job_run, {
		fields: [job_run_task.job_run_id],
		references: [job_run.id]
	}),
	organization: one(organization, {
		fields: [job_run_task.organization_id],
		references: [organization.id]
	}),
}));

export const organization_subscriptionRelations = relations(organization_subscription, ({one, many}) => ({
	organization: one(organization, {
		fields: [organization_subscription.organization_id],
		references: [organization.id]
	}),
	subscription_plan: one(subscription_plan, {
		fields: [organization_subscription.plan_id],
		references: [subscription_plan.id]
	}),
	usage_records: many(usage_record),
}));

export const subscription_planRelations = relations(subscription_plan, ({many}) => ({
	organization_subscriptions: many(organization_subscription),
	usage_records: many(usage_record),
}));

export const referral_page_viewRelations = relations(referral_page_view, ({one}) => ({
	organization: one(organization, {
		fields: [referral_page_view.organization_id],
		references: [organization.id]
	}),
}));

export const usage_recordRelations = relations(usage_record, ({one}) => ({
	organization: one(organization, {
		fields: [usage_record.organization_id],
		references: [organization.id]
	}),
	subscription_plan: one(subscription_plan, {
		fields: [usage_record.plan_id],
		references: [subscription_plan.id]
	}),
	organization_subscription: one(organization_subscription, {
		fields: [usage_record.subscription_id],
		references: [organization_subscription.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.user_id],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	organization_members: many(organization_member),
	organization_member_invites: many(organization_member_invite),
	sessions: many(session),
	apikeys: many(apikey),
}));

export const organization_memberRelations = relations(organization_member, ({one}) => ({
	organization: one(organization, {
		fields: [organization_member.organization_id],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [organization_member.user_id],
		references: [user.id]
	}),
}));

export const organization_member_inviteRelations = relations(organization_member_invite, ({one}) => ({
	organization: one(organization, {
		fields: [organization_member_invite.organization_id],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [organization_member_invite.inviter_id],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.user_id],
		references: [user.id]
	}),
}));

export const apikeyRelations = relations(apikey, ({one}) => ({
	user: one(user, {
		fields: [apikey.user_id],
		references: [user.id]
	}),
}));

export const store_credit_settingRelations = relations(store_credit_setting, ({one}) => ({
	organization: one(organization, {
		fields: [store_credit_setting.organization_id],
		references: [organization.id]
	}),
}));

export const referral_programRelations = relations(referral_program, ({one}) => ({
	organization: one(organization, {
		fields: [referral_program.organization_id],
		references: [organization.id]
	}),
	referred_customer_gets_type: one(referred_customer_gets_type, {
		fields: [referral_program.referred_customer_gets_type],
		references: [referred_customer_gets_type.referred_customer_gets_type]
	}),
	referring_customer_gets_type: one(referring_customer_gets_type, {
		fields: [referral_program.referring_customer_gets_type],
		references: [referring_customer_gets_type.referring_customer_gets_type]
	}),
}));

export const customer_card_designRelations = relations(customer_card_design, ({one}) => ({
	organization: one(organization, {
		fields: [customer_card_design.organization_id],
		references: [organization.id]
	}),
	membership: one(membership, {
		fields: [customer_card_design.membership_id],
		references: [membership.id]
	}),
}));

export const organization_integrationRelations = relations(organization_integration, ({one}) => ({
	integration: one(integration, {
		fields: [organization_integration.integration],
		references: [integration.slug]
	}),
	organization: one(organization, {
		fields: [organization_integration.organization_id],
		references: [organization.id]
	}),
}));

export const integrationRelations = relations(integration, ({many}) => ({
	organization_integrations: many(organization_integration),
}));