"use client";

import { useHomeStaff } from "@/features/home";

/**
 * หน้าบุคลากร CE — ดึงจาก API type=staff
 */
export default function FacultyCEPage() {
  const { data, loading, error } = useHomeStaff();

  return (
    <section className="bg-[var(--surface)] py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h1 className="mb-2 text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
          รายชื่อบุคลากรสาขาวิศวกรรมคอมพิวเตอร์
        </h1>
        <p className="mb-10 text-sm text-[var(--ink-soft)]">
          อาจารย์และบุคลากรประจำภาควิชา
        </p>

        {loading ? (
          <p className="text-sm text-[var(--ink-soft)]">กำลังโหลด...</p>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีข้อมูลบุคลากรที่เผยแพร่</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((member) => (
              <article
                key={member.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
                    {member.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[var(--ink)]">{member.name}</h2>
                    <p className="mt-0.5 text-sm text-[var(--ink-soft)]">{member.position}</p>
                  </div>
                </div>
                {member.bio ? (
                  <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{member.bio}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
