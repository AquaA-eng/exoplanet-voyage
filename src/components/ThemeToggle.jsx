import { useTheme } from '../context/ThemeContext'

/* Small, quiet toggle. Includes the sustainability note as a title
   tooltip — the research detail becomes a product detail. */

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={
        isDark
          ? 'Switch to field guide (light) — better daytime readability'
          : 'Switch to deep space (dark) — saves up to ~40% battery on OLED screens'
      }
      aria-label="Toggle color theme"
      style={{
        background: 'transparent',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        color: 'var(--ink-secondary)',
        padding: '8px 14px',
        fontSize: 13,
      }}
    >
      {isDark ? 'Field guide' : 'Deep space'}
    </button>
  )
}
