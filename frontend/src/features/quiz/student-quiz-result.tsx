"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { CareerBriefDto, ClusterScoreDto, InternalQuizResultDto } from "./api";

const CAREER_PREVIEW = 3;

export function StudentQuizResult({
  result,
  onRetake,
}: {
  result: InternalQuizResultDto | null;
  onRetake: () => void;
}) {
  const [showAllScores, setShowAllScores] = useState(false);
  const [showAllCareers, setShowAllCareers] = useState(false);

  if (!result || result.clusters.length === 0) {
    return (
      <section className="flex min-h-svh flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีผลลัพธ์จากแบบทดสอบ</p>
        <button
          type="button"
          onClick={onRetake}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-sm font-medium text-white"
        >
          ทำแบบทดสอบอีกครั้ง
          <RotateCcw className="h-4 w-4" />
        </button>
      </section>
    );
  }

  const recommended = result.clusters[0];
  const runnerUp = result.clusters[1];
  const isClose = Boolean(result.is_close && runnerUp);
  const primaryCareers = recommended.careers ?? [];
  const visibleCareers = showAllCareers
    ? primaryCareers
    : primaryCareers.slice(0, CAREER_PREVIEW);
  const hiddenCareerCount = Math.max(0, primaryCareers.length - CAREER_PREVIEW);

  return (
    <section className="mx-auto flex min-h-svh w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-medium text-[var(--ink-soft)] sm:text-base">
        {isClose ? "สองสายที่คุณเอียงไปใกล้กัน" : "สายที่คุณเอียงไปทาง"}
      </p>

      {isClose && runnerUp ? (
        <div className="mt-3 flex flex-wrap items-end justify-center gap-x-7 gap-y-3">
          <HeroTrack
            name={recommended.name}
            nameEn={recommended.name_en}
            percent={recommended.percent}
            primary
          />
          <span className="hidden pb-9 text-sm text-[var(--ink-soft)] sm:inline">และ</span>
          <HeroTrack
            name={runnerUp.name}
            nameEn={runnerUp.name_en}
            percent={runnerUp.percent}
          />
        </div>
      ) : (
        <HeroTrack
          name={recommended.name}
          nameEn={recommended.name_en}
          percent={recommended.percent}
          primary
          large
        />
      )}

      <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--ink)] sm:text-base">
        {recommended.description}
      </p>
      {isClose && runnerUp?.description ? (
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-base">
          ใกล้เคียงกับ {runnerUp.name}: {runnerUp.description}
        </p>
      ) : null}

      <div className="mt-8 w-full max-w-lg">
        <button
          type="button"
          onClick={() => setShowAllScores((open) => !open)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--navy-900)] transition-colors hover:text-[var(--accent)]"
          aria-expanded={showAllScores}
        >
          {showAllScores ? "ซ่อนสัดส่วนทุกสาย" : "ดูสัดส่วนทุกสาย"}
          <ChevronDown
            className={`size-4 transition-transform ${showAllScores ? "rotate-180" : ""}`}
          />
        </button>

        {showAllScores ? (
          <div className="mt-4 space-y-2.5 text-left">
            {result.clusters.map((cluster) => (
              <ClusterBar
                key={cluster.code}
                cluster={cluster}
                highlight={cluster.code === recommended.code}
              />
            ))}
            <p className="pt-1 text-sm leading-relaxed text-[var(--ink-soft)]">
              สัดส่วนคำตอบจาก {result.question_count} ข้อ เป็นแนวทาง ไม่ใช่การันตีอาชีพ
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            จากคำตอบ {result.question_count} ข้อ · เป็นแนวทาง ไม่ใช่การันตีอาชีพ
          </p>
        )}
      </div>

      {primaryCareers.length > 0 ? (
        <div className="mt-10 w-full max-w-lg text-left">
          <h2 className="text-center text-base font-semibold text-[var(--navy-900)]">
            อาชีพตัวอย่างในกลุ่ม {recommended.name}
          </h2>
          <ul className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {visibleCareers.map((career) => (
              <CareerRow key={career.id} career={career} />
            ))}
          </ul>
          {hiddenCareerCount > 0 ? (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllCareers((open) => !open)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--navy-900)] hover:text-[var(--accent)]"
              >
                {showAllCareers
                  ? "แสดงน้อยลง"
                  : `ดูอาชีพเพิ่มอีก ${hiddenCareerCount} รายการ`}
                <ChevronDown
                  className={`size-4 transition-transform ${showAllCareers ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {isClose && runnerUp && (runnerUp.careers?.length ?? 0) > 0 ? (
        <RunnerUpCareers cluster={runnerUp} />
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/about-us/careers"
          className="inline-flex items-center rounded-full border border-[var(--navy-900)]/20 px-5 py-2.5 text-sm font-medium text-[var(--navy-900)] hover:bg-white/70"
        >
          ดูเส้นทางอาชีพทั้งหมด
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
        >
          ทำแบบทดสอบอีกครั้ง
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function HeroTrack({
  name,
  nameEn,
  percent,
  primary = false,
  large = false,
}: {
  name: string;
  nameEn?: string;
  percent: number;
  primary?: boolean;
  large?: boolean;
}) {
  return (
    <div className={large ? "mt-2" : undefined}>
      <h1
        className={`font-semibold tracking-tight text-[var(--navy-900)] ${
          large
            ? "text-3xl sm:text-4xl"
            : primary
              ? "text-2xl sm:text-3xl"
              : "text-xl sm:text-2xl"
        }`}
      >
        {name}
      </h1>
      {nameEn ? <p className="mt-1 text-sm text-[var(--ink-soft)] sm:text-base">{nameEn}</p> : null}
      <p
        className={`mt-3 font-semibold tabular-nums text-[var(--navy-900)] ${
          large ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"
        }`}
      >
        {Math.round(percent)}
        <span className="ml-0.5 text-2xl font-medium text-[var(--ink-soft)] sm:text-3xl">%</span>
      </p>
    </div>
  );
}

function ClusterBar({ cluster, highlight }: { cluster: ClusterScoreDto; highlight: boolean }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className={highlight ? "font-semibold text-[var(--navy-900)]" : "text-[var(--ink)]"}>
          {cluster.name}
        </span>
        <span className="tabular-nums text-[var(--ink-soft)]">
          {Math.round(cluster.percent)}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]/80">
        <div
          className={`h-full rounded-full ${highlight ? "bg-[var(--navy-900)]" : "bg-[var(--navy-900)]/35"}`}
          style={{ width: `${Math.min(100, Math.max(0, cluster.percent))}%` }}
        />
      </div>
    </div>
  );
}

function CareerRow({ career }: { career: CareerBriefDto }) {
  return (
    <li className="py-3.5">
      <p className="text-[15px] font-semibold text-[var(--ink)] sm:text-base">{career.title}</p>
      {career.role && career.role !== career.title ? (
        <p className="mt-0.5 text-xs text-[var(--ink-soft)] sm:text-sm">{career.role}</p>
      ) : null}
      {career.detail ? (
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">{career.detail}</p>
      ) : null}
    </li>
  );
}

function RunnerUpCareers({ cluster }: { cluster: ClusterScoreDto }) {
  const [open, setOpen] = useState(false);
  const careers = cluster.careers ?? [];
  if (careers.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-lg text-left">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-[var(--navy-900)] hover:text-[var(--accent)]"
        aria-expanded={open}
      >
        {open ? "ซ่อน" : "ดู"}อาชีพในกลุ่ม {cluster.name} ด้วย
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul className="mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {careers.map((career) => (
            <CareerRow key={career.id} career={career} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
