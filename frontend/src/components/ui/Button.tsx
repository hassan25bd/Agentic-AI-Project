import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  accent: "bg-accent-500 text-white hover:bg-accent-600",
  outline: "border border-ink-200 text-ink-800 hover:bg-ink-50 dark:text-ink-100 dark:border-ink-700 dark:hover:bg-ink-900",
  ghost: "text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
