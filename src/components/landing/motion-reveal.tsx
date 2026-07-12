"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition
} from "framer-motion";
import type { ReactNode } from "react";

type LandingMotionProviderProps = {
  children: ReactNode;
};

type RevealProps = {
  delay?: number;
};

const viewport = { once: true, amount: 0.18 };
const transition: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1]
};

export function LandingMotionProvider({ children }: LandingMotionProviderProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function ScrollRevealArticle({
  delay = 0,
  ...props
}: HTMLMotionProps<"article"> & RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.article
      data-motion-reveal=""
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      transition={{ ...transition, delay }}
      viewport={viewport}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      {...props}
    />
  );
}

export function ScrollRevealDiv({
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      data-motion-reveal=""
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      transition={{ ...transition, delay }}
      viewport={viewport}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      {...props}
    />
  );
}
