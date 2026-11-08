export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'app-theme'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/** Reads the saved theme, then falls back to the operating-system preference. */
export function getInitialTheme(): Theme {
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (isTheme(saved)) {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Puts the theme on <html> so the `.dark` token block in tokens.css applies. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}
