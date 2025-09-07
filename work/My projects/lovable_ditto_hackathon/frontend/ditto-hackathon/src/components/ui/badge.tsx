import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Office Chaos specific variants
        joined: "border-transparent bg-event-positive/20 text-event-positive",
        left: "border-transparent bg-muted text-muted-foreground",
        message: "border-transparent bg-event-neutral/20 text-event-neutral",
        break: "border-transparent bg-accent/30 text-accent-foreground",
        meeting: "border-transparent bg-event-warning/20 text-event-warning",
        cry: "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
        dance: "border-transparent bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
        rage: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        sleep: "border-transparent bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        party: "border-transparent bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
        error: "border-transparent bg-destructive/20 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
