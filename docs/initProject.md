# 🚀 Khởi tạo dự án React 19 + Tailwind v4 + TypeScript

## Bước 1: Tạo project với Vite

```bash
# Tạo project mới
npm create vite@latest my-react-app-project-2025 -- --template react-ts

# Di chuyển vào thư mục
cd my-react-app-project-2025

# Cài đặt dependencies
npm install
```

## Bước 2: Cài đặt Tailwind CSS v4

```bash
# Cài Tailwind v4 (beta)
npm install tailwindcss@next @tailwindcss/vite@next

# Hoặc nếu dùng stable version
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Bước 3: Cấu hình Tailwind

**`vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

**`tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**`src/index.css`**
```css
@import "tailwindcss";
```

## Bước 4: Cài đặt các dependencies cần thiết

```bash
# Routing
npm install react-router-dom

# State Management (chọn 1)
npm install @reduxjs/toolkit react-redux
# hoặc
npm install zustand

# HTTP Client
npm install axios

# Form & Validation
npm install react-hook-form zod @hookform/resolvers

# UI Components (optional)
npm install lucide-react
npm install clsx tailwind-merge

# Utilities
npm install date-fns
npm install lodash-es
npm install @types/lodash-es -D
```

## Bước 5: Tạo cấu trúc thư mục

```bash
# Tạo các thư mục chính
mkdir -p src/{assets,components/{common,features},hooks,layout,pages,routes,store/slices,services,types,utils}

# Tạo các file config
touch src/utils/{env.ts,config.ts,theme.ts}
touch src/services/{apiClient.ts,authService.ts,userService.ts}
touch src/store/{index.ts,slices/authSlice.ts}
touch src/types/{user.ts,auth.ts}
touch src/routes/{index.tsx,privateRoutes.tsx,publicRoutes.tsx}
```

## Bước 6: Cấu hình TypeScript

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Bước 7: Tạo file .env

**`.env`**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=My React App
VITE_OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
VITE_OAUTH_GITHUB_CLIENT_ID=your_github_client_id
```

## Bước 8: Cấu hình ESLint (optional nhưng nên có)

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

**`.eslintrc.cjs`**
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

## Bước 9: Cập nhật package.json scripts

**`package.json`**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

## Bước 10: Tạo file utility cơ bản

**`src/utils/env.ts`**
```typescript
export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
  oauth: {
    googleClientId: import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID,
    githubClientId: import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID,
  }
} as const
```

**`src/utils/cn.ts`** (utility cho className)
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Bước 11: Chạy development server

```bash
npm run dev
```

## 📦 Cấu trúc thư mục sau khi hoàn thành (có mô tả chi tiết)

