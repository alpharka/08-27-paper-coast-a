// Paper Coast style reminder: these primitives carry the wave-line emblem, postal-stamp details, and quiet editorial reveal used across the page.

import { useEffect, useRef, type ReactNode } from "react";

export function WaveEmblem({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="49" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" />
      <path d="M27 58.5C38 45 46 45 57 58.5C68 72 76 72 93 54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M27 67C38 53.5 46 53.5 57 67C68 80.5 77 80.5 93 62.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M57 58.5C61 55 65 55 69 58.5C72 61 72 65 69 67.5C66 70 62 70 59 67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  direction = "up",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "right";
  direction?: "up" | "down";
}) {
  return (
    <div className={`section-heading reveal swipe-heading swipe-heading--${direction} ${align === "right" ? "section-heading--right" : ""}`}>
      <div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function Reveal({ children, className = "", direction = "up" }: { children: ReactNode; className?: string; direction?: "up" | "down" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-visible");
      return;
    }
    node.classList.add("reveal-ready");
    let observer: IntersectionObserver | null = null;
    const reveal = () => {
      node.classList.add("is-visible");
      observer?.unobserve(node);
    };
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 },
    );
    observer.observe(node);
    const fallbackTimer = window.setTimeout(reveal, 1_800);
    return () => {
      observer?.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return <div ref={ref} className={`reveal reveal--${direction} ${className}`}>{children}</div>;
}

export function Stamp({ children }: { children: ReactNode }) {
  return <span className="stamp">{children}</span>;
}

export function SocialRule() {
  return <div className="social-rule" aria-hidden="true"><span /><i /><span /></div>;
}
