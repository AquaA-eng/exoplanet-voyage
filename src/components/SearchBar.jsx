import { useState } from 'react'
import { api } from '../services/api'
import { useTheme } from '../context/ThemeContext'

/* ============================================================
   SEARCH BAR — v1 is honest keyword routing, not AI (yet).
   It matches words in the question to the validated endpoints.
   The AI translation layer replaces routeQuestion() later —
   nothing else has to change. That's the point of layering.
   ============================================================ */

export function routeQuestion(text) {
  const q = text.toLowerCase()

  if (q.includes('gas') || q.includes('giant') || q.includes('biggest') || q.includes('largest'))
    return { label: text, run: () => api.search({ minRadius: 10, limit: 24 }) }

  if (q.includes('small')) return { label: text, run: () => api.smallest() }

  if (q.includes('photo') || q.includes('imag') || q.includes('picture') || q.includes('seen'))
    return { label: text, run: () => api.search({ method: 'Imaging', limit: 24 }) }

  if (q.includes('visit') || q.includes('live') || q.includes('habit') || q.includes('earth') || q.includes('human'))
    return { label: text, run: () => api.closestHabitable() }

  if (q.includes('near') || q.includes('close') || q.includes('neighbor'))
    return { label: text, run: () => api.search({ maxDistance: 25, limit: 24 }) }

  /* Default: a scenic mixed route — nearest 24 worlds of any kind */
  return { label: text, run: () => api.search({ limit: 24 }) }
}

export default function SearchBar({ onAsk }) {
  const [text, setText] = useState('')
  const { isDark } = useTheme()

  function submit() {
    if (!text.trim()) return
    onAsk(routeQuestion(text.trim()))
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        maxWidth: 480,
        margin: '0 auto 1rem',
        padding: '0 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Which planets could humans visit first?"
        style={{
          flex: 1,
          background: 'var(--surface-raised)',
          border: '0.5px solid var(--border)',
          borderRadius: isDark ? 20 : 'var(--radius)',
          padding: '10px 16px',
          color: 'var(--ink)',
          fontSize: 13,
          outline: 'none',
        }}
      />
      <button
        onClick={submit}
        style={{
          background: 'var(--accent)',
          border: 'none',
          borderRadius: isDark ? 20 : 'var(--radius)',
          padding: '10px 20px',
          color: 'var(--accent-contrast)',
          fontSize: 13,
        }}
      >
        {isDark ? 'Ask' : 'Look up'}
      </button>
    </div>
  )
}
