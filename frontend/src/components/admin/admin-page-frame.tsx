"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPageFrameProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function AdminPageFrame({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: AdminPageFrameProps) {
  return (
    <section className={cn("space-y-5", className)}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </header>
      {children != null ? (
        <div className={cn("admin-card px-6 py-5 sm:px-8 sm:py-6", bodyClassName)}>{children}</div>
      ) : null}
    </section>
  );
}
