import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // React Compiler พึ่ง Babel ทำให้ dev คอมไพล์ช้า → เปิดเฉพาะตอน build production
  // (เว็บจริงยังได้ auto-memoization ครบ แต่ตอน dev จะเร็วขึ้นชัดเจน)
  reactCompiler: isProd,
  // ระบุ root ให้ชัด เพราะมี lockfile อื่นอยู่นอกโปรเจกต์ (yarn.lock ใน home)
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // แคช artifacts ของ Turbopack ลงดิสก์ → รีสตาร์ท dev แล้วคอมไพล์เร็วขึ้น (beta)
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
