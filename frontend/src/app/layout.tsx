import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/hooks/use-role";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/**
 * layout.tsx (root)
 * ------------------
 * Layout หลักของทั้งเว็บไซต์ ครอบทุกหน้าด้วย:
 *  - RoleProvider: จำลองบทบาทผู้ใช้ guest/member (ดู hooks/use-role.tsx)
 *  - Navbar / Footer: แสดงซ้ำทุกหน้า ไม่ต้องเขียนซ้ำในแต่ละ page.tsx
 *
 * หมายเหตุเรื่องฟอนต์: โหลด Prompt/Inter ผ่านแท็ก <link> ธรรมดา (runtime)
 * แทนการใช้ next/font/google เพราะ next/font ต้อง fetch ฟอนต์ตอน build
 * ซึ่งจะพังถ้าเครื่อง build ไม่มีอินเทอร์เน็ต/อยู่หลัง proxy ที่ปิดกั้น
 * fonts.googleapis.com — ถ้าเครื่อง build ของคุณมีอินเทอร์เน็ตปกติ
 * เปลี่ยนกลับไปใช้ next/font/google ได้ตามสะดวก
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
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout ของ App Router คือที่ที่ถูกต้องสำหรับฟอนต์ทั้งเว็บ กฎนี้ตั้งใจไว้สำหรับ Pages Router (pages/_document.js) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <RoleProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </RoleProvider>
      </body>
    </html>
  );
}
