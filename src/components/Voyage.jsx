import { colorsFor, classify, CLASS_LABELS, relativeSizer, formatDistance, MILESTONES } from '../utils/planetVisuals'

/* ============================================================
   VOYAGE — the signature element.
   The page is a journey: Earth sits at the top ("You are here"),
   and scrolling down travels outward. Planets appear in true
   distance order, alternating sides of a flight path, with
   milestone markers as you cross 5, 10, 50, 100+ light years.
   Distance IS the layout.
   ============================================================ */

function Earth() {
  return (
    <div style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 30%, #6ea8d8 0%, #3d7ab5 45%, #274f7a 100%)',
          margin: '0 auto 10px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 24px rgba(80, 140, 200, 0.35)',
        }}
        aria-hidden="true"
      >
        <span style={{ position: 'absolute', top: '20%', left: '10%', width: '34%', height: '18%', borderRadius: '50%', background: '#4e8a4e', opacity: 0.85 }} />
        <span style={{ position: 'absolute', bottom: '24%', right: '14%', width: '28%', height: '14%', borderRadius: '50%', background: '#4e8a4e', opacity: 0.8 }} />
        <span style={{ position: 'absolute', top: '10%', right: '20%', width: '40%', height: '10%', borderRadius: '50%', background: '#ffffff', opacity: 0.35 }} />
      </div>
      <p style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500 }}>Earth</p>
      <p style={{ color: 'var(--ink-muted)', fontSize: 12, fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
        You are here. Scroll to leave home.
      </p>
    </div>
  )
}

function Milestone({ ly }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 560, margin: '0 auto', padding: '1.25rem 1.5rem' }}>
      <div style={{ flex: 1, borderTop: '0.5px dashed var(--border)' }} />
      <p style={{ color: 'var(--ink-muted)', fontSize: 11, letterSpacing: 1.5, whiteSpace: 'nowrap' }}>
        {ly.toLocaleString()} LIGHT YEARS FROM HOME
      </p>
      <div style={{ flex: 1, borderTop: '0.5px dashed var(--border)' }} />
    </div>
  )
}

function PlanetStop({ planet, size, side, index, onSelect, zoom = 1 }) {
  const { base, shade } = colorsFor(planet)
  const cls = classify(planet.radius_earth)
  const isGiant = cls === 'gas-giant'

  return (
    <button
      className="card-enter"
      onClick={() => onSelect(planet)}
      style={{
        animationDelay: `${Math.min(index * 30, 300)}ms`,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        flexDirection: side === 'left' ? 'row' : 'row-reverse',
        background: 'transparent',
        border: 'none',
        padding: (0.6 * zoom) + 'rem 1.5rem',
        maxWidth: 560,
        margin: '0 auto',
        width: '100%',
        textAlign: side === 'left' ? 'left' : 'right',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          minWidth: size,
          borderRadius: '50%',
          background: base,
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {isGiant ? (
          <>
            <span style={{ position: 'absolute', top: '26%', left: 0, width: '100%', height: '9%', background: shade, opacity: 0.65 }} />
            <span style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '12%', background: shade, opacity: 0.45 }} />
            <span style={{ position: 'absolute', top: '72%', left: 0, width: '100%', height: '7%', background: shade, opacity: 0.6 }} />
          </>
        ) : (
          <>
            <span style={{ position: 'absolute', top: '24%', left: '14%', width: '30%', height: '12%', borderRadius: '50%', background: shade, opacity: 0.7 }} />
            <span style={{ position: 'absolute', bottom: '20%', right: '16%', width: '22%', height: '10%', borderRadius: '50%', background: shade, opacity: 0.6 }} />
          </>
        )}
      </div>

      <div>
        <p style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, marginBottom: 2 }}>
          {planet.planet_name}
        </p>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 11.5, marginBottom: 2 }}>
          {CLASS_LABELS[cls]} · {planet.radius_earth}x Earth
        </p>
        <p style={{ color: 'var(--highlight)', fontSize: 11.5 }}>{formatDistance(planet.distance_ly)}</p>
      </div>
    </button>
  )
}

export default function Voyage({ planets, loading, error, onSelect, zoom = 1 }) {
  if (loading) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '3rem 1rem', fontSize: 14 }}>
        Charting the route…
      </p>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--ink)', fontSize: 14, marginBottom: 6 }}>
          Couldn't reach the archive. Is the backend running?
        </p>
        <p style={{ color: 'var(--ink-muted)', fontSize: 12.5 }}>
          Start it with: python -m uvicorn api.index:app --reload
        </p>
      </div>
    )
  }

  if (!planets || planets.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '3rem 1rem', fontSize: 14 }}>
        No worlds on this route. Try a different question.
      </p>
    )
  }

  const sorted = [...planets].sort((a, b) => a.distance_ly - b.distance_ly)
  const sizeOf = relativeSizer(sorted)

  const stops = []
  let milestoneIdx = 0
  sorted.forEach((p, i) => {
    while (milestoneIdx < MILESTONES.length && p.distance_ly > MILESTONES[milestoneIdx]) {
      stops.push({ type: 'milestone', ly: MILESTONES[milestoneIdx] })
      milestoneIdx++
    }
    stops.push({ type: 'planet', planet: p, index: i })
  })

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '2rem' }}>
      <Earth />
      {stops.map((stop) =>
        stop.type === 'milestone' ? (
          <Milestone key={'m-' + stop.ly} ly={stop.ly} />
        ) : (
          <PlanetStop
            key={stop.planet.planet_name}
            planet={stop.planet}
            size={Math.round(sizeOf(stop.planet.radius_earth) * zoom)}
            side={stop.index % 2 === 0 ? 'left' : 'right'}
            zoom={zoom}
            index={stop.index}
            onSelect={stop.planet && onSelect}
          />
        )
      )}
      <p
        style={{
          textAlign: 'center',
          color: 'var(--ink-muted)',
          fontSize: 12,
          fontStyle: 'italic',
          fontFamily: 'var(--font-display)',
          paddingTop: '1.5rem',
        }}
      >
        End of this route — ask another question to chart a new one.
      </p>
    </div>
  )
}
