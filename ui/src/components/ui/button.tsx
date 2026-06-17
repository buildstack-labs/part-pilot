import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "navy";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-orange text-white shadow-[0_3px_8px_rgba(246,173,85,0.3)] hover:bg-orange-dark hover:-translate-y-px",
  secondary:
    "bg-white text-navy border-[1.5px] border-border hover:border-navy hover:bg-[#EDF2F7]",
  ghost:
    "bg-transparent border border-white/25 text-white hover:bg-white/10",
  navy: "bg-navy text-white hover:bg-navy-light",
};

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[9px] px-5 py-2.5 text-sm font-bold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none font-heebo",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
