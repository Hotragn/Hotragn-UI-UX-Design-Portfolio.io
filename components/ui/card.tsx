import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative border border-solid border-line bg-card text-inherit rounded-card shadow-card",
  {
    variants: {
      hover: {
        none: "",
        lift: "transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-lift motion-reduce:transition-none",
      },
    },
    defaultVariants: {
      hover: "none",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

const Card = React.forwardRef<HTMLElement, CardProps>(
  ({ className, hover, as, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = (as ?? (props.href ? "a" : "div")) as any;
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ hover }), className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card, cardVariants };
