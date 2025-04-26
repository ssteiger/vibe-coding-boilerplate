import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '~/lib/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/lib/components/ui/form'
import { Input } from '~/lib/components/ui/input'
import { toast } from 'sonner'
import { getSupabaseServerClient } from '~/lib/utils/supabase/server'
import { createServerFn } from '@tanstack/react-start'

export const verifyCodeFn = createServerFn()
  .validator((d: { email: string; code: string }) => d)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.verifyOtp({
      token: data.code,
      email: data.email,
      type: 'email',
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  })

const formSchema = z.object({
  code: z.string().min(1, {
    message: 'Verification code is required',
  }),
})

interface UserAuthVerificationCodeFormProps {
  email: string
  onBack?: () => void
}

export function UserAuthVerificationCodeForm({ email, onBack }: UserAuthVerificationCodeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { data, error } = await verifyCodeFn({
        email,
        code: values.code,
      })

      console.log('data', data)
      console.log('error', error)

      if (error) {
        throw new Error('Invalid verification code')
      }

      toast.success('Success!', {
        description: 'You have successfully logged in.',
      })

      // If successful, redirect to dashboard or home
      router.navigate({ to: '/home' })
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Something went wrong',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Verification Code</h1>
          <p className="text-sm text-muted-foreground">
            Please enter the verification code sent to {email}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your verification code"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
                  className="w-full"
                >
                  Back
                </Button>
              )}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
