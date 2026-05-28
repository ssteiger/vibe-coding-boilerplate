import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { getSupabaseServerClient } from '~/lib/utils/supabase/server'

/**
 * Shape of the authenticated user available to the rest of the app. The
 * Supabase `User` type contains nested fields that aren't safe to round-trip
 * through TanStack Start's server-fn serializer, so we project only the
 * fields the UI actually needs.
 */
export type CurrentUser = {
  id: string
  email: string | null
  // Supabase exposes these as loose key/value bags. TanStack Start's server-fn
  // serializer is happy with `object` (anything non-primitive) but rejects
  // `unknown`, so we pin the type accordingly.
  user_metadata: object
  app_metadata: object
  created_at: string
}

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CurrentUser | null> => {
    const supabase = getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Round-trip through JSON so we (a) hand TanStack Start's server-fn
    // serializer something it can fully validate, and (b) strip any
    // function-valued props Supabase might attach to metadata.
    return {
      id: user.id,
      email: user.email ?? null,
      user_metadata: JSON.parse(JSON.stringify(user.user_metadata ?? {})) as object,
      app_metadata: JSON.parse(JSON.stringify(user.app_metadata ?? {})) as object,
      created_at: user.created_at,
    }
  },
)

export const loginFn = createServerFn()
  .validator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: '/auth/callback',
      },
    })

    if (error) throw new Error(error.message)
    return { success: true }
  })

export const verifyCodeFn = createServerFn()
  .validator((data: { email: string; code: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.verifyOtp({
      token: data.code,
      email: data.email,
      type: 'email',
    })

    if (error) throw new Error(error.message)
    return { success: true }
  })

export const oauthFn = createServerFn()
  .validator((data: { provider: 'github' }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: result, error } = await supabase.auth.signInWithOAuth({
      provider: data.provider,
      options: {
        redirectTo: '/auth/callback',
      },
    })

    if (error) throw new Error(error.message)
    return { url: result.url }
  })

export const logoutFn = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) throw new Error(error.message)

  throw redirect({ href: '/auth/login' })
})
