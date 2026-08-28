"use client";

import type { ReactNode } from "react";
import {
  domAnimation,
  LazyMotion,
  m,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

type MotionProps = {
  children: ReactNode;
  className?: string;
};

type RevealProps = MotionProps & {
  delay?: number;
  onLoad?: boolean;
};

export function LandingMotionRoot({ children, className }: MotionProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <main className={className}>{children}</main>
      </MotionConfig>
    </LazyMotion>
  );
}

export function HeroBackground({ children, className }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0.82, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: easeOut }}
    >
      {children}
    </m.div>
  );
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  onLoad = false,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? false : { opacity: 0, y: 28 };
  const visible = { opacity: 1, y: 0 };
  const transition = { duration: 0.65, delay, ease: easeOut };

  return (
    <m.div
      className={className}
      initial={initial}
      {...(onLoad
        ? { animate: visible }
        : {
            viewport: { once: true, amount: 0.18 },
            whileInView: visible,
          })}
      transition={transition}
    >
      {children}
    </m.div>
  );
}

export function MotionStagger({ children, className }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      variants={staggerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </m.div>
  );
}

export function MotionStaggerItem({ children, className }: MotionProps) {
  return (
    <m.div className={className} variants={itemVariants}>
      {children}
    </m.div>
  );
}
