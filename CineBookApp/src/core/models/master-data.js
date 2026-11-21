const text = (key, label, extra = {}) => ({ key, label, type: 'text', required: true, ...extra })
const number = (key, label, extra = {}) => text(key, label, { type: 'number', min: 0, ...extra })
const relation = (key, label, source) => text(key, label, { type: 'relation', source })
const active = { key: 'isactive', label: 'Đang hoạt động', type: 'checkbox' }

export const catalogs = {
  theaters: { title: 'Rạp chiếu', singular: 'rạp chiếu', code: 'RAP', id: 'theaterid', name: 'theatername', description: 'Quản lý hệ thống rạp chiếu và thông tin địa điểm.', fields: [text('theatername', 'Tên rạp', { maxLength: 150 }), relation('cityid', 'Thành phố', 'cities'), text('address', 'Địa chỉ', { type: 'textarea' }), active], columns: ['theatername', 'cityid', 'address', 'totalscreens', 'isactive'] },
  cities: { title: 'Thành phố', singular: 'thành phố', code: 'TP', id: 'cityid', name: 'cityname', description: 'Danh mục thành phố có rạp chiếu phim.', fields: [text('cityname', 'Tên thành phố', { maxLength: 100 }), active], columns: ['cityname', 'isactive'] },
  screens: { title: 'Phòng chiếu', singular: 'phòng chiếu', code: 'PH', id: 'screenid', name: 'screenname', description: 'Tổ chức phòng chiếu theo từng rạp. Số ghế được tính từ danh mục ghế.', fields: [text('screenname', 'Tên phòng', { maxLength: 50 }), relation('theaterid', 'Rạp chiếu', 'theaters'), { key: 'experience', label: 'Loại phòng (demo)', type: 'select', options: [['standard', 'Classic Cinema'], ['gold', 'Gold Class'], ['bed', 'Bed Cinema']], required: true }], columns: ['screenname', 'theaterid', 'experience', 'totalseats'] },
  seatcategories: { title: 'Hạng ghế', singular: 'hạng ghế', code: 'HG', id: 'categoryid', name: 'categoryname', description: 'Thiết lập hạng ghế và hệ số tính giá vé.', fields: [text('categoryname', 'Tên hạng ghế', { maxLength: 50 }), number('basepricemultiplier', 'Hệ số giá vé', { min: 0.01, max: 9.99, step: 0.01 })], columns: ['categoryname', 'basepricemultiplier'] },
  seats: { title: 'Ghế ngồi', singular: 'ghế', code: 'GHE', id: 'seatid', name: 'rowname', description: 'Quản lý từng vị trí ghế trong phòng chiếu.', fields: [relation('screenid', 'Phòng chiếu', 'screens'), relation('categoryid', 'Hạng ghế', 'seatcategories'), text('rowname', 'Hàng ghế', { maxLength: 5 }), number('seatnumber', 'Số ghế', { min: 1, step: 1 })], columns: ['rowname', 'seatnumber', 'screenid', 'categoryid'] },
  movies: { title: 'Phim', singular: 'phim', code: 'PHIM', id: 'movieid', name: 'title', description: 'Quản lý thông tin phim, trạng thái phát hành và thể loại.', fields: [text('title', 'Tên phim', { maxLength: 200 }), text('synopsis', 'Tóm tắt', { type: 'textarea', required: false }), number('durationminutes', 'Thời lượng (phút)', { min: 1, step: 1 }), text('releasedate', 'Ngày khởi chiếu', { type: 'date' }), text('language', 'Ngôn ngữ', { maxLength: 50 }), text('director', 'Đạo diễn', { required: false, maxLength: 150 }), text('castcrew', 'Diễn viên', { required: false }), text('posterurl', 'URL poster', { type: 'url', required: false }), text('trailerurl', 'URL trailer', { type: 'url', required: false }), { key: 'genreids', label: 'Thể loại', type: 'multi', source: 'genres' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [[1, 'Đang chiếu'], [2, 'Sắp chiếu'], [0, 'Ngừng chiếu']], required: true }], columns: ['title', 'genreids', 'durationminutes', 'releasedate', 'status'] },
  genres: { title: 'Thể loại', singular: 'thể loại', code: 'TL', id: 'genreid', name: 'genrename', description: 'Danh mục thể loại dùng để phân loại phim.', fields: [text('genrename', 'Tên thể loại', { maxLength: 100 }), text('description', 'Mô tả', { type: 'textarea', required: false })], columns: ['genrename', 'description'] },
}

