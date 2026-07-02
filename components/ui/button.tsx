import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center gap-[0.55rem] rounded-full px-[1.6rem] py-[0.85rem]",
    "text-base font-[580] no-underline cursor-pointer",
    "transition-[transform,box-shadow,background,border-color,color] duration-200 ease-out",
    "[&_svg]:flex-none",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "btn-primary bg-ink text-paper border-0 hover:bg-accent-ink hover:text-white dark:hover:text-dark hover:-translate-y-0.5 hover:shadow-card",
        ghost:
          "border-[1.5px] border-solid border-line bg-transparent text-ink hover:border-ink hover:text-ink hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof buttonVariants> {
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  download?: string | boolean;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant, as, children, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = (as ?? (props.href ? "a" : "button")) as any;
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      >
        {/* Inner wrapper keeps the label above the gradient hover overlay
            painted by .btn-primary::before */}
        <span className="relative z-[1] inline-flex items-center gap-[0.55rem]">
          {children}
        </span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
