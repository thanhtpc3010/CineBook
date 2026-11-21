import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { modules } from '../../core/models/modules'
import { fetchMasterData } from '../../core/services/master-data.service'
import { groupMovies, vietnamDate } from '../../core/services/movie-schedule'
import MovieSlider from './components/movie-slider.component'
import MovieCard from './components/movie-card.component'
import MovieDetail from './components/movie-detail.component'
import './dashboard.css'

export default function DashboardContainer() {
  const { module } = useParams()
  const selected = modules.find(([key]) => key === module)
  if (selected && module !== 'overview') return <section className="module-placeholder"><span className="placeholder-icon"><Icon name={selected[2]} size={32} /></span><span className="section-eyebrow">CINEBOOK WORKSPACE</span><h1>{selected[1]}</h1><p>Module này sẽ được triển khai ở giai đoạn tiếp theo.<br />Bạn có thể quản lý dữ liệu nền tảng tại Master Data.</p><Link className="admin-primary" to="/dashboard/master-data/theaters">Mở Master Data<Icon name="arrow" size={17} /></Link></section>
  return <CinemaOverview />
}

function CinemaOverview() {
  const [catalog, setCatalog] = useState({ data: null, error: '', loading: true })
  const [today, setToday] = useState(vietnamDate)
  const [tab, setTab] = useState('current')
  const [selectedMovie, setSelectedMovie] = useState(null)
  useEffect(() => {
    let active = true
    fetchMasterData()
      .then(data => { if (active) setCatalog({ data, error: '', loading: false }) })
      .catch(error => { if (active) setCatalog({ data: null, error: error.message, loading: false }) })
    const clock = setInterval(() => setToday(vietnamDate()), 30000)
    return () => { active = false; clearInterval(clock) }
  }, [])
  if (catalog.loading) return <section className="admin-empty"><Icon name="film" size={30} /><h1>Đang tải danh mục phim</h1><p>Đang truy vấn dữ liệu từ Supabase.</p></section>
  if (!catalog.data) return <section className="admin-empty"><Icon name="info" size={30} /><h1>Chưa tải được danh mục phim</h1><p>{catalog.error}</p><button className="secondary-action" onClick={() => { setCatalog({ data: null, error: '', loading: true }); fetchMasterData().then(data => setCatalog({ data, error: '', loading: false })).catch(error => setCatalog({ data: null, error: error.message, loading: false })) }}>Thử lại</button></section>
  const { movies, genres } = catalog.data
  const grouped = groupMovies(movies, today)
  return <div className="cinema-overview">
    <div className="cinema-welcome"><div><span className="section-eyebrow">YOUR SEAT. YOUR STORY.</span><h2>Hẹn bạn trước màn ảnh rộng<span>.</span></h2></div><Link to="/dashboard/master-data/movies">Quản lý phim<Icon name="arrow" size={16} /></Link></div>
    <MovieSlider movies={grouped.featured} genres={genres} today={today} onSelect={setSelectedMovie} />
    <div className="cinema-marquee"><span>THE BIG SCREEN IS CALLING</span><i>✦</i><span>GREAT STORIES. BETTER TOGETHER.</span><i>✦</i><span>MAKE IT A MOVIE NIGHT</span><i>✦</i></div>
    <section className="movie-program" aria-labelledby="movie-program-title"><div className="program-heading"><div><span className="section-eyebrow">NOW & NEXT</span><h2 id="movie-program-title">Chọn câu chuyện của bạn<span>.</span></h2></div><div className="program-tabs" role="tablist" aria-label="Lịch phát hành"><button id="current-tab" role="tab" aria-selected={tab === 'current'} aria-controls="movie-panel" tabIndex={tab === 'current' ? 0 : -1} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { setTab('upcoming'); document.getElementById('upcoming-tab').focus() } }} onClick={() => setTab('current')}>Đang chiếu <span>{grouped.current.length}</span></button><button id="upcoming-tab" role="tab" aria-selected={tab === 'upcoming'} aria-controls="movie-panel" tabIndex={tab === 'upcoming' ? 0 : -1} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { setTab('current'); document.getElementById('current-tab').focus() } }} onClick={() => setTab('upcoming')}>Sắp chiếu <span>{grouped.upcoming.length}</span></button></div></div>
      <div id="movie-panel" role="tabpanel" aria-labelledby={`${tab}-tab`} className="movie-showcase-grid">{grouped[tab].map(movie => <MovieCard key={movie.movieid} movie={movie} upcoming={tab === 'upcoming'} genres={genres} onSelect={setSelectedMovie} />)}</div>
      {!grouped[tab].length && <div className="program-empty"><Icon name="film" size={30} /><h3>{tab === 'current' ? 'Chưa có phim đang chiếu' : 'Những câu chuyện mới đang được chuẩn bị'}</h3><p>Phim được tự động phân loại theo ngày khởi chiếu trong Master Data.</p><Link to="/dashboard/master-data/movies">Mở danh mục phim →</Link></div>}
    </section>
    <section className="experience-section" aria-labelledby="experience-title"><div className="experience-heading"><div><span className="section-eyebrow">MORE THAN A MOVIE</span><h2 id="experience-title">Nâng tầm từng khoảnh khắc<span>.</span></h2></div><p>Một bộ phim hay xứng đáng với<br />một không gian thật đặc biệt.</p></div><div className="experience-grid"><ExperienceCard type="gold" number="01" title="Gold Class" subtitle="YOUR PRIVATE SPOTLIGHT" description="Ghế ngả rộng, không gian riêng tư và cảm giác thư thái cho một buổi xem phim đặc biệt." detail="Concept phòng cao cấp: ghế ngả cá nhân, khoảng cách hàng rộng và bàn đặt đồ ăn riêng. Chưa có lịch chiếu hoặc dịch vụ thực tế trong bản demo." /><ExperienceCard type="bed" number="02" title="Bed Cinema" subtitle="LAY BACK. DREAM BIG." description="Thả mình trên giường nằm êm ái. Để màn ảnh rộng đưa bạn vào một thế giới khác." detail="Concept phòng giường nằm: vị trí đôi, đệm êm và không gian thư giãn. Quy tắc sức chứa, giá và giữ chỗ sẽ được thiết kế khi làm luồng đặt vé." /><ExperienceCard type="classic" number="03" title="Classic Cinema" subtitle="THE ORIGINAL MOVIE NIGHT" description="Màn ảnh lớn, những hàng ghế quen thuộc và trải nghiệm điện ảnh luôn đầy cảm xúc." detail="Concept phòng tiêu chuẩn với ghế theo hàng và hạng ghế. Có thể chọn loại phòng trong Master Data → Phòng chiếu; đây là dữ liệu UI local, chưa có trên schema Supabase." /></div></section>
    <div className="overview-editor-note"><Icon name="info" size={16} /><span>Dữ liệu minh họa từ Master Data local · Phân loại phim theo ngày tại Việt Nam · Trải nghiệm phòng chiếu là concept giao diện.</span><Link to="/dashboard/master-data/movies">Chỉnh sửa phim ↗</Link></div>
    {selectedMovie && <MovieDetail movie={selectedMovie} genres={genres} today={today} onClose={() => setSelectedMovie(null)} />}
  </div>
}

