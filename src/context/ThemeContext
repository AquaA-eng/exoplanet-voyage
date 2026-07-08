import { createContext, useContext, useEffect, useState } from 'react'

/* ============================================================
   THEME CONTEXT
   One place owns the answer to "which theme are we in?"
   - First visit: respect the user's system preference
     (research: light wins on readability, dark on comfort/battery —
     so we let the user's own OS setting decide the default)
   - After that: remember their explicit choice in localStorage
   - Any component can read the theme or flip it via useTheme()
   ============================================================ */

const ThemeContext = createContext(null)

const THEMES = {
  light: 'field-guide',
  dark: 'deep-space',
}

function getInitialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === THEMES.light || saved === THEMES.dark) return saved
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? THEMES.dark : THEMES.light
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((t) => (t === THEMES.light ? THEMES.dark : THEMES.light))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === THEMES.dark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
