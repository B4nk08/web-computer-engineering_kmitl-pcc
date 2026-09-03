/**
 * placeholder-page.tsx
 * ---------------------
 * ใช้แสดงหน้า(เช่น Quizz, วิเคราะห์,รายชื่อชั้นปี, CE exit exam)
 * รอสเปกเพิ่ม
 */
export function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <section className="flex min-h-[50vh] items-center justify-center bg-[var(--surface)] px-4 py-16">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
        <h1 className="text-lg font-semibold text-[var(--ink)]">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          {description ?? "รอรายละเอียดเพิ่มเติม"}
        </p>
      </div>
    </section>
  );
}
