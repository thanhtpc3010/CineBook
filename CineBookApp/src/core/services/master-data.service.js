import { catalogs } from '../models/master-data.js'

const apiBaseUrl = (import.meta.env?.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

export async function fetchMasterData() {
  let response
  try {
    response = await fetch(`${apiBaseUrl}/master-data`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new Error('Không thể kết nối máy chủ. Vui lòng thử lại sau.')
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.data) {
    throw new Error(payload?.message || 'Không tải được dữ liệu từ máy chủ.')
  }

  for (const key of Object.keys(catalogs)) {
    if (!Array.isArray(payload.data[key])) {
      throw new Error('Dữ liệu trả về từ máy chủ không hợp lệ.')
    }
  }

  return payload.data
}

export function displayValue(key, column, row, data) {
  if (column === 'totalscreens') return data.screens.filter(screen => screen.theaterid === row.theaterid).length
  if (column === 'totalseats') return data.seats.filter(seat => seat.screenid === row.screenid).length
  if (column === 'genreids') return row.genreids.map(id => data.genres.find(genre => genre.genreid === id)?.genrename).filter(Boolean).join(', ') || '—'
  const field = catalogs[key].fields.find(item => item.key === column)
  if (field?.type === 'relation') {
    const relatedCatalog = catalogs[field.source]
    const related = data[field.source].find(item => item[relatedCatalog.id] === row[column])
    const label = related?.[relatedCatalog.name] || '—'
    if (column === 'screenid' && related) return `${data.theaters.find(theater => theater.theaterid === related.theaterid)?.theatername || ''} · ${label}`
    return label
  }
  if (field?.type === 'select' && column !== 'status') return field.options.find(([value]) => value === row[column])?.[1] || (column === 'experience' ? 'Classic Cinema' : '—')
  if (column === 'releasedate') return row[column]?.split('-').reverse().join('/') || '—'
  return row[column] ?? '—'
}
