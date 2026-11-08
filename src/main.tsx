import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { applyTheme, getInitialTheme } from './lib/theme'

// Apply the theme before the first render so the page does not flash.
applyTheme(getInitialTheme())

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('The #root element is missing from index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
