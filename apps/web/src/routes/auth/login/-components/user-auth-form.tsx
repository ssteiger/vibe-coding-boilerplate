import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { ArrowRight, Github, LoaderCircle } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { loginFn, oauthFn, verifyCodeFn } from '~/lib/auth/server'
import { Button } from '~/lib/components/ui/button'
import { Input } from '~/lib/components/ui/input'
import { Label } from '~/lib/components/ui/label'
import { cn } from '~/lib/utils/cn'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthFormLogin({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = React.useState<string>('')
  const [verificationCode, setVerificationCode] = React.useState<string>('')
  const [isEmailSent, setIsEmailSent] = React.useState<boolean>(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: async (variables: { email: string }) => {
      return await loginFn({ data: variables })
    },
    onSuccess: () => {
      setIsEmailSent(true)
      toast.success('Login verification code sent to your email')
    },
    onError: (error) => {
      toast.error(`Login failed: ${error.message}`)
    },
  })

  const verifyCodeMutation = useMutation({
    mutationFn: async (variables: { email: string; code: string }) => {
      return await verifyCodeFn({ data: variables })
    },
    onSuccess: async () => {
      toast.success('Login successful')
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      router.navigate({ to: '/' })
    },
    onError: (error) => {
      toast.error(`Verification failed: ${error.message}`)
    },
  })

  const oauthMutation = useMutation({
    mutationFn: async (variables: { provider: 'github' }) => {
      return await oauthFn({ data: variables })
    },
    onSuccess: async () => {
      toast.success('Login successful')
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      router.navigate({ to: '/' })
    },
    onError: (error) => {
      toast.error(`GitHub login failed: ${error.message}`)
    },
  })

  const isLoading =
    loginMutation.isPending || oauthMutation.isPending || verifyCodeMutation.isPending

  const error =
    loginMutation.error?.message ||
    oauthMutation.error?.message ||
    verifyCodeMutation.error?.message ||
    null

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    loginMutation.mutate({ email })
  }

  async function onVerifyCode(event: React.SyntheticEvent) {
    event.preventDefault()
    verifyCodeMutation.mutate({ email, code: verificationCode })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {error && <div className="p-3 text-sm text-red-500 rounded-md bg-red-50">{error}</div>}

      {isEmailSent && (
        <div className="p-3 text-sm text-green-600 rounded-md bg-green-50">
          Check your email for a login link or verification code.
        </div>
      )}

      {!isEmailSent ? (
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button disabled={isLoading} type="submit">
              {loginMutation.isPending && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
              Send Login Link
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={onVerifyCode}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="Enter the code from your email"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <Button disabled={isLoading} type="submit">
              {verifyCodeMutation.isPending && (
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
              )}
              Verify and Login
            </Button>
          </div>
        </form>
      )}

      {isEmailSent && (
        <a href="http://localhost:54424/" target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" className="w-full">
            Open local email client <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </a>
      )}

      {!isEmailSent && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => oauthMutation.mutate({ provider: 'github' })}
          >
            {oauthMutation.isPending ? (
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Github className="w-4 h-4 mr-2" />
            )}{' '}
            GitHub
          </Button>
        </>
      )}
    </div>
  )
}
