/**
 * หัวข้อหน้า Faculty — ขนาดและจัดวางเท่าหัวข้อหน้า About Us
 */
export function FacultyPageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 text-center sm:px-6 sm:py-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">{subtitle}</p>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[var(--navy-900)]" />
      </div>
    </header>
  );
}
