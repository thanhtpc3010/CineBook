import { useEffect, useState } from 'react'
import { movieArtwork, movieStatus, releaseLabel } from '../../../core/services/movie-schedule'
import Icon from '../../../components/Icon'

export default function MovieSlider({ movies, genres, today, onSelect }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const currentIndex = index % Math.max(1, movies.length)
  useEffect(() => {
    const listener = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', listener)
    return () => document.removeEventListener('visibilitychange', listener)
  }, [])
  useEffect(() => {
    if (paused || hovered || focused || hidden || movies.length < 2) return
    const timer = setTimeout(() => setIndex((currentIndex + 1) % movies.length), 10000)
    return () => clearTimeout(timer)
  }, [currentIndex, movies.length, paused, hovered, focused, hidden])
  if (!movies.length) return <section className="cinema-hero hero-empty"><span className="section-eyebrow">CINEBOOK PRESENTS</span><h1>Màn ảnh đang chờ<br />câu chuyện tiếp theo.</h1><p>Thêm phim và ngày khởi chiếu trong Master Data để bắt đầu.</p></section>
  const movie = movies[currentIndex]
  const upcoming = movieStatus(movie, today) === 2
  const move = delta => setIndex((currentIndex + delta + movies.length) % movies.length)
  return <section className="cinema-hero" aria-roledescription="carousel" aria-label="Phim nổi bật" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <img className="hero-art" key={movie.movieid} src={movieArtwork(movie)} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/art/orbit.svg' }} alt="" />
    <div className="hero-shade" />
    <div className="hero-copy" key={`copy-${movie.movieid}`}>
      <span className="hero-kicker"><span />CINEBOOK PRESENTS <i> / </i> THE NEXT FRAME</span>
      <span className={`hero-status ${upcoming ? 'upcoming' : ''}`}>{upcoming ? 'SẮP KHỞI CHIẾU' : 'ĐANG CHIẾU TẠI RẠP'}</span>
      <h1>{movie.title}</h1>
      <div className="hero-meta"><span>{movie.durationminutes} phút</span><b>·</b><span>{movie.language}</span><b>·</b><span>{movie.genreids?.map(id => genres.find(genre => genre.genreid === id)?.genrename).filter(Boolean).slice(0, 2).join(' / ') || 'Điện ảnh'}</span></div>
      <p>{movie.synopsis || 'Một câu chuyện mới. Một trải nghiệm đáng nhớ. Hẹn gặp bạn trước màn ảnh rộng.'}</p>
      <div className="hero-cta"><button className="cinema-red-button" onClick={() => onSelect(movie)}>Khám phá bộ phim<Icon name="arrow" size={17} /></button><span>KHỞI CHIẾU<strong>{releaseLabel(movie.releasedate)}</strong></span></div>
    </div>
    <div className="slider-footer"><div className="slider-pagination"><span className="slide-number">{String(currentIndex + 1).padStart(2, '0')}</span><div className="slide-dots">{movies.map((item, i) => <button key={item.movieid} className={i === currentIndex ? 'selected' : ''} aria-label={`Xem phim ${item.title}`} aria-current={i === currentIndex ? 'true' : undefined} onClick={() => setIndex(i)} />)}</div><span className="slide-total">/ {String(movies.length).padStart(2, '0')}</span></div><div className="slider-controls"><span className="slide-interval">10 GIÂY / PHIM</span><button aria-label={paused ? 'Bật tự chuyển phim' : 'Tạm dừng tự chuyển'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button><button disabled={movies.length < 2} aria-label="Phim trước" onClick={() => move(-1)}>←</button><button disabled={movies.length < 2} aria-label="Phim tiếp theo" onClick={() => move(1)}>→</button></div></div>
  </section>
}
