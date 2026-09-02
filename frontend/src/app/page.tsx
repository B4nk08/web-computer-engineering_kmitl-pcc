import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e8eef7_0%,_#f8fafc_55%,_#ffffff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
        <div className="space-y-3">
          <p className="text-sm font-medium tracking-wide text-slate-500">KMITL PCC</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Computer Engineering
          </h1>
          <p className="max-w-xl text-base text-slate-600">
            Frontend (Next.js + Tailwind + shadcn) พร้อมเชื่อมต่อ Backend (Go Gin + Gorm)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project scaffold พร้อมแล้ว</CardTitle>
            <CardDescription>
              API base URL: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{apiBase}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="/login">Sign in</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/register">Sign up</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/exam">Exit Exam</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`${apiBase}/health`} target="_blank" rel="noreferrer">
                ตรวจ Backend /health
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
