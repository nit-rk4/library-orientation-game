export interface GameModule {
  id: 'knowsmore' | 'ralph'
  title: string
  eyebrow: string
  description: string
  route: string
  status: 'online' | 'queued'
  mode: string
  duration: string
}

export const gameModules: GameModule[] = [
  {
    id: 'knowsmore',
    title: 'KnowsMore’s Missing Word',
    eyebrow: 'MODULE 01 // SEARCH SYSTEM',
    description: 'Restore corrupted library terms through a live database query console.',
    route: '/knowsmore',
    status: 'online',
    mode: 'SOLO',
    duration: '3–5 MIN',
  },
  {
    id: 'ralph',
    title: 'Ralph’s True-or-False Smash',
    eyebrow: 'MODULE 02 // INTEGRITY CHECK',
    description: 'Smash false library data. Save verified rules before the system locks.',
    route: '/ralph',
    status: 'queued',
    mode: 'GROUP',
    duration: 'COMING SOON',
  },
]
