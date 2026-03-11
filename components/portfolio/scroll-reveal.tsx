"use client";

import React, { useRef } from "react";
import { useMainScrollReveal } from "@/lib/use-main-scroll-reveal";

type ScrollRevealAs = "div" | "section";

export function ScrollReveal({
    as = "div",
    className = "",
    delayMs = 0,
    children,
}: {
    as?: ScrollRevealAs;
    className?: string;
    /** Stagger siblings with e.g. `i * 45`. */
    delayMs?: number;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLElement | null>(null);
    useMainScrollReveal(ref);
    const combined = ["scroll-reveal", className].filter(Boolean).join(" ");
    const style =
        delayMs > 0 ? ({ "--scroll-reveal-delay": `${delayMs}ms` } as React.CSSProperties) : undefined;
    return React.createElement(as, { ref, className: combined, style, children });
}
