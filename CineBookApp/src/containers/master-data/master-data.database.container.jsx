import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { catalogs, columnLabels } from '../../core/models/master-data'
import { displayValue, fetchMasterData } from '../../core/services/master-data.service'

export default function DatabaseMasterDataContainer() {
  const { catalog: requestedCatalog = 'theaters' } = useParams()
  const catalogKey = catalogs[requestedCatalog] ? requestedCatalog : 'theaters'

  return <CatalogContainer key={catalogKey} catalogKey={catalogKey} />
}

function CatalogContainer({ catalogKey }) {
  const [loaded, setLoaded] = useState({ data: null, error: '', loading: true })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const catalog = catalogs[catalogKey]

  function reload() {
    setLoaded({ data: null, error: '', loading: true })
    fetchMasterData()
      .then(data => setLoaded({ data, error: '', loading: false }))
      .catch(error => setLoaded({ data: null, error: error.message, loading: false }))
  }

  useEffect(() => {
    fetchMasterData()
      .then(data => setLoaded({ data, error: '', loading: false }))
      .catch(error => setLoaded({ data: null, error: error.message, loading: false }))
  }, [])

  if (loaded.loading) return <section className="admin-empty"><Icon name="film" size={32} /><h1>Đang tải Master Data</h1><p>Đang truy vấn dữ liệu từ Supabase.</p></section>
  if (!loaded.data) return <section className="admin-empty"><Icon name="info" size={32} /><h1>Chưa đọc được dữ liệu</h1><p>{loaded.error}</p><button className="secondary-action" onClick={reload}>Thử lại</button></section>

  const data = loaded.data
  const activeCount = data.theaters.filter(row => row.isactive).length
  const rows = data[catalogKey].filter(row => {
    const text = catalog.columns.map(column => displayValue(catalogKey, column, row, data)).join(' ').toLocaleLowerCase('vi')
    const matchesStatus = status === 'all' || (catalogKey === 'movies' ? String(row.status) === status : String(row.isactive) === status)
    return text.includes(search.toLocaleLowerCase('vi').trim()) && matchesStatus
  })
  const pages = Math.max(1, Math.ceil(rows.length / 8))
  const currentPage = Math.min(page, pages)
  const visibleRows = rows.slice((currentPage - 1) * 8, currentPage * 8)
  const statistics = [
    ['Rạp chiếu', data.theaters.length, `${activeCount} rạp đang hoạt động`, 'film'],
    ['Phòng chiếu', data.screens.length, `${data.seats.length} ghế đã khai báo`, 'grid'],
    ['Phim trong danh mục', data.movies.length, `${data.movies.filter(row => row.status === 1).length} phim đang chiếu`, 'ticket'],
    ['Thể loại phim', data.genres.length, 'Phân loại nội dung điện ảnh', 'layers'],
  ]

  return <>
    <div className="page-heading"><div><span className="section-eyebrow">DỮ LIỆU NỀN TẢNG</span><h1>Master Data<span className="heading-dot">.</span></h1><p>Mọi thông tin, một nơi quản lý.</p></div><span className="heading-tag"><span className="green-dot" />Không gian quản trị</span></div>
    <div className="stat-grid">{statistics.map(([label, value, detail, icon]) => <div className="stat-card" key={label}><div className="stat-label">{label}<span className="stat-icon"><Icon name={icon} size={18} /></span></div><strong>{String(value).padStart(2, '0')}</strong><small>{detail}</small></div>)}</div>
    <div className="local-banner"><Icon name="info" size={17} /><span><strong>Dữ liệu từ Supabase.</strong> Trang này đang đọc dữ liệu thực từ database. Chức năng thêm, sửa, xóa sẽ mở khi API ghi và phân quyền Admin sẵn sàng.</span><button className="secondary-action" onClick={reload}>Tải lại</button></div>
    <section className="catalog-panel" aria-label="Danh mục Master Data">
      <nav className="catalog-tabs" aria-label="Danh mục">{Object.entries(catalogs).map(([key, item]) => <NavLink key={key} to={`/dashboard/master-data/${key}`} className={key === catalogKey ? 'selected' : ''}>{item.title}<span>{data[key].length}</span></NavLink>)}</nav>
      <div className="catalog-heading"><div><h2>{catalog.title}</h2><p>{catalog.description}</p></div></div>
      <div className="catalog-toolbar"><div className="catalog-search"><Icon name="search" size={18} /><input aria-label={`Tìm ${catalog.singular}`} placeholder={`Tìm kiếm ${catalog.singular}…`} value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />{search && <button className="icon-button" aria-label="Xóa tìm kiếm" onClick={() => { setSearch(''); setPage(1) }}><Icon name="close" size={15} /></button>}</div>{(catalog.fields.some(field => field.key === 'isactive') || catalogKey === 'movies') && <select aria-label="Lọc trạng thái" value={status} onChange={event => { setStatus(event.target.value); setPage(1) }}><option value="all">Tất cả trạng thái</option>{catalogKey === 'movies' ? <><option value="1">Đang chiếu</option><option value="2">Sắp chiếu</option><option value="0">Ngừng chiếu</option></> : <><option value="true">Hoạt động</option><option value="false">Tạm ngưng</option></>}</select>}<span className="result-count">{rows.length} kết quả</span></div>
      <div className="table-scroll" tabIndex={0} role="region" aria-label={`Bảng ${catalog.title}, có thể cuộn ngang`}><table className="catalog-table"><thead><tr><th>Mã</th>{catalog.columns.map(column => <th key={column}>{columnLabels[column]}</th>)}</tr></thead><tbody>{visibleRows.map(row => <tr key={row[catalog.id]}><td><span className="record-code">{catalog.code}-{String(row[catalog.id]).padStart(3, '0')}</span></td>{catalog.columns.map(column => <td key={column}>{column === 'isactive' ? <span className={`status-badge ${row.isactive ? 'live' : 'paused'}`}><i />{row.isactive ? 'Hoạt động' : 'Tạm ngưng'}</span> : column === 'status' ? <span className={`status-badge ${row.status === 1 ? 'live' : 'paused'}`}>{({ 1: 'Đang chiếu', 2: 'Sắp chiếu', 0: 'Ngừng chiếu' })[row.status]}</span> : column === catalog.name ? <div className="record-name"><span className={`record-avatar ${catalogKey === 'movies' ? 'movie-avatar' : ''}`}><Icon name={catalogKey === 'movies' ? 'film' : catalogKey === 'theaters' ? 'pin' : 'layers'} size={18} /></span><strong>{displayValue(catalogKey, column, row, data)}</strong></div> : <span className="table-text">{displayValue(catalogKey, column, row, data)}</span>}</td>)}</tr>)}</tbody></table>{!rows.length && <div className="table-empty"><Icon name="search" size={28} /><h3>Chưa có kết quả phù hợp</h3><p>Thử đổi bộ lọc hoặc tải lại dữ liệu.</p><button className="secondary-action" onClick={() => { setSearch(''); setStatus('all'); setPage(1) }}>Bỏ bộ lọc</button></div>}</div>
      <div className="table-pagination"><span>{rows.length ? `${(currentPage - 1) * 8 + 1}–${Math.min(currentPage * 8, rows.length)}` : '0'} trên {rows.length} bản ghi</span><div><button aria-label="Trang trước" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button><span>{currentPage} / {pages}</span><button aria-label="Trang sau" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>›</button></div></div>
    </section>
    <p className="catalog-footnote"><Icon name="layers" size={14} />Dữ liệu danh mục là nền tảng cho lịch chiếu, đặt vé và vận hành rạp.</p>
  </>
}
