"use client";
import { createContext, useContext, useMemo } from "react";
import { useI18n } from "@/components/i18n-provider";
import { Tooltip } from "@/components/ui/Tooltip";
export type Highlight = {
    id: string;
    segmentId: string;
    start: number;
    end: number;
};
export type HighlightsContextValue = {
    highlights: Highlight[];
    addHighlight: (segmentId: string, start: number, end: number) => void;
    removeHighlight: (id: string) => void;
};
export const HighlightsContext = createContext<HighlightsContextValue | null>(null);
export function useHighlights() {
    const ctx = useContext(HighlightsContext);
    if (!ctx)
        return { highlights: [], addHighlight: () => { }, removeHighlight: () => { } };
    return ctx;
}
export function HighlightableSegment({ id, children, as = "span", className = "", }: {
    id: string;
    children: string;
    as?: "span" | "strong";
    className?: string;
}) {
    const { t } = useI18n();
    const { highlights, removeHighlight } = useHighlights();
    const segmentHighlights = useMemo(() => highlights
        .filter((h) => h.segmentId === id)
        .sort((a, b) => a.start - b.start), [highlights, id]);
    const Tag = as === "strong" ? "strong" : "span";
    const baseClass = `highlight-segment ${className}`.trim();
    if (!segmentHighlights.length) {
        return (<Tag data-segment-id={id} className={baseClass}>
        {children}
      </Tag>);
    }
    const parts: React.ReactNode[] = [];
    let pos = 0;
    for (const h of segmentHighlights) {
        const start = Math.max(pos, h.start);
        const end = h.end;
        if (start < end) {
            if (start > pos)
                parts.push(children.slice(pos, start));
            parts.push(<Tooltip key={h.id} content={t("clickToRemoveHighlight")}>
          <mark className="cursor-pointer rounded bg-amber-200/90 px-0.5 text-inherit transition hover:bg-amber-300/90 dark:bg-amber-500/30 dark:hover:bg-amber-500/40" onClick={(e) => {
                    e.preventDefault();
                    removeHighlight(h.id);
                }}>
            {children.slice(start, end)}
          </mark>
        </Tooltip>);
            pos = end;
        }
    }
    if (pos < children.length)
        parts.push(children.slice(pos));
    return (<Tag data-segment-id={id} className={baseClass}>
      {parts}
    </Tag>);
}
