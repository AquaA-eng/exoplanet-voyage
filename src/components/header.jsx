import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'

export default function Header({ totalPlanets }) {
  const { isDark } = useTheme()

  return (
    <header style={{ position: 'relative', zIndex: 1, padding: '2.5rem 1.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 960, margin: '0 auto' }}>
        <ThemeToggle />
      </div>

      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
        {!isDark && (
          <p
            style={{
              color: 'var(--ink-muted)',
              fontSize: 11,
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            A FIELD GUIDE TO
          </p>
        )}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 30,
            color: 'var(--ink)',
            marginBottom: 6,
          }}
        >
          {isDark ? 'Ask the galaxy' : 'Worlds Beyond Our Sun'}
        </h1>
        <p
          style={{
            color: 'var(--ink-muted)',
            fontSize: 13,
            fontStyle: isDark ? 'normal' : 'italic',
            fontFamily: isDark ? 'var(--font-body)' : 'var(--font-display)',
          }}
        >
          {totalPlanets
            ? `${totalPlanets.toLocaleString()} confirmed worlds, live from NASA`
            : 'Confirmed worlds, live from NASA'}
        </p>
      </div>
    </header>
  )
}
