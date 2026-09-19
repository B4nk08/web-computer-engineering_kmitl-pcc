/**
 * หัวข้อหน้า About Us — ป้ายอังกฤษเล็ก → หัวข้อไทยตัวหนา → เส้นสั้น
 */
export function AboutUsPageHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--navy-900)]/70">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          {title}
        </h1>
        <div className="mt-3 h-1 w-12 rounded-full bg-[var(--navy-900)]" />
      </div>
    </header>
  );
}
