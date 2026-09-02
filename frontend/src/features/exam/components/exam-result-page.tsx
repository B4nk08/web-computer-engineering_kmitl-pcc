"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { loadExamResult } from "../lib/storage";
import type { StoredExamResult } from "../types";
import { ExamResultView } from "./exam-result-view";

export function ExamResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredExamResult | null | undefined>(undefined);

  useEffect(() => {
    setResult(loadExamResult());
  }, []);

  useEffect(() => {
    if (result === null) {
      router.replace("/exam");
    }
  }, [result, router]);

  if (result === undefined || result === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
        <Loader2 className="mr-2 size-4 animate-spin" />
        กำลังโหลด...
      </div>
    );
  }

  return <ExamResultView result={result} />;
}
