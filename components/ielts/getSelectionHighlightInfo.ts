import type { Highlight } from "./HighlightContext";
export type SelectionHighlightInfo = {
    segmentId: string;
    start: number;
    end: number;
    highlightId?: string;
    x: number;
    y: number;
};
function closestSegmentEl(node: Node | null): HTMLElement | null {
    const el = node?.nodeType === Node.TEXT_NODE
        ? (node as Text).parentElement
        : (node as Element | null);
    return el?.closest?.("[data-segment-id]") as HTMLElement | null;
}
export function getSelectionHighlightInfo(sel: Selection | null, highlights: Highlight[], options?: {
    transcriptRoot?: HTMLElement | null;
}): SelectionHighlightInfo | null {
    if (!sel || sel.isCollapsed || sel.rangeCount === 0)
        return null;
    const range = sel.getRangeAt(0);
    let segment = closestSegmentEl(range.startContainer);
    if (!segment && options?.transcriptRoot?.contains(range.startContainer)) {
        segment = options.transcriptRoot.querySelector<HTMLElement>("[data-segment-id]");
    }
    if (!segment)
        return null;
    const segmentId = segment.getAttribute("data-segment-id");
    if (!segmentId)
        return null;
    const offsetTo = (node: Node, offset: number): number => {
        try {
            const r = document.createRange();
            r.setStart(segment!, 0);
            r.setEnd(node, offset);
            return r.toString().length;
        }
        catch {
            return -1;
        }
    };
    let rawStart = offsetTo(range.startContainer, range.startOffset);
    if (rawStart < 0)
        return null;
    let rawEnd: number;
    if (segment.contains(range.endContainer)) {
        rawEnd = offsetTo(range.endContainer, range.endOffset);
        if (rawEnd < 0)
            rawEnd = (segment.textContent ?? "").length;
    }
    else {
        rawEnd = (segment.textContent ?? "").length;
    }
    if (rawEnd <= rawStart)
        return null;
    const text = segment.textContent ?? "";
    const isWordChar = (ch: string) => /[\w'-]/.test(ch);
    let start = rawStart;
    let end = rawEnd;
    while (start > 0 && isWordChar(text[start - 1]))
        start--;
    while (end < text.length && isWordChar(text[end]))
        end++;
    if (start >= end)
        return null;
    const rect = range.getBoundingClientRect();
    const x = rect.width > 0 ? rect.left + rect.width / 2 : rect.left;
    const y = rect.top - 8;
    const highlightId = highlights.find((h) => h.segmentId === segmentId && start >= h.start && end <= h.end)?.id;
    return { segmentId, start, end, highlightId, x, y };
}
