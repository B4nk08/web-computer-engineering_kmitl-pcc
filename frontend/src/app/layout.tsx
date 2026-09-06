import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth";

/**
 * Root layout — providers + html/body เท่านั้น
 * ไม่ใส่ Navbar/Footer ที่นี่ เพราะ auth / admin / exam ต้องเป็น full-bleed
 *
 * โครงสร้าง route:
 *   (site)/*   → เว็บสาธารณะ (มี Navbar + Footer)
 *   (auth)/*   → login / register
 *   admin/*    → admin panel (sidebar ของตัวเอง)
 *   exam/*     → Exit Exam (fullscreen)
 */

export const metadata: Metadata = {
  title: "ภาควิชาวิศวกรรมคอมพิวเตอร์ | Computer Engineering",
  description: "เว็บไซต์ภาควิชาวิศวกรรมคอมพิวเตอร์",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout ของ App Router คือที่ที่ถูกต้องสำหรับฟอนต์ทั้งเว็บ */}
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
