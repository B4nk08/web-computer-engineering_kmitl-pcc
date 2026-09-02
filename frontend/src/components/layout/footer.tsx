/**
 * Footer.tsx
 * ----------
 * ท้ายเว็บไซต์ใช้ร่วมกันทุกหน้า ข้อมูลติดต่อ/ลิงก์เป็นตัวอย่าง แก้ไขได้
 * เป็น Server Component ได้เลย เพราะไม่มี state/interactivity
 */
export function Footer() {
  return (
    <footer className="mt-20 bg-[var(--navy-950)] text-white/70">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        <div>
          <div className="mb-3 flex h-11 w-32 items-center justify-center rounded-md bg-[#e5e5e5] text-xs font-semibold text-[var(--ink)]">
            LOGO
          </div>
          <p className="text-sm leading-relaxed">
            ภาควิชาวิศวกรรมคอมพิวเตอร์
            <br />
            คณะวิศวกรรมศาสตร์
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">ติดต่อภาควิชา</h3>
          <ul className="space-y-1.5 text-sm">
            <li>โทร: 000-000-0000</li>
            <li>อีเมล: ce@university.ac.th</li>
            <li>อาคารวิศวกรรมคอมพิวเตอร์ ชั้น 3</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">ลิงก์ด่วน</h3>
          <ul className="space-y-1.5 text-sm">
            <li>หลักสูตร</li>
            <li>คุณสมบัติผู้สมัคร</li>
            <li>กิจกรรมภาควิชา</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Department of Computer Engineering. All rights reserved.
      </div>
    </footer>
  );
}
