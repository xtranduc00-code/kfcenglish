"use client";

import { useEffect, type RefObject } from "react";

/**
 * Reveal when the element intersects the main app scroll region (not window).
 * Falls back to viewport if `[data-main-scroll]` is missing (e.g. some mobile routes).
 * Respects `prefers-reduced-motion`: skips observer and shows content immediately.
 */
export function useMainScrollReveal(ref: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) {
            return;
        }
        const markVisible = () => {
            el.classList.add("scroll-reveal-visible");
        };
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            markVisible();
            return;
        }
        const root = document.querySelector("[data-main-scroll]");
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        markVisible();
                        observer.unobserve(entry.target);
                    }
                }
            },
            {
                root: root instanceof Element ? root : null,
                rootMargin: "0px 0px -8% 0px",
                threshold: [0, 0.08, 0.15],
            },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref]);
}
