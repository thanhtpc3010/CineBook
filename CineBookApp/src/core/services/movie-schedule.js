export function vietnamDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const part = type => parts.find(item => item.type === type).value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function movieStatus(movie, today = vietnamDate()) {
  if (Number(movie.status) === 0 || !/^\d{4}-\d{2}-\d{2}$/.test(movie.releasedate || '')) return 0
  return movie.releasedate <= today ? 1 : 2
}

export function groupMovies(movies, today = vietnamDate()) {
  const current = movies.filter(movie => movieStatus(movie, today) === 1).sort((a, b) => b.releasedate.localeCompare(a.releasedate))
  const upcoming = movies.filter(movie => movieStatus(movie, today) === 2).sort((a, b) => a.releasedate.localeCompare(b.releasedate))
  return { current, upcoming, featured: [...current, ...upcoming] }
}

export function movieArtwork(movie) {
  if (/^https?:\/\//i.test(movie.posterurl || '')) return movie.posterurl
  return movie.genreids?.includes(4) ? '/art/orbit.svg' : '/art/summer.svg'
}

export function releaseLabel(date) { return date?.split('-').reverse().join('.') || 'Chưa công bố' }
