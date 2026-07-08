import { useState } from 'react'
import { api } from '../services/api'

/* ============================================================
   QUESTION BOOK — the full validated question set, browsable.
   Solves "people don't know what to ask" completely: every
   question from the requirements spec, grouped, clickable.
   - 'voyage'  -> renders a route of planets
   - 'answer'  -> renders a text answer banner
   - null      -> honest roadmap: needs the next backend release
   ============================================================ */

export const QUESTIONS = [
  { group: 'Distance & location', q: 'Which planets are within 50 light years of Earth?', action: { type: 'voyage', run: () => api.search({ maxDistance: 50, limit: 24 }) } },
  { group: 'Distance & location', q: "What's the closest known exoplanet to Earth?", action: { type: 'voyage', run: () => api.search({ limit: 1 }) } },
  { group: 'Distance & location', q: 'How many planets are beyond 1,000 light years?', action: null },
  { group: 'Distance & location', q: 'Which star hosts the most confirmed planets?', action: { type: 'answer', run: async () => { const r = await api.mostPlanets(1); return `${r[0].star_name} hosts ${r[0].planet_count} confirmed planets — the most of any known star.` } } },
  { group: 'Distance & location', q: "What's the average distance of all discovered exoplanets?", action: null },
  { group: 'Size & type', q: 'Which planets are roughly Earth-sized?', action: { type: 'voyage', run: () => api.closestHabitable(200, 0.8, 1.25) } },
  { group: 'Size & type', q: "What's the largest confirmed exoplanet?", action: { type: 'answer', run: async () => { const r = await api.largest(); return `${r[0].planet_name} — ${r[0].radius_earth} times Earth's radius, the largest on record.` } } },
  { group: 'Size & type', q: "What's the smallest confirmed exoplanet?", action: { type: 'answer', run: async () => { const r = await api.smallest(); return `${r[0].planet_name} — just ${r[0].radius_earth} times Earth's radius, roughly the size of our Moon.` } } },
  { group: 'Size & type', q: 'How many gas giants have been found?', action: { type: 'answer', run: async () => { const s = await api.summary(); return `${s.gas_giant_count.toLocaleString()} gas giants (over 6 Earth radii), alongside ${s.rocky_count.toLocaleString()} smaller worlds.` } } },
  { group: 'Size & type', q: 'How has typical planet size changed by discovery year?', action: null },
  { group: 'Discovery methods', q: 'Which method has found the most planets?', action: { type: 'answer', run: async () => { const r = await api.byMethod(); return `${r[0].method_name} leads with ${r[0].planet_count.toLocaleString()} planets found.` } } },
  { group: 'Discovery methods', q: 'Which planets have we actually photographed?', action: { type: 'voyage', run: () => api.search({ method: 'Imaging', limit: 24 }) } },
  { group: 'Discovery methods', q: 'Which method finds the smallest planets on average?', action: { type: 'answer', run: async () => { const r = await api.byMethod(); const s = [...r].sort((a, b) => a.avg_radius - b.avg_radius)[0]; return `${s.method_name} — its finds average ${s.avg_radius} Earth radii, the smallest of any method.` } } },
  { group: 'Discovery methods', q: 'Has the dominant discovery method changed over time?', action: null },
  { group: 'Discovery over time', q: 'How many planets were discovered each year?', action: null },
  { group: 'Discovery over time', q: 'Is the discovery rate increasing or slowing?', action: null },
  { group: 'Discovery over time', q: 'What years does the record span?', action: { type: 'answer', run: async () => { const s = await api.summary(); return `The archive spans ${s.earliest_year} to ${s.latest_year} — ${s.total_planets.toLocaleString()} confirmed planets and counting.` } } },
  { group: 'Orbits', q: "What's the shortest orbital period on record?", action: null },
  { group: 'Orbits', q: "What's the longest orbital period on record?", action: null },
  { group: 'Orbits', q: 'How many planets orbit their star in under 10 days?', action: null },
  { group: 'Orbits', q: 'Is there a link between orbit length and planet size?', action: null },
  { group: 'Habitability', q: 'Which planets are both close to Earth and Earth-sized?', action: { type: 'voyage', run: () => api.closestHabitable() } },
  { group: 'Habitability', q: 'How many rocky vs gas giant planets exist?', action: { type: 'answer', run: async () => { const s = await api.summary(); const pct = Math.round((s.rocky_count / s.total_planets) * 100); return `${s.rocky_count.toLocaleString()} rocky-or-smaller worlds vs ${s.gas_giant_count.toLocaleString()} gas giants — about ${pct}% of known planets are on the smaller side.` } } },
  { group: 'Star systems', q: 'Which stars host multiple planets?', action: { type: 'answer', run: async () => { const r = await api.mostPlanets(5); return 'Top multi-planet systems: ' + r.map((s) => `${s.star_name} (${s.planet_count})`).join(', ') + '.' } } },
  { group: 'Star systems', q: "What's the average number of planets per star?", action: null },
  { group: 'Star systems', q: 'How many single vs multi-planet systems are there?', action: null },
  { group: 'The big picture', q: 'How many confirmed exoplanets are there in total?', action: { type: 'answer', run: async () => { const s = await api.summary(); return `${s.total_planets.toLocaleString()} confirmed exoplanets, live from NASA's archive.` } } },
  { group: 'The big picture', q: 'Which planets hold the size records?', action: { type: 'answer', run: async () => { const [sm, lg] = await Promise.all([api.smallest(), api.largest()]); return `Smallest: ${sm[0].planet_name} (${sm[0].radius_earth}x Earth). Largest: ${lg[0].planet_name} (${lg[0].radius_earth}x Earth).` } } },
  { group: 'The big picture', q: 'Which method dominates recent discoveries?', action: null },
]

export default function QuestionBook({ open, onClose, onVoyage, onAnswer }) {
  if (!open) return null

  const groups = [...new Set(QUESTIONS.map((x) => x.group))]

  async function pick(item) {
    if (!item.action) return
    onClose()
    if (item.action.type === 'voyage') onVoyage({ label: item.q, run: item.action.run })
    else onAnswer(item.q, item.action.run)
  }

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Browse all questions"
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,14,0.55)', zIndex: 20, display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--card-radius)', maxWidth: 560, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '1.75rem 1.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 19, color: 'var(--ink)' }}>Every question you can ask</h2>
          <button onClick={onClose} aria-label="Close question list" style={{ background: 'transparent', border: 'none', color: 'var(--ink-secondary)', fontSize: 14 }}>Close</button>
        </div>
        <p style={{ color: 'var(--ink-muted)', fontSize: 12, marginBottom: '1.25rem', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
          Greyed questions are charted for the next release of the archive.
        </p>

        {groups.map((g) => (
          <div key={g} style={{ marginBottom: '1.1rem' }}>
            <p style={{ color: 'var(--ink-muted)', fontSize: 10.5, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>{g}</p>
            {QUESTIONS.filter((x) => x.group === g).map((item) => (
              <button
                key={item.q}
                onClick={() => pick(item)}
                disabled={!item.action}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  padding: '5px 0',
                  fontSize: 13.5,
                  color: item.action ? 'var(--ink)' : 'var(--ink-muted)',
                  cursor: item.action ? 'pointer' : 'default',
                  opacity: item.action ? 1 : 0.55,
                }}
              >
                {item.q}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
