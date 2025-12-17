import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const FLOATING_DOTS = [
  { left: "4%", top: "14%", size: "h-1.5 w-1.5", delay: 0 },
  { left: "10%", top: "42%", size: "h-2 w-2", delay: 0.35 },
  { left: "16%", top: "70%", size: "h-2.5 w-2.5", delay: 0.8 },
  { left: "22%", top: "28%", size: "h-2 w-2", delay: 1.1 },
  { left: "28%", top: "56%", size: "h-1.5 w-1.5", delay: 1.4 },
  { left: "34%", top: "18%", size: "h-2 w-2", delay: 1.9 },
  { left: "38%", top: "78%", size: "h-1.5 w-1.5", delay: 2.2 },
  { left: "46%", top: "36%", size: "h-2 w-2", delay: 0.6 },
  { left: "52%", top: "64%", size: "h-1.5 w-1.5", delay: 1.6 },
  { left: "58%", top: "22%", size: "h-2.5 w-2.5", delay: 2.5 },
  { left: "64%", top: "48%", size: "h-2 w-2", delay: 1.3 },
  { left: "70%", top: "12%", size: "h-1.5 w-1.5", delay: 0.9 },
  { left: "74%", top: "74%", size: "h-2.5 w-2.5", delay: 2.9 },
  { left: "80%", top: "32%", size: "h-1.5 w-1.5", delay: 0.45 },
  { left: "86%", top: "58%", size: "h-2 w-2", delay: 1.75 },
  { left: "90%", top: "24%", size: "h-1.5 w-1.5", delay: 2.35 },
  { left: "94%", top: "68%", size: "h-1.5 w-1.5", delay: 1.1 },
  { left: "50%", top: "84%", size: "h-1.5 w-1.5", delay: 2.6 },
  { left: "30%", top: "6%", size: "h-1.5 w-1.5", delay: 2.1 },
  { left: "12%", top: "86%", size: "h-1.5 w-1.5", delay: 1.95 },
];

const CHAIN_BLOCKS = [
  { size: "h-9 w-9", border: "border-primary/40", bg: "bg-primary/10", delay: 0 },
  { size: "h-7 w-7", border: "border-primary/30", bg: "bg-primary/15", delay: 0.35 },
  { size: "h-6 w-6", border: "border-primary/40", bg: "bg-primary/20", delay: 0.7 },
  { size: "h-5 w-5", border: "border-primary/30", bg: "bg-primary/25", delay: 1.05 },
  { size: "h-4 w-4", border: "border-primary/20", bg: "bg-primary/30", delay: 1.4 },
];

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  topic?: string;
  actions?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
  className?: string;
  media?: ReactNode;
  mediaClassName?: string;
  contentClassName?: string;
}

