"use client";

import { useEffect, useRef } from "react";
import { LionArt } from "./Lion";

/** Hero band with the animated lion, which drifts gently with the pointer. */
export function Hero({
  title,
  lead,
  compact = false,
  children,
}: {
  title: string;
  lead: string;
  compact?: boolean;
  children: React.ReactNode;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const lionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const lion = lionRef.current;
    if (!hero || !lion) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      lion.style.setProperty("--px", (x * -20).toFixed(1) + "px");
      lion.style.setProperty("--py", (y * -14).toFixed(1) + "px");
    };
    const leave = () => {
      lion.style.setProperty("--px", "0px");
      lion.style.setProperty("--py", "0px");
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section ref={heroRef} className={compact ? "hero compact" : "hero"} aria-labelledby="hero-title">
      <div className="wrap">
        <h1 id="hero-title">{title}</h1>
        <p className="lead">{lead}</p>
        <div ref={lionRef} className="hero-lion" aria-hidden="true">
          <LionArt />
        </div>
        <div className="actions">{children}</div>
      </div>
    </section>
  );
}
