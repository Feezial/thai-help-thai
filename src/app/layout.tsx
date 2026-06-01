import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "คำนวณ ไทยช่วยไทย พลัส 60/40 — รัฐช่วย 60% จ่ายเอง 40%",
  description:
    "เครื่องคำนวณโครงการไทยช่วยไทย พลัส 60/40: ใส่ยอดซื้อ รู้ทันทีว่าจ่ายเองเท่าไร รัฐช่วยเท่าไร และเหลือสิทธิ์วันนี้/เดือนนี้อีกแค่ไหน (เครื่องมือไม่เป็นทางการ)",
  keywords: [
    "ไทยช่วยไทย",
    "ไทยช่วยไทย พลัส",
    "60/40",
    "คนละครึ่ง",
    "เป๋าตัง",
    "คำนวณส่วนลด",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5ecd9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1411" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">{children}</body>
    </html>
  );
}
