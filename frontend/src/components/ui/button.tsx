import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button.tsx
 * ----------
 * ปุ่มมาตรฐานของทั้งเว็บไซต์ เขียนตามแบบแผน shadcn/ui (ใช้ class-variance-authority
 * กำหนด variant/size) เพื่อให้เข้ากับคอมโพเนนต์ shadcn อื่นๆ ที่จะเพิ่มเข้ามาภายหลัง
 * ใช้ได้ทั้งกับ <button> ปกติ และห่อ <Link> ของ Next.js (ผ่าน prop `asChild`)
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium " +
    "transition-colors disabled:pointer-events-none disabled:opacity-50 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--navy-800)]",
        outline:
          "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
        ghost: "text-[var(--foreground)] hover:bg-[var(--muted)]",
        accent: "bg-[var(--accent)] text-white hover:opacity-90",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "text-[var(--accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** true = ห่อ element ลูก (เช่น next/link Link) แทนการ render <button> เอง */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
