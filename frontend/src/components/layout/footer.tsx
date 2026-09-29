import Link from "next/link";

const CONTACT = {
  phones: ["0-7750-6434", "08-3066-5331"],
  email: "kmitl-chumphon@kmitl.ac.th",
  address: "17/1 หมู่ 6 ต.ชุมโค อ.ปะทิว จ.ชุมพร 86160",
} as const;

const QUICK_LINKS = [
  { label: "หลักสูตร", href: "/about-us/beng" },
  { label: "คุณสมบัติผู้สมัคร", href: "/about-us/admission-requirements" },
  { label: "กิจกรรมภาควิชา", href: "/about-us/activities" },
  { label: "ประกาศรับสมัคร", href: "/news" },
] as const;

/**
 * Footer — ท้ายเว็บสาธารณะ
 * โลโก้เดียวกับ Navbar (`/brand/logo-ce.png`) + ข้อมูลติดต่อวิทยาเขต + ลิงก์ด่วน
 */
export function Footer() {
  return (
    <footer className="bg-[var(--navy-950)] text-white/70">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:grid-cols-2 md:px-8 lg:grid-cols-3 lg:gap-12">
        <div className="space-y-4">
          <Link
            href="/"
            className="relative flex h-12 w-44 items-center sm:h-14 sm:w-52"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-ce.png"
              alt="KMITL Computer Engineering"
              className="h-full w-full object-contain object-left"
            />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed">
            ภาควิชาวิศวกรรมคอมพิวเตอร์
            <br />
            สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง
            <br />
            วิทยาเขตชุมพรเขตรอุดมศักดิ์
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
            ติดต่อภาควิชา
          </h3>
          <ul className="space-y-2.5 text-sm leading-relaxed">
            <li>
              <span className="text-white/45">โทร </span>
              {CONTACT.phones.map((phone, i) => (
                <span key={phone}>
                  {i > 0 ? ", " : null}
                  <a
                    href={`tel:${phone.replace(/-/g, "")}`}
                    className="transition-colors hover:text-white"
                  >
                    {phone}
                  </a>
                </span>
              ))}
            </li>
            <li>
              <span className="text-white/45">อีเมล </span>
              <a
                href={`mailto:${CONTACT.email}`}
                className="transition-colors hover:text-white"
              >
                {CONTACT.email}
              </a>
            </li>
            <li>
              <span className="text-white/45">ที่อยู่ </span>
              {CONTACT.address}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
            ลิงก์ด่วน
          </h3>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
