/* ============================================================
   API SERVICE LAYER
   Every call to the backend lives in this file. Components never
   fetch() directly — they call these functions. If the backend
   URL changes (local → Vercel), you change ONE line here.
   ============================================================ */

const BASE_URL = 'https://exoplanets-delta.vercel.app'
// Local development: const BASE_URL = 'http://127.0.0.1:8000'

async function get(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString()
  const url = `${BASE_URL}${path}${query ? `?${query}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`)
  return res.json()
}

/* --- Endpoints, mirroring api/index.py on the backend --- */

export const api = {
  closestHabitable: (maxDistance = 50, minRadius = 0.5, maxRadius = 1.6) =>
    get('/planets/closest-habitable', {
      max_distance: maxDistance,
      min_radius: minRadius,
      max_radius: maxRadius,
    }),

  smallest: () => get('/planets/smallest'),

  largest: () => get('/planets/largest'),

  search: ({ maxDistance, minRadius, maxRadius, method, limit = 50 } = {}) =>
    get('/planets/search', {
      max_distance: maxDistance,
      min_radius: minRadius,
      max_radius: maxRadius,
      method,
      limit,
    }),

  summary: () => get('/stats/summary'),

  byMethod: () => get('/stats/by-method'),

  mostPlanets: (limit = 5) => get('/stars/most-planets', { limit }),
}

/* --- Suggestion chips: each maps a human question to an API call.
       These come straight from the validated 30-question spec. --- */

export const SUGGESTIONS = [
  {
    label: 'Our nearest neighbors',
    description: 'The closest worlds of any kind — a mixed first voyage',
    run: () => api.search({ maxDistance: 30, limit: 24 }),
  },
  {
    label: 'Closest Earth-like worlds',
    description: 'Within 50 light years, roughly Earth-sized',
    run: () => api.closestHabitable(),
  },
  {
    label: 'Biggest gas giants',
    description: 'The largest worlds on record',
    run: () => api.search({ minRadius: 15, limit: 24 }),
  },
  {
    label: 'Found by direct imaging',
    description: 'Planets we have actually photographed',
    run: () => api.search({ method: 'Imaging', limit: 24 }),
  },
]
