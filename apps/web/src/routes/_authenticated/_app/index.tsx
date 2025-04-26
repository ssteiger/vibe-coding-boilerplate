import { createFileRoute } from '@tanstack/react-router'

const Home = () => {
  return null
}

export const Route = createFileRoute('/_authenticated/_app/')({
  component: Home,
  loader: ({ context, navigate }) => {
    // Redirect to dashboard
    navigate({ to: '/home' })
    return { user: context.user }
  },
})
