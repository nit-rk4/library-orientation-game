import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ArcadeAudioProvider } from './audio/ArcadeAudioContext'
import '@fontsource/press-start-2p/latin-400.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArcadeAudioProvider>
      <App />
    </ArcadeAudioProvider>
  </StrictMode>,
)
