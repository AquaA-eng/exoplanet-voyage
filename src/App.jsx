import { useEffect, useState } from 'react'
import { api, SUGGESTIONS } from './services/api'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import SuggestionChips from './components/SuggestionChips'
import Voyage from './components/Voyage'
import PlanetDetail from './components/PlanetDetail'
import QuestionBook from './components/QuestionBook'

/* ============================================================
   APP — the conductor. Owns page state and passes it down.
   ============================================================ */

const STARS = Array.from({ length: 40 }, () => ({
  top: Math.random() * 100 + '%',
  left: Math.random() * 100 + '%',
  size: Math.random() > 0.7 ? 2 : 1,
}))

export default function App() {
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState(null)
  const [activeChip, setActiveChip] = useState(SUGGESTIONS[0].label)
  const [totalPlanets, setTotalPlanets] = useState(null)
  const [bookOpen, setBookOpen] = useState(false)
  const [answer, setAnswer] = useState(null)   /* { q, text } */
  const [zoom, setZoom] = useState(1)          /* 0.6 – 1.8 */

  useEffect(() => {
    api.summary()
      .then((s) => setTotalPlanets(s.total_planets))
      .catch(() => {})
    runQuery(SUGGESTIONS[0])
  }, [])

  async function runQuery(routed) {
    setLoading(true)
    setError(false)
    setAnswer(null)
    setActiveChip(routed.label)
    try {
      const data = await routed.run()
      setPlanets(Array.isArray(data) ? data.slice(0, 24) : data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function runAnswer(q, run) {
    setAnswer({ q, text: 'Consulting the archive…' })
    try {
      const text = await run()
      setAnswer({ q, text })
    } catch {
      setAnswer({ q, text: "Couldn't reach the archive for that one — is the backend running?" })
    }
  }

  return (
    <>
      <div className="starfield" aria-hidden="true">
        {STARS.map((s, i) => (
          <span key={i} className="star" style={{ top: s.top, left: s.left, width: s.size, height: s.size }} />
        ))}
      </div>

      <Header totalPlanets={totalPlanets} />

      <div style={{ height: '1.25rem' }} />

      <SearchBar onAsk={runQuery} />

      <SuggestionChips onPick={runQuery} activeLabel={activeChip} />

      <div style={{ textAlign: 'center', marginTop: '-1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => setBookOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--ink-secondary)',
            fontSize: 12.5,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Browse every question you can ask
        </button>
      </div>

      {answer && (
        <div
          role="status"
          style={{
            maxWidth: 560,
            margin: '0 auto 1.5rem',
            padding: '1rem 1.25rem',
            background: 'var(--surface)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--card-radius)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p style={{ color: 'var(--ink-muted)', fontSize: 11.5, marginBottom: 4, fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{answer.q}</p>
          <p style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.5 }}>{answer.text}</p>
        </div>
      )}

      <Voyage planets={planets} loading={loading} error={error} onSelect={setSelected} zoom={zoom} />

      <PlanetDetail planet={selected} onClose={() => setSelected(null)} />

      <QuestionBook open={bookOpen} onClose={() => setBookOpen(false)} onVoyage={runQuery} onAnswer={runAnswer} />

      {/* Zoom control — fixed, keyboard accessible */}
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 5,
          background: 'var(--surface)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--card-radius)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ color: 'var(--ink-muted)', fontSize: 11 }} aria-hidden="true">Zoom</span>
        <input
          type="range"
          min="0.6"
          max="1.8"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label="Zoom the voyage in or out"
          style={{ width: 110, accentColor: 'var(--accent)' }}
        />
      </div>

      <footer style={{ textAlign: 'center', padding: '0 1.5rem 4.5rem', position: 'relative', zIndex: 1 }}>
        <p style={{ color: 'var(--ink-muted)', fontSize: 11, fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
          Planet illustrations rendered from NASA measurements — size, class, and temperature drawn to data.
        </p>
      </footer>
    </>
  )
}