export const columnLabels = { totalscreens: 'Phòng chiếu', totalseats: 'Số ghế', genreids: 'Thể loại', ...Object.fromEntries(Object.values(catalogs).flatMap(c => c.fields.map(f => [f.key, f.label]))) }

// Dữ liệu minh họa local, không phản ánh database Supabase.
export const initialMasterData = {
  cities: [{ cityid: 1, cityname: 'TP. Hồ Chí Minh', isactive: true }, { cityid: 2, cityname: 'Hà Nội', isactive: true }, { cityid: 3, cityname: 'Đà Nẵng', isactive: true }],
  theaters: [
    { theaterid: 1, cityid: 1, theatername: 'CineBook Landmark', address: '720A Điện Biên Phủ, Bình Thạnh', isactive: true },
    { theaterid: 2, cityid: 1, theatername: 'CineBook Thảo Điền', address: '161 Xa lộ Hà Nội, Thủ Đức', isactive: true },
    { theaterid: 3, cityid: 2, theatername: 'CineBook Tràng Tiền', address: '24 Hai Bà Trưng, Hoàn Kiếm', isactive: true },
    { theaterid: 4, cityid: 3, theatername: 'CineBook Sông Hàn', address: '910A Ngô Quyền, Sơn Trà', isactive: false },
  ],
  screens: [{ screenid: 1, theaterid: 1, screenname: 'Phòng 01' }, { screenid: 2, theaterid: 1, screenname: 'Phòng 02' }, { screenid: 3, theaterid: 2, screenname: 'Phòng 01' }, { screenid: 4, theaterid: 3, screenname: 'Phòng 01' }],
  seatcategories: [{ categoryid: 1, categoryname: 'Standard', basepricemultiplier: 1 }, { categoryid: 2, categoryname: 'VIP', basepricemultiplier: 1.5 }, { categoryid: 3, categoryname: 'Double', basepricemultiplier: 2 }],
  seats: Array.from({ length: 12 }, (_, i) => ({ seatid: i + 1, screenid: Math.floor(i / 3) + 1, categoryid: i % 3 === 2 ? 2 : 1, rowname: 'A', seatnumber: i % 3 + 1 })),
  genres: [{ genreid: 1, genrename: 'Hành động', description: 'Nhịp phim nhanh và những cuộc phiêu lưu.' }, { genreid: 2, genrename: 'Tâm lý', description: 'Những câu chuyện về con người và cảm xúc.' }, { genreid: 3, genrename: 'Hoạt hình', description: 'Thế giới sáng tạo dành cho mọi lứa tuổi.' }, { genreid: 4, genrename: 'Khoa học viễn tưởng', description: 'Khám phá những thế giới ngoài trí tưởng tượng.' }],
  movies: [{ movieid: 1, title: 'Hành trình giữa các vì sao', synopsis: 'Một chuyến phiêu lưu vượt ra ngoài giới hạn.', durationminutes: 128, releasedate: '2026-11-06', language: 'Tiếng Anh', director: '', castcrew: '', posterurl: '', trailerurl: '', genreids: [1, 4], status: 1 }, { movieid: 2, title: 'Mùa hè của chúng ta', synopsis: '', durationminutes: 105, releasedate: '2026-11-20', language: 'Tiếng Việt', director: '', castcrew: '', posterurl: '', trailerurl: '', genreids: [2], status: 2 }],
}

