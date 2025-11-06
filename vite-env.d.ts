/// <reference types="vite/client" />

// 🔹 Khai báo chi tiết các biến môi trường mà bạn dùng trong Vite
interface ImportMetaEnv {
  readonly VITE_GEOSERVER_BASE_URL_PROD: string;
  readonly VITE_GEOSERVER_BASE_URL_DEV: string;
  readonly VITE_API_BASE_URL_PROD: string; // (tuỳ chọn thêm nếu sau này bạn có API backend)
  readonly VITE_API_BASE_URL_DEV: string; // (tuỳ chọn thêm nếu sau này bạn có API backend)
}

// 🔹 Khai báo để TypeScript hiểu import.meta.env
interface ImportMeta {
  readonly env: ImportMetaEnv;
}