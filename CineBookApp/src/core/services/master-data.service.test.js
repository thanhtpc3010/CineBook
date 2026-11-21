import test from 'node:test'
import assert from 'node:assert/strict'
import { displayValue, fetchMasterData } from './master-data.service.js'

const masterData = {
  cities: [{ cityid: 1, cityname: 'Hà Nội', isactive: true }],
  theaters: [{ theaterid: 1, cityid: 1, theatername: 'CineBook Ba Đình', address: 'Kim Mã', isactive: true }],
  screens: [{ screenid: 1, theaterid: 1, screenname: 'Phòng 01' }],
  seatcategories: [{ categoryid: 1, categoryname: 'Standard', basepricemultiplier: 1 }],
  seats: [{ seatid: 1, screenid: 1, categoryid: 1, rowname: 'A', seatnumber: 1 }],
  genres: [{ genreid: 1, genrename: 'Hành động' }],
  movies: [{ movieid: 1, title: 'Mẫu', genreids: [1], releasedate: '2026-11-15', status: 1 }],
}

test('fetches and validates the complete Master Data API payload', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify({ data: masterData }), { status: 200 })
  assert.deepEqual(await fetchMasterData(), masterData)
  globalThis.fetch = originalFetch
})

test('rejects an incomplete Master Data API payload', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify({ data: { cities: [] } }), { status: 200 })
  await assert.rejects(fetchMasterData(), /không hợp lệ/)
  globalThis.fetch = originalFetch
})

test('formats database relations and derived counts', () => {
  assert.equal(displayValue('theaters', 'cityid', masterData.theaters[0], masterData), 'Hà Nội')
  assert.equal(displayValue('theaters', 'totalscreens', masterData.theaters[0], masterData), 1)
  assert.equal(displayValue('screens', 'totalseats', masterData.screens[0], masterData), 1)
  assert.equal(displayValue('movies', 'genreids', masterData.movies[0], masterData), 'Hành động')
})
