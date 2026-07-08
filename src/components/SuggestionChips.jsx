import { SUGGESTIONS } from '../services/api'
import { useTheme } from '../context/ThemeContext'

/* The answer to "people don't know what to ask": clickable starter
   questions, each wired to a real validated endpoint. */

export default function SuggestionChips({ onPick, activeLabel }) {
  const { isDark } = useTheme()

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        padding: '0 1.5rem',
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {SUGGESTIONS.map((s) => {
        const active = s.label === activeLabel
        return (
          <button
            key={s.label}
            onClick={() => onPick(s)}
            title={s.description}
            style={{
              background: active ? 'var(--accent)' : isDark ? 'var(--surface-raised)' : 'transparent',
              color: active ? 'var(--accent-contrast)' : 'var(--ink-secondary)',
              border: `0.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: isDark ? 16 : 'var(--radius)',
              padding: '7px 15px',
              fontSize: 12.5,
              fontFamily: isDark ? 'var(--font-body)' : 'var(--font-display)',
              fontStyle: isDark ? 'normal' : 'italic',
              transition: 'all 0.2s ease',
            }}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
