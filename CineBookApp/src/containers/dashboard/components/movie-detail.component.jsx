import { useEffect, useRef } from 'react'
import { movieArtwork, movieStatus, releaseLabel } from '../../../core/services/movie-schedule'
import Icon from '../../../components/Icon'

export default function MovieDetail({ movie, genres, today, onClose }) {
  const dialog = useRef(null)
  useEffect(() => { const node = dialog.current; node.showModal(); return () => node.close() }, [])
  const trailer = /^https?:\/\//i.test(movie.trailerurl || '') ? movie.trailerurl : null
  return <dialog ref={dialog} className="movie-detail-dialog" aria-labelledby="movie-detail-title" onCancel={onClose}><button className="movie-detail-close" aria-label="Đóng chi tiết phim" onClick={onClose}><Icon name="close" /></button><img className="detail-art" src={movieArtwork(movie)} alt="" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/art/orbit.svg' }} /><div className="detail-body"><span className="section-eyebrow">{movieStatus(movie, today) === 2 ? 'SẮP CHIẾU' : 'ĐANG CHIẾU'}</span><h2 id="movie-detail-title">{movie.title}</h2><p>{movie.synopsis || 'Thông tin nội dung phim đang được cập nhật.'}</p><dl><div><dt>Khởi chiếu</dt><dd>{releaseLabel(movie.releasedate)}</dd></div><div><dt>Thời lượng</dt><dd>{movie.durationminutes} phút</dd></div><div><dt>Ngôn ngữ</dt><dd>{movie.language}</dd></div><div><dt>Thể loại</dt><dd>{movie.genreids?.map(id => genres.find(genre => genre.genreid === id)?.genrename).filter(Boolean).join(', ') || 'Đang cập nhật'}</dd></div>{movie.director && <div><dt>Đạo diễn</dt><dd>{movie.director}</dd></div>}{movie.castcrew && <div><dt>Diễn viên</dt><dd>{movie.castcrew}</dd></div>}</dl>{trailer && <a className="cinema-red-button" href={trailer} target="_blank" rel="noopener noreferrer">Xem trailer ↗</a>}<p className="detail-preview-note">Bản xem trước giao diện. Tính năng chọn suất và đặt vé sẽ được bổ sung sau.</p></div></dialog>
}
