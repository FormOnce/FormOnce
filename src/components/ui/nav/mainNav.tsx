import Link from "next/link";

import { cn } from "@utils/cn";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/forms"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Forms
      </Link>
      <Link
        href="/responses"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Responses
      </Link>
    </nav>
  );
}
