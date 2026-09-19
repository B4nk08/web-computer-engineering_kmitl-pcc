"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import type { CareerBriefDto, ClusterScoreDto, InternalQuizResultDto } from "./api";

export function StudentQuizResult({
  result,
  onRetake,
}: {
  result: InternalQuizResultDto | null;
  onRetake: () => void;
}) {
  if (!result || result.clusters.length === 0) {
    return (
      <section className="flex min-h-svh flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีผลลัพธ์จากแบบทดสอบ</p>
        <button
          type="button"
          onClick={onRetake}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-xs font-medium text-white"
        >
          ทำแบบทดสอบอีกครั้ง
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </section>
    );
  }

  const recommended = result.clusters[0];
  const runnerUp = result.clusters[1];

  return (
    <section className="mx-auto flex min-h-svh w-full max-w-3xl flex-col items-center px-4 py-24">
      <p className="text-sm font-medium text-[var(--ink-soft)]">สายที่คุณเอียงไปทาง</p>
      <h1 className="mt-1 text-center text-2xl font-semibold text-[var(--navy-900)] sm:text-3xl">
        {recommended.name}
      </h1>
      {recommended.name_en ? (
        <p className="mt-1 text-sm text-[var(--ink-soft)]">{recommended.name_en}</p>
      ) : null}
      <p className="mt-4 max-w-lg text-center text-sm leading-relaxed text-[var(--ink)]">
        {recommended.description}
      </p>
      {result.is_close && runnerUp ? (
        <p className="mt-3 max-w-lg text-center text-sm text-[var(--accent)]">
          คะแนนใกล้กับ {runnerUp.name} ด้วย — ลองดูอาชีพทั้งสองกลุ่มประกอบกันได้
        </p>
      ) : null}

      <div className="mt-10 w-full space-y-3">
        {result.clusters.map((cluster) => (
          <ClusterBar key={cluster.code} cluster={cluster} highlight={cluster.code === recommended.code} />
        ))}
      </div>
      <p className="mt-3 text-xs text-[var(--ink-soft)]">
        ตัวเลขคือสัดส่วนคำตอบที่เอียงไปทางนั้น จากทั้งหมด {result.question_count} ข้อ ไม่ใช่คะแนนความเหมาะสมแบบฟันธง
      </p>

      <CareerGroup
        title={`อาชีพในกลุ่ม ${recommended.name}`}
        careers={recommended.careers ?? []}
      />
      {result.is_close && runnerUp ? (
        <CareerGroup title={`อาชีพใกล้เคียงในกลุ่ม ${runnerUp.name}`} careers={runnerUp.careers ?? []} />
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/about-us/careers"
          className="inline-flex items-center rounded-full border border-[var(--navy-900)]/20 px-5 py-2.5 text-xs font-medium text-[var(--navy-900)] hover:bg-[var(--muted)]"
        >
          ดูเส้นทางอาชีพทั้งหมด
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95"
        >
          ทำแบบทดสอบอีกครั้ง
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}

function ClusterBar({ cluster, highlight }: { cluster: ClusterScoreDto; highlight: boolean }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={highlight ? "font-semibold text-[var(--navy-900)]" : "text-[var(--ink)]"}>
          {cluster.name}
        </span>
        <span className="text-[var(--ink-soft)]">
          {cluster.percent}% ({Math.round(cluster.score)} ข้อ)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className={`h-full rounded-full ${highlight ? "bg-[var(--navy-900)]" : "bg-[var(--navy-900)]/40"}`}
          style={{ width: `${Math.min(100, Math.max(0, cluster.percent))}%` }}
        />
      </div>
    </div>
  );
}

function CareerGroup({ title, careers }: { title: string; careers: CareerBriefDto[] }) {
  if (careers.length === 0) return null;
  return (
    <div className="mt-10 w-full">
      <h2 className="text-sm font-semibold text-[var(--navy-900)]">{title}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {careers.map((career) => (
          <article
            key={career.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left"
          >
            {career.role ? (
              <p className="text-[11px] font-medium text-[var(--ink-soft)]">{career.role}</p>
            ) : null}
            <h3 className="mt-0.5 text-sm font-semibold text-[var(--ink)]">{career.title}</h3>
            {career.detail ? (
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--ink-soft)]">{career.detail}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
