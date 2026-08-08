import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { KnowsMoreGame } from './pages/KnowsMoreGame'
import { LandingPage } from './pages/LandingPage'
import { LeaderboardPage } from './pages/LeaderboardPage'

function getHashRoute() {
  return window.location.hash.slice(1) || '/'
}

function App() {
  const [route, setRoute] = useState(getHashRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(getHashRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const page = route === '/knowsmore' || route === '/ralph'
    ? <KnowsMoreGame />
    : route === '/leaderboard'
      ? <LeaderboardPage />
      : <LandingPage />

  return <AppShell route={route}>{page}</AppShell>
}

export default App
