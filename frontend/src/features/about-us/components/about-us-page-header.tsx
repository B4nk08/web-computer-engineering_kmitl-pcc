/**
 * หัวข้อหน้า About Us — รูปแบบเดียวกับ /about-us/activities
 * ป้ายอังกฤษเล็ก → หัวข้อไทยตัวหนา → เส้นสั้น → คำอธิบาย
 */
export function AboutUsPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-black/5 bg-white pt-20 sm:pt-24">
      <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 sm:pb-10">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--navy-900)]/70">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          {title}
        </h1>
        <div className="mt-3 h-1 w-12 rounded-full bg-[var(--navy-900)]" />
        <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--ink-soft)] sm:text-[15px] sm:leading-9">
          {description}
        </p>
      </div>
    </header>
  );
}
