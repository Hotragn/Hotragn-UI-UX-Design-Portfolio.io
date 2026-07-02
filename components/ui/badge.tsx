import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-block rounded-full border border-solid px-3 py-[0.32rem]",
    "text-[0.78rem] font-[560] tracking-[0.03em] leading-normal",
  ].join(" "),
  {
    variants: {
      tone: {
        default: "bg-paper-deep text-ink-soft border-line",
        green:
          "tag-green bg-forest-soft text-forest border-[color-mix(in_srgb,var(--forest)_25%,transparent)]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof badgeVariants> {
  as?: React.ElementType;
}

function Badge({ className, tone, as, ...props }: BadgeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (as ?? "span") as any;
  return <Comp className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
