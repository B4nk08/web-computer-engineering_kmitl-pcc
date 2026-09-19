/**
 * หัวข้อหน้า Faculty — จัดกึ่งกลางแบบนามบัตรภาควิชา
 * เส้นสั้นตรงกลางใต้คำอังกฤษ
 */
export function FacultyPageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-10 text-center sm:px-6 sm:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">{subtitle}</p>
        <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[var(--navy-900)]" />
      </div>
    </header>
  );
}
