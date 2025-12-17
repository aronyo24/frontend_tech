import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
  className?: string;
}

const PageHero = ({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  children,
  className,
}: PageHeroProps) => {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  const actionAlignment = align === "center" ? "justify-center" : "justify-start";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
    >
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-8 shadow-lg shadow-primary/5 backdrop-blur md:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_60%)]" aria-hidden="true" />
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />
        </div>

        <div className={cn("relative z-10 flex flex-col gap-6", alignment)}>
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              {eyebrow}
            </span>
          ) : null}

          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl md:font-bold">
            {title}
          </h1>

          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}

          {actions ? (
            <div className={cn("flex flex-wrap gap-3", actionAlignment)}>{actions}</div>
          ) : null}

          {children ? (
            <div
              className={cn(
                "w-full text-sm text-muted-foreground md:text-base",
                align === "center" ? "text-center" : "text-left",
              )}
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
};

export default PageHero;
