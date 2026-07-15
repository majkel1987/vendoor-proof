"use client";

import { domAnimation, LazyMotion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type LandingMotionProviderProps = {
  children: ReactNode;
};

export function LandingMotionProvider({
  children,
}: LandingMotionProviderProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function ScrollRevealArticle(
  props: ComponentPropsWithoutRef<"article">,
) {
  return <article data-motion-reveal="" {...props} />;
}

export function ScrollRevealDiv(props: ComponentPropsWithoutRef<"div">) {
  return <div data-motion-reveal="" {...props} />;
}