function ExperienceCard({ type, number, title, subtitle, description, detail }) {
  const [expanded, setExpanded] = useState(false)
  return <article className={`experience-card ${type}`}><div className="experience-art" aria-hidden="true"><span className="experience-number">{number} / EXPERIENCE</span><div className="room-light" /><svg viewBox="0 0 300 160" fill="none">{type === 'bed' ? <><path d="m30 96 122-32 120 28-123 42z" fill="#a05941" /><path d="m30 96 119 38v21L30 117z" fill="#71382b" /><path d="m149 134 123-42v22l-123 41z" fill="#472b24" /><path d="m62 86 42-12 32 9-43 13z m49-13 40-11 34 8-42 13z" fill="#ebc39b" /><path d="M30 95V53l41-10v41m201 9V49l-74-18-44 12v20" fill="#663326" stroke="#a05b41" strokeWidth="3" /></> : <><path d="m79 92 15-64q2-12 17-10l53 12q13 2 11 17l-8 62z" fill={type === 'gold' ? '#9a6a36' : '#923f35'} /><path d="m79 92 88 17 54-12 13 17-64 25-100-20z" fill={type === 'gold' ? '#c39b60' : '#b85846'} /><path d="m70 119 100 20v13L68 132z m100 20 64-25v14l-64 24z" fill="#38281e" /><path d="m65 81 21-4 10 30-22 6z m100 20 24-8 13 18-27 10z" fill={type === 'gold' ? '#e3bf82' : '#ca7760'} /><path d="m95 138-17 13m125-17 24 12" stroke="#46372c" strokeWidth="6" /></>}</svg><span className="experience-wordmark">{title.toUpperCase()}</span></div><div className="experience-copy"><span>{subtitle}</span><h3>{title}</h3><p>{description}</p><button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={`experience-${type}`}>{expanded ? 'Thu gọn' : 'Khám phá không gian'}<Icon name="arrow" size={16} /></button>{expanded && <div className="experience-expanded" id={`experience-${type}`}><p>{detail}</p><Link to="/dashboard/master-data/screens">Quản lý phòng chiếu ↗</Link></div>}</div></article>
}
