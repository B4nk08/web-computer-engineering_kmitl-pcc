import { Button } from "@/components/ui/button";

/**
 * app/beng/page.tsx (route "/beng")
 * -----------------------------------
 * หน้ารายละเอียดหลักสูตร B.Eng. (Bachelor of Engineering - Computer Engineering)
 * เข้าถึงได้จากเมนู About Us > หลักสูตร หรือปุ่ม "หลักสูตร" ในหน้า Home
 * ข้อมูลด้านล่างเป็นตัวอย่าง แก้ไข/เชื่อมต่อข้อมูลจริงได้ที่ FIELDS ด้านล่าง
 */

const FIELDS: { label: string; value: string }[] = [
  { label: "ชื่อปริญญาและสาขาวิชา (ภาษาไทย)", value: "วิศวกรรมศาสตรบัณฑิต (วิศวกรรมคอมพิวเตอร์)" },
  { label: "ชื่อปริญญาและสาขาวิชา (ภาษาอังกฤษ)", value: "Bachelor of Engineering (Computer Engineering)" },
  { label: "ชื่อย่อปริญญา (ภาษาไทย)", value: "วศ.บ. (วิศวกรรมคอมพิวเตอร์)" },
  { label: "ชื่อย่อปริญญา (ภาษาอังกฤษ)", value: "B.Eng. (Computer Engineering)" },
  { label: "สถานที่จัดการเรียนการสอน", value: "อาคารเรียนภาควิชาวิศวกรรมคอมพิวเตอร์ วิทยาเขตหลัก" },
  { label: "ภาษาที่ใช้", value: "หลักสูตรจัดการศึกษาเป็นภาษาไทย" },
  { label: "ระบบการจัดการศึกษา", value: "ใช้ระบบทวิภาค โดย 1 ปีการศึกษาแบ่งออกเป็น 2 ภาคการศึกษาปกติ" },
];

const SUMMARY_CARDS = [
  { value: "4 ปี", label: "รูปแบบหลักสูตร" },
  { value: "138 หน่วยกิต", label: "จำนวนหน่วยกิตรวม" },
  { value: "ทวิภาค", label: "ระบบการศึกษา" },
];

export default function BEngPage() {
  return (
    <section className="bg-[var(--surface)] py-12 sm:py-16">
      <div className="mx-auto max-w-[1000px] px-4 md:px-8">
        <div className="rounded-2xl bg-[var(--navy-900)] p-6 text-white sm:p-10">
          <h1 className="text-xl font-semibold sm:text-2xl">
            หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Bachelor of Engineering Program in Computer Engineering
          </p>

          <a
            href="#"
            className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-white/80 underline-offset-4 hover:underline"
          >
            📄 ดาวน์โหลดรายละเอียดหลักสูตรฉบับเต็ม (PDF)
          </a>

          <dl className="mt-8 divide-y divide-white/10 border-t border-white/10 text-sm">
            {FIELDS.map((f) => (
              <div key={f.label} className="grid gap-1 py-3 sm:grid-cols-[260px_1fr] sm:gap-4">
                <dt className="text-white/60">{f.label}</dt>
                <dd className="font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {SUMMARY_CARDS.map((c) => (
              <div key={c.label} className="rounded-xl bg-white/10 p-4 text-center">
                <p className="text-lg font-semibold">{c.value}</p>
                <p className="mt-1 text-xs text-white/70">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <a href="/admission-requirements">ดูคุณสมบัติผู้สมัคร</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
