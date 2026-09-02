/**
 * app/admission-requirements/page.tsx (route "/admission-requirements")
 * ------------------------------------------------------------------------
 * หน้าคุณสมบัติผู้สมัครและการดูแลนักศึกษาแรกเข้า
 * เข้าถึงได้จากเมนู About Us > คุณสมบัติ หรือปุ่ม "คุณสมบัติผู้สมัคร" ในหน้า Home
 */

const QUALIFICATIONS = [
  "สำเร็จการศึกษาไม่ต่ำกว่ามัธยมศึกษาตอนปลายสายวิทยาศาสตร์-คณิตศาสตร์",
  "มีผลการเรียนเฉลี่ยสะสมเป็นไปตามเกณฑ์ที่คณะกำหนดในแต่ละรอบการรับสมัคร",
];

const SUPPORT_CARDS = [
  {
    title: "ปฐมนิเทศนักศึกษาใหม่",
    detail: "แนะนำหลักสูตร กฎระเบียบ และการใช้ชีวิตในรั้วมหาวิทยาลัย",
  },
  {
    title: "อาจารย์ที่ปรึกษาประจำ",
    detail: "ดูแลให้คำปรึกษารายบุคคลด้านการเรียนตลอดหลักสูตร",
  },
  {
    title: "กิจกรรมเสริมสร้างทักษะ",
    detail: "ปฐมนิเทศและกิจกรรมเชื่อมความสัมพันธ์ระหว่างรุ่นพี่-รุ่นน้อง",
  },
  {
    title: "ระบบเวชระเบียน/สวัสดิการ",
    detail: "บริการดูแลสุขภาพนักศึกษาและระบบสวัสดิการภายในมหาวิทยาลัย",
  },
  {
    title: "ทุนการศึกษา",
    detail: "ข้อมูลแหล่งทุนการศึกษาสำหรับนักศึกษาที่ขาดแคลนทุนทรัพย์",
  },
  {
    title: "กิจกรรมพัฒนานักศึกษา",
    detail: "ชมรม/ชุมนุมนักศึกษาที่ส่งเสริมทักษะด้านวิชาการและสังคม",
  },
];

export default function AdmissionRequirementsPage() {
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

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-sm font-semibold text-white/90">คุณสมบัติของผู้เข้าศึกษา</h2>
              <ul className="space-y-2 text-sm text-white/70">
                {QUALIFICATIONS.map((q, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--accent)]">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-semibold text-white/90">การดูแลนักศึกษาแรกเข้า</h2>
              <div className="grid grid-cols-2 gap-3">
                {SUPPORT_CARDS.map((c) => (
                  <div key={c.title} className="rounded-lg bg-white/10 p-3">
                    <p className="text-xs font-semibold">{c.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/60">{c.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
