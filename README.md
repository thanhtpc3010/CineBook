# CineBook

Repository này chỉ lưu source code của hai ứng dụng:

- `CineBookApp`: React + Vite frontend.
- `CineBookService`: Laravel API kết nối PostgreSQL/Supabase.

Không đẩy lên GitHub các package đã cài, thông tin bí mật, PHP runtime local, script seed local, dữ liệu thử và tài liệu nội bộ. Những mục này được loại trừ bằng `.gitignore` ở thư mục gốc và `.gitignore` riêng của từng ứng dụng.

## Yêu cầu cài đặt

- Git.
- Node.js 20 trở lên và npm.
- PHP 8.3 trở lên, bật các extension `pdo_pgsql`, `pgsql`, `mbstring`, `openssl`.
- Composer 2.
- Thông tin kết nối database Supabase của nhóm (xin từ người quản lý dự án, không chia sẻ qua GitHub).

## Clone và cài package

```powershell
git clone https://github.com/<organization-or-user>/cinebook.git
cd cinebook

npm ci --prefix CineBookApp
composer install --working-dir=CineBookService
```

`node_modules` và `vendor` không được commit. Hai lệnh trên sẽ cài lại đúng dependency theo các lock file đã được theo dõi.

## Cấu hình backend

Tạo file môi trường local từ mẫu:

```powershell
Copy-Item CineBookService/.env.example CineBookService/.env
```

Mở `CineBookService/.env` và điền thông tin Supabase do nhóm cung cấp:

```dotenv
APP_NAME=CineBook
APP_ENV=local
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=<supabase-pooler-host>
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=<database-user>
DB_PASSWORD=<database-password>
DB_SSLMODE=require
```

Tạo application key:

```powershell
Set-Location CineBookService
php artisan key:generate
Set-Location ..
```

Không commit `CineBookService/.env`. Không chạy `php artisan migrate`, `db:seed` hoặc seed script lên database Supabase dùng chung khi chưa được nhóm thống nhất; database hiện tại đã được khởi tạo riêng.

## Chạy ứng dụng

Mở hai PowerShell riêng ở thư mục gốc repository.

Terminal 1 — Laravel API:

```powershell
Set-Location CineBookService
php artisan serve --host=127.0.0.1 --port=8000
```

Terminal 2 — React frontend:

```powershell
Set-Location CineBookApp
npm run dev -- --host 127.0.0.1
```

Mở `http://127.0.0.1:5173`. Vite sẽ chuyển tiếp các request `/api` đến Laravel tại cổng `8000`.

## Kiểm tra trước khi push

```powershell
Set-Location CineBookApp
npm run lint
npm run build
node --test src/core/services/master-data.service.test.js

Set-Location ..\CineBookService
php artisan route:list --path=api
```

Sau đó, ở thư mục gốc:

```powershell
Set-Location ..
git status
```

`git status` chỉ nên liệt kê `CineBookApp`, `CineBookService`, `README.md` và `.gitignore`; tuyệt đối không được có `.env`, `node_modules`, `vendor`, `.local-runtime`, `.local-db-tools`, `docs` hoặc `skills`.
