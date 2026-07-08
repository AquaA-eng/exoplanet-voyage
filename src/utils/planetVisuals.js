/* ============================================================
   PLANET VISUALS
   The rule book for turning NASA measurements into a drawing.
   No photos exist for most exoplanets — visuals are generated
   FROM the data, honestly:
   - class (from radius) -> base palette
   - orbital period -> temperature tint (short orbit = hotter)
   - size on screen -> scaled RELATIVE to the current result set,
     so differences stay visible even in a narrow band
   ============================================================ */

export function classify(radiusEarth) {
  if (radiusEarth < 1.6) return 'rocky'
  if (radiusEarth < 4) return 'super-earth'
  if (radiusEarth < 10) return 'neptune-like'
  return 'gas-giant'
}

export const CLASS_LABELS = {
  rocky: 'Rocky world',
  'super-earth': 'Super-Earth',
  'neptune-like': 'Neptune-like',
  'gas-giant': 'Gas giant',
}

const PALETTES = {
  rocky: { base: [15, 55, 46], shade: [12, 52, 35] },          /* h,s,l — rust */
  'super-earth': { base: [213, 38, 47], shade: [213, 41, 38] }, /* slate blue */
  'neptune-like': { base: [193, 28, 49], shade: [194, 30, 38] },/* teal */
  'gas-giant': { base: [38, 52, 54], shade: [36, 50, 44] },     /* banded gold */
}

/* Temperature tint: shorter orbit = closer to star = hotter.
   Shifts hue warmer and brighter for very short orbits. */
function tint([h, s, l], periodDays) {
  if (periodDays == null || periodDays < 0) return [h, s, l]
  if (periodDays < 3) return [Math.max(h - 12, 0), Math.min(s + 22, 90), Math.min(l + 8, 62)]
  if (periodDays < 15) return [Math.max(h - 6, 0), Math.min(s + 10, 85), Math.min(l + 4, 58)]
  if (periodDays > 400) return [h + 6, Math.max(s - 12, 15), Math.max(l - 6, 25)]
  return [h, s, l]
}

const hsl = ([h, s, l]) => `hsl(${h}, ${s}%, ${l}%)`

export function colorsFor(planet) {
  const p = PALETTES[classify(planet.radius_earth)]
  return {
    base: hsl(tint(p.base, planet.orbital_period_days)),
    shade: hsl(tint(p.shade, planet.orbital_period_days)),
  }
}

/* Size scaled relative to the planets currently on screen:
   the smallest in the set gets ~30px, the largest ~90px. */
export function relativeSizer(planets) {
  const radii = planets.map((p) => p.radius_earth)
  const min = Math.min(...radii)
  const max = Math.max(...radii)
  const span = max - min || 1
  return (radiusEarth) => Math.round(30 + ((radiusEarth - min) / span) * 60)
}

export function formatDistance(ly) {
  if (ly == null) return 'Distance unknown'
  if (ly < 10) return `${ly.toFixed(1)} light years from home`
  return `${Math.round(ly).toLocaleString()} light years from home`
}

export function formatOrbit(days) {
  if (days == null || days < 0) return 'Orbit not yet measured'
  if (days < 1) return `Circles its star every ${Math.round(days * 24)} hours`
  if (days < 365) return `Circles its star every ${Math.round(days)} days`
  return `Circles its star every ${(days / 365).toFixed(1)} years`
}

/* Distance milestones for the voyage — markers appear when the
   journey crosses each threshold. */
export const MILESTONES = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