const PageHero = ({
  eyebrow,
  title,
  description,
  topic,
  actions,
  align = "left",
  children,
  className,
  media,
  mediaClassName,
  contentClassName = "max-w-3xl",
}: PageHeroProps) => {
  const isCenter = align === "center";
  const hasMedia = Boolean(media);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isPointerActive, setIsPointerActive] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 110, damping: 18, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 110, damping: 18, mass: 0.4 });

  const pointerRatioX = useMotionValue(0.5);
  const pointerRatioY = useMotionValue(0.5);
  const chainSpringX = useSpring(useTransform(pointerRatioX, (value) => (value - 0.5) * 72), {
    stiffness: 90,
    damping: 20,
    mass: 0.6,
  });
  const chainSpringY = useSpring(useTransform(pointerRatioY, (value) => (value - 0.5) * 48), {
    stiffness: 90,
    damping: 20,
    mass: 0.6,
  });

  useEffect(() => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }
    pointerX.set(bounds.width / 2);
    pointerY.set(bounds.height / 2);
    pointerRatioX.set(0.5);
    pointerRatioY.set(0.5);
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }
    pointerX.set(event.clientX - bounds.left);
    pointerY.set(event.clientY - bounds.top);
    pointerRatioX.set((event.clientX - bounds.left) / bounds.width);
    pointerRatioY.set((event.clientY - bounds.top) / bounds.height);
    if (!isPointerActive) {
      setIsPointerActive(true);
    }
  };

  const handlePointerLeave = () => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (bounds) {
      pointerX.set(bounds.width / 2);
      pointerY.set(bounds.height / 2);
    }
    pointerRatioX.set(0.5);
    pointerRatioY.set(0.5);
    setIsPointerActive(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      <div
        ref={heroRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative overflow-hidden rounded-[32px] px-8 py-12 md:px-12 md:py-16"
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-200/5"
            animate={{ opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          {FLOATING_DOTS.map((dot, index) => (
            <motion.span
              key={`${dot.left}-${dot.top}`}
              className={cn("absolute rounded-full bg-primary/30", dot.size)}
              style={{ left: dot.left, top: dot.top }}
              animate={{
                y: ["0%", "-35%", "15%", "0%"],
                x: ["0%", "15%", "-10%", "0%"],
                opacity: [0.25, 0.7, 0.4, 0.25],
              }}
              transition={{
                duration: 8 + index * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: dot.delay,
              }}
            />
          ))}
        </div>

        <motion.div
          className="pointer-events-none absolute z-10 hidden aspect-square w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl sm:block"
          style={{ x: springX, y: springY }}
          animate={isPointerActive ? { opacity: 0.28 } : { opacity: 0.18 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />

        <motion.div
          className="pointer-events-none absolute z-20 hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl border border-primary/40 bg-primary/10 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-primary shadow-[0_24px_70px_rgba(59,130,246,0.25)] backdrop-blur-md sm:flex md:h-32 md:w-32"
          style={{ x: springX, y: springY }}
          animate={isPointerActive ? { opacity: 0.95, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <span className="text-[0.45rem] tracking-[0.6em] text-primary/60">Focus</span>
          <span className="mt-2 text-xs tracking-[0.4em] text-primary/90">
            {(topic ?? "Explore").toUpperCase()}
          </span>
          <div className="mt-3 flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/30" />
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex lg:right-12"
          style={{ x: chainSpringX, y: chainSpringY }}
          animate={isPointerActive ? { opacity: 1 } : { opacity: 0.65 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {CHAIN_BLOCKS.map((block, index) => (
            <div key={`${block.size}-${index}`} className="flex flex-col items-center gap-2">
              <motion.div
                className={cn(
                  "relative grid place-items-center rounded-xl border backdrop-blur-md shadow-[0_14px_35px_rgba(59,130,246,0.22)]",
                  block.size,
                  block.border,
                  block.bg,
                )}
                animate={{
                  y: [0, -12, 8, 0],
                  rotate: [0, 6, -6, 0],
                  scale: [1, 1.05, 0.98, 1],
                }}
                transition={{ duration: 3.4 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: block.delay }}
              >
                <span className="absolute inset-[35%] rounded-md bg-primary/40" />
              </motion.div>
              {index < CHAIN_BLOCKS.length - 1 ? (
                <motion.span
                  className="block h-8 w-px origin-center bg-gradient-to-b from-primary/40 via-primary/25 to-transparent"
                  animate={{ scaleY: [1, 1.2, 0.85, 1] }}
                  transition={{ duration: 2.6 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: block.delay / 1.5 }}
                />
              ) : null}
            </div>
          ))}
        </motion.div>

        <div
          className={cn(
            "relative z-30 flex flex-col gap-10",
            hasMedia ? "md:flex-row md:items-center md:justify-between" : undefined,
            isCenter && !hasMedia ? "items-center text-center" : "items-start text-left",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-6",
              contentClassName,
              isCenter && !hasMedia ? "items-center text-center" : "items-start text-left",
            )}
          >
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
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
            <div
              className={cn(
                "flex flex-wrap gap-3",
                isCenter ? "justify-center" : "justify-start",
              )}
            >
              {actions}
            </div>
          ) : null}

          {children ? (
            <div
              className={cn(
                "w-full text-sm text-muted-foreground md:text-base",
                isCenter && !hasMedia ? "text-center" : "text-left",
              )}
            >
              {children}
            </div>
          ) : null}
          </div>

          {hasMedia ? (
            <div
              className={cn(
                "relative mt-6 w-full max-w-sm flex-shrink-0 overflow-hidden rounded-3xl border border-border/60 bg-background/70 shadow-xl transition-shadow duration-300 aspect-[4/3] md:mt-0 md:max-w-md md:aspect-[16/10]",
                mediaClassName,
              )}
            >
              {media}
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
};

export default PageHero;
