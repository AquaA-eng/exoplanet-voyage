import { classify, CLASS_LABELS, colorsFor, formatDistance, formatOrbit } from '../utils/planetVisuals'

/* The second layer of depth: click a planet on the voyage,
   get its full record. */

export default function PlanetDetail({ planet, onClose }) {
  if (!planet) return null

  const cls = classify(planet.radius_earth)
  const { base, shade } = colorsFor(planet)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 10, 14, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--card-radius)',
          maxWidth: 420,
          width: '100%',
          padding: '2rem 1.75rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: base,
            margin: '0 auto 1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <span style={{ position: 'absolute', top: '25%', left: '12%', width: '30%', height: '10%', borderRadius: '50%', background: shade, opacity: 0.7 }} />
          <span style={{ position: 'absolute', bottom: '22%', right: '15%', width: '22%', height: '9%', borderRadius: '50%', background: shade, opacity: 0.6 }} />
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22, color: 'var(--ink)', marginBottom: 4 }}>
          {planet.planet_name}
        </h2>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 13, marginBottom: '1.25rem' }}>
          {CLASS_LABELS[cls]} orbiting {planet.star_name}
        </p>

        <div style={{ borderTop: '0.5px solid var(--border-soft)', paddingTop: '1rem', textAlign: 'left' }}>
          <Row label="Distance" value={formatDistance(planet.distance_ly)} />
          <Row label="Size" value={planet.radius_earth + " times Earth's radius"} />
          <Row label="Orbit" value={formatOrbit(planet.orbital_period_days)} />
          <Row label="Discovered" value={planet.discovery_year + ', by ' + planet.method_name} />
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '1.5rem',
            background: 'var(--accent)',
            color: 'var(--accent-contrast)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '9px 22px',
            fontSize: 13,
          }}
        >
          Back to the voyage
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '5px 0', fontSize: 13 }}>
      <span style={{ color: 'var(--ink-muted)' }}>{label}</span>
      <span style={{ color: 'var(--ink)', textAlign: 'right' }}>{value}</span>
    </div>
  )
}
