"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Inbox,
  MapPin,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AdminStatus({
  tone = "info",
  children,
}: {
  tone?: "success" | "error" | "info";
  children: ReactNode;
}) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-[#f0d2b4] bg-[#fff6ec] text-[#7a3f16]",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : MapPin;

  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm leading-relaxed",
        styles
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
      <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-white text-muted-foreground shadow-sm">
        <Inbox className="size-5" />
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function AdminSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-[1.25rem] border border-border/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,29,63,0.04)] sm:p-6",
        className
      )}
    >
      {title ? (
        <div className="space-y-1 border-b border-border/60 pb-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function AdminField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function AdminTextarea(props: React.ComponentProps<"textarea">) {
  return <textarea className="admin-control min-h-28" {...props} />;
}

export function AdminSelect(props: React.ComponentProps<"select">) {
  const { className, ...rest } = props;
  return <select className={cn("admin-control", className)} {...rest} />;
}

export function AdminToggle({
  id,
  checked,
  onChange,
  label,
  disabled,
}: {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm transition-colors",
        checked
          ? "border-[#f0d2b4] bg-[#fff6ec]"
          : "border-border/80 bg-muted/40",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-accent"
      />
      {label}
    </label>
  );
}

export function AdminBadge({
  tone = "muted",
  children,
}: {
  tone?: "success" | "muted" | "accent" | "info" | "warning";
  children: ReactNode;
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
    muted: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    accent: "bg-[#fff1e6] text-[#9a4a1c] ring-1 ring-[#f0d2b4]",
    info: "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
    warning: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  }[tone];
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", styles)}>
      {children}
    </span>
  );
}

export function AdminPill({
  active,
  onClick,
  children,
  muted,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all",
        active
          ? "border-transparent bg-[#d4652b] text-white shadow-[0_8px_18px_rgba(212,101,43,0.28)]"
          : "border-border bg-white text-foreground hover:-translate-y-0.5 hover:border-[#d4652b]/40 hover:shadow-sm",
        muted && "opacity-50"
      )}
    >
      {children}
    </button>
  );
}

export function AdminFormShell({
  heading,
  sectionTitle,
  locationHint,
  onBack,
  children,
}: {
  heading: string;
  sectionTitle: string;
  locationHint?: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <header className="flex items-start gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="mt-0.5 h-10 w-10 shrink-0 rounded-xl"
          onClick={onBack}
          aria-label="กลับ"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{sectionTitle}</p>
          <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
        </div>
      </header>
      <div className="admin-card space-y-5 px-6 py-6 sm:px-8 sm:py-7">
        {locationHint ? <AdminStatus tone="info">{locationHint}</AdminStatus> : null}
        {children}
      </div>
    </div>
  );
}

export function AdminDialogFrame({
  title,
  description,
  submitting,
  children,
  wide,
}: {
  title: string;
  description?: string;
  submitting?: boolean;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="admin-dialog-overlay fixed inset-0 z-50" />
      <Dialog.Content
        className={cn(
          "admin-dialog-content fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col outline-none",
          wide ? "max-w-xl" : "max-w-lg"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <Dialog.Title className="text-lg font-semibold tracking-tight">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">{title}</Dialog.Description>
            )}
          </div>
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              disabled={submitting}
              aria-label="ปิด"
            >
              <X className="size-4" />
            </Button>
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function AdminFormActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-border/70 bg-white/90 pt-5 backdrop-blur">
      {children}
    </div>
  );
}
