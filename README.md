# Meeting Assistant (Frontend)

Hướng dẫn nhanh để khởi chạy, cài đặt thư viện cần thiết và bắt đầu triển khai dự án frontend (Vite + React + TypeScript + Tailwind).

**Môi trường**: Windows (PowerShell / CMD) hoặc macOS (zsh).

## Yêu cầu trước
- Node.js (>=18) và npm (>=9) hoặc pnpm/yarn
- Git

Kiểm tra phiên bản (Windows PowerShell / CMD hoặc macOS terminal):

Windows (PowerShell / CMD):

```powershell
node -v
npm -v
```

macOS (zsh / bash):

```bash
node -v
npm -v
```

Ghi chú cài Node trên Windows:
- Dùng installer chính thức từ https://nodejs.org hoặc sử dụng `nvm-windows` (nên cho nhiều phiên bản): https://github.com/coreybutler/nvm-windows
- Hoặc dùng WSL2 (Windows Subsystem for Linux) và cài Node giống Linux/macOS nếu bạn muốn môi trường gần Linux.

## 1. Clone repository

```bash
git clone <repository-url>
cd meeting-assistant-FE
```

## 2. Cài đặt dependencies

Mặc định project đã có `package.json`. Chạy:

```bash
npm install
```

Nếu bạn muốn cài thêm (theo `doc/initProject.md`), ví dụ:

```bash
# runtime
npm install react-router-dom @reduxjs/toolkit react-redux axios react-hook-form zod @hookform/resolvers lucide-react clsx tailwind-merge date-fns lodash-es

# dev tools
npm install -D vite @vitejs/plugin-react typescript tailwindcss postcss autoprefixer eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

> Mình đã cài hầu hết dependency cơ bản trong repo này để bạn có thể chạy dev server ngay.

## 3. Cấu hình môi trường

Copy file mẫu `.env.example` thành `.env` và chỉnh các biến theo môi trường của bạn:

```bash
cp .env.example .env
# rồi sửa .env nếu cần
```

Các biến quan trọng:
- `VITE_API_URL` — URL backend
- `VITE_APP_NAME` — tên app

## 4. Cấu hình Tailwind

Tailwind đã được cấu hình sẵn (`tailwind.config.js`, `postcss.config.cjs`) và `src/index.css` đã import Tailwind. Nếu bạn muốn khởi tạo lại:

```bash
npx tailwindcss init -p
```

## 5. Scripts hữu dụng

- `npm run dev` — chạy dev server (Vite)
- `npm run build` — build production
- `npm run preview` — preview build cục bộ
- `npm run lint` — chạy ESLint

Ví dụ chạy dev:

```bash
npm run dev
# truy cập http://localhost:5173
```

## 6. Cấu trúc dự án (tóm tắt)

- `src/` — mã nguồn chính
  - `assets/` — tài nguyên (images, fonts)
  - `components/` — component UI (common, features)
  - `hooks/` — custom hooks
  - `layout/` — Header/Footer/MainLayout
  - `pages/` — Route pages (Home, Login, Dashboard...)
  - `routes/` — cấu hình React Router
  - `services/` — API wrappers (axios instance, auth, user)
  - `store/` — Redux slices / store
  - `types/` — TypeScript types
  - `utils/` — helper (env, cn, config)

Mình đã scaffold sẵn nhiều file/stub để bạn bắt đầu (như `src/App.tsx`, `src/main.tsx`, `src/routes`, `src/services`).

## 7. Bắt đầu implement (gợi ý bước tiếp theo)

1. Thiết lập Router & layout
   - Mở `src/routes/index.tsx` và thêm routes/private/public.
   - Tạo `Header`, `Footer` trong `src/layout/` và bọc `App` bằng layout phù hợp.

2. State management
   - Nếu dùng Redux: implement slices trong `src/store/slices/`, kết nối `Provider` trong `src/main.tsx`.
   - Nếu dùng Zustand: tạo stores trong `src/store/`.

3. API services
   - Sử dụng `src/services/apiClient.ts` (axios instance) để thêm interceptor (auth token, refresh token).
   - Implement `authService` và `userService` (login, logout, getProfile).

4. Forms & validation
   - Dùng `react-hook-form` + `zod` cho schema validation.

5. UI components
   - Tạo `src/components/common/Button.tsx`, `Input.tsx`, `Modal.tsx`... tái sử dụng.

## 8. Linting & formatting

ESLint đã được thêm (`.eslintrc.cjs`). Bạn có thể chạy:

```bash
npm run lint
```

Thêm `prettier` nếu muốn định dạng code tự động.

## 10. Deployment

### Docker

Build the Docker image:

```bash
docker build -t meeting-assistant .
```

Run the container:

```bash
docker run -d -p 80:80 meeting-assistant
```

### CI/CD with GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys on pushes to `main` or `feature/*` branches.

#### Setup Secrets in GitHub Repository

Add the following secrets in your GitHub repo settings:

- `SSH_HOST`: Your production server IP or hostname
- `SSH_USER`: SSH username
- `SSH_PRIVATE_KEY`: Private SSH key for authentication
- `SSH_PORT`: SSH port (optional, defaults to 22)

#### Production Server Requirements

- Nginx installed and configured to serve `/var/www/html`
- SSH access with the key
- rsync installed for file transfer

The workflow will build the app, then use SSH to rsync `dist/` to the server and restart nginx.