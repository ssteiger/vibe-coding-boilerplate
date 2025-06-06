import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'

const Home = () => {
  const navigate = useNavigate()
  // redirect to home
  navigate({ to: '/home' })
  return null
}

export const Route = createFileRoute('/_authenticated/_app/')({
  component: Home,
})