```
my-react-app-project-2025/
├── node_modules/                    # Dependencies được cài từ npm
│
├── public/                          # Tệp tĩnh, không qua build process
│   ├── vite.svg                     # Logo, favicon
│   ├── favicon.ico                  # Icon hiển thị trên tab browser
│   └── robots.txt                   # SEO: hướng dẫn cho search engine
│
├── src/                             # Source code chính của ứng dụng
│   │
│   ├── assets/                      # Tài nguyên tĩnh (images, fonts, icons)
│   │   ├── images/                  # Ảnh: logo, banner, illustrations
│   │   ├── icons/                   # Icon SVG tùy chỉnh
│   │   ├── fonts/                   # Custom fonts
│   │   └── styles/                  # Global CSS/SCSS nếu cần
│   │
│   ├── components/                  # React components
│   │   ├── common/                  # Components dùng chung toàn app
│   │   │   ├── Button.tsx           # Nút bấm
│   │   │   ├── Input.tsx            # Input field
│   │   │   ├── Card.tsx             # Card container
│   │   │   ├── Modal.tsx            # Dialog/Modal
│   │   │   ├── Table.tsx            # Bảng dữ liệu
│   │   │   ├── Loading.tsx          # Spinner/Loading state
│   │   │   └── Dropdown.tsx         # Menu dropdown
│   │   │
│   │   └── features/                # Components theo từng feature cụ thể
│   │       ├── auth/                # Authentication components
│   │       │   ├── LoginForm.tsx    # Form đăng nhập
│   │       │   ├── RegisterForm.tsx # Form đăng ký
│   │       │   └── OAuthButtons.tsx # Nút đăng nhập OAuth
│   │       ├── dashboard/           # Dashboard components
│   │       │   ├── StatCard.tsx     # Thẻ thống kê
│   │       │   └── Chart.tsx        # Biểu đồ
│   │       └── profile/             # Profile components
│   │           ├── ProfileCard.tsx  # Thẻ thông tin user
│   │           └── EditProfile.tsx  # Form sửa profile
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useAuth.ts               # Hook quản lý authentication
│   │   ├── useFetch.ts              # Hook gọi API
│   │   ├── useDebounce.ts           # Hook debounce input
│   │   ├── useLocalStorage.ts       # Hook làm việc với localStorage
│   │   ├── useToggle.ts             # Hook toggle boolean state
│   │   └── useForm.ts               # Hook quản lý form state
│   │
│   ├── layout/                      # Layout components (bố cục trang)
│   │   ├── MainLayout.tsx           # Layout chính (có Header, Sidebar)
│   │   ├── AuthLayout.tsx           # Layout cho trang login/register
│   │   ├── Header.tsx               # Header/Navbar
│   │   ├── Sidebar.tsx              # Sidebar navigation
│   │   ├── Footer.tsx               # Footer
│   │   └── Breadcrumb.tsx           # Breadcrumb navigation
│   │
│   ├── pages/                       # Các trang chính (Route pages)
│   │   ├── Home.tsx                 # Trang chủ
│   │   ├── Login.tsx                # Trang đăng nhập
│   │   ├── Register.tsx             # Trang đăng ký
│   │   ├── Dashboard.tsx            # Trang dashboard
│   │   ├── Profile.tsx              # Trang profile user
│   │   ├── Settings.tsx             # Trang cài đặt
│   │   └── NotFound.tsx             # Trang 404
│   │
│   ├── routes/                      # Cấu hình routing
│   │   ├── index.tsx                # Main router setup với React Router
│   │   ├── privateRoutes.tsx        # Routes cần đăng nhập (Protected)
│   │   ├── publicRoutes.tsx         # Routes công khai (không cần login)
│   │   └── ProtectedRoute.tsx       # Component bảo vệ route
│   │
│   ├── services/                    # API service layer (gọi backend)
│   │   ├── apiClient.ts             # Axios instance, interceptors
│   │   ├── authService.ts           # API: login, register, logout, refresh
│   │   ├── userService.ts           # API: get/update user profile
│   │   ├── oauthService.ts          # API: OAuth2 authentication
│   │   └── uploadService.ts         # API: upload files
│   │
│   ├── store/                       # State Management (Redux/Zustand)
│   │   ├── slices/                  # Redux slices hoặc Zustand stores
│   │   │   ├── authSlice.ts         # State: user, token, isAuthenticated
│   │   │   ├── userSlice.ts         # State: user profile data
│   │   │   ├── uiSlice.ts           # State: theme, sidebar open/close
│   │   │   └── notificationSlice.ts # State: thông báo toast/alert
│   │   └── index.ts                 # Configure và export store
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── auth.ts                  # Types: LoginRequest, AuthResponse
│   │   ├── user.ts                  # Types: User, UserProfile
│   │   ├── api.ts                   # Types: ApiResponse, ApiError
│   │   └── index.ts                 # Export tất cả types
│   │
│   ├── utils/                       # Utility functions & helpers
│   │   ├── cn.ts                    # Merge className (clsx + tailwind)
│   │   ├── config.ts                # App configuration constants
│   │   ├── env.ts                   # Environment variables helper
│   │   ├── theme.ts                 # Theme colors, breakpoints
│   │   ├── format.ts                # Format: date, currency, phone
│   │   ├── validation.ts            # Validation rules (Zod schemas)
│   │   └── localStorage.ts          # LocalStorage helper functions
│   │
│   ├── App.tsx                      # Root component, setup Router
│   ├── main.tsx                     # Entry point, render App
│   ├── index.css                    # Global CSS, Tailwind imports
│   └── vite-env.d.ts                # Vite environment types
│
├── .env                             # Environment variables (local)
├── .env.example                     # Template cho .env
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore                       # Git ignore rules
├── index.html                       # HTML template
├── package.json                     # Dependencies và scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # TypeScript config cho Vite
├── vite.config.ts                   # Vite bundler configuration
└── README.md                        # Tài liệu dự án
```

---

## 📋 Giải thích vai trò từng thư mục

### **🎨 assets/**
Chứa tất cả tài nguyên tĩnh như hình ảnh, icon, font. Các file này sẽ được import vào components và được xử lý bởi Vite bundler.

### **🧩 components/**
- **common/**: Components UI tái sử dụng nhiều nơi (Button, Input, Card...)
- **features/**: Components đặc thù cho từng tính năng (LoginForm, DashboardChart...)

### **🪝 hooks/**
Custom hooks để tái sử dụng logic: authentication, API calls, form handling, localStorage...

### **📐 layout/**
Components định nghĩa bố cục trang: Header, Sidebar, Footer. Giúp tái sử dụng layout giữa các pages.

### **📄 pages/**
Mỗi file = 1 trang route. Ví dụ: `/dashboard` → `Dashboard.tsx`

### **🛣️ routes/**
Cấu hình React Router, phân chia routes public/private, tạo Protected Route component.

### **🌐 services/**
Layer trung gian gọi API backend. Tách biệt logic API khỏi components, dễ test và maintain.

### **💾 store/**
Quản lý global state với Redux Toolkit hoặc Zustand. Mỗi slice quản lý 1 phần state (auth, user, UI...).

### **📝 types/**
Định nghĩa TypeScript types/interfaces cho toàn bộ app. Tăng type safety và IntelliSense.

### **🛠️ utils/**
Functions tiện ích: format date, validate, localStorage helpers, theme config...

## ✅ Checklist

- [ ] Tạo project với Vite + React + TypeScript
- [ ] Cài đặt Tailwind CSS v4
- [ ] Cài đặt React Router, State Management
- [ ] Cài đặt Axios, React Hook Form, Zod
- [ ] Tạo cấu trúc thư mục đầy đủ
- [ ] Cấu hình TypeScript paths
- [ ] Tạo file .env
- [ ] Cấu hình ESLint
- [ ] Tạo utility functions cơ bản
- [ ] Test chạy `npm run dev`

---

**🎉 Dự án đã sẵn sàng để phát triển!**
