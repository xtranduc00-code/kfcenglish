"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft, MessageCircle, Mic, Maximize2, Minimize2 } from "lucide-react";
import { AddFlashcardModal, HighlightableSegment, HighlightsContext, HighlightToolbar, type Highlight, } from "@/components/ielts";
import { getSpeakingCamTest } from "@/lib/speaking-cam-data";
import { getSpeakingCamContent } from "@/lib/speaking-cam-content";
import { useI18n } from "@/components/i18n-provider";
const AddFlashcardModalLazy = dynamic(() => import("@/components/ielts").then((m) => m.AddFlashcardModal), { ssr: false });
export default function SpeakingCamTestPage() {
    const { t } = useI18n();
    const params = useParams<{
        setId: string;
        testId: string;
    }>();
    const setId = params.setId ?? "";
    const testId = params.testId ?? "";
    const data = useMemo(() => getSpeakingCamTest(setId, testId), [setId, testId]);
    const content = useMemo(() => getSpeakingCamContent(setId, testId), [setId, testId]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [toolbar, setToolbar] = useState<{
        show: boolean;
        x: number;
        y: number;
        segmentId: string;
        start: number;
        end: number;
        highlightId?: string;
        selectedText: string;
    } | null>(null);
    const [showFlashcardModal, setShowFlashcardModal] = useState(false);
    const [flashcardInitialWord, setFlashcardInitialWord] = useState("");
    const contentRef = useRef<HTMLDivElement>(null);
    const addHighlight = useCallback((segmentId: string, start: number, end: number) => {
        if (start >= end)
            return;
        setHighlights((prev) => [
            ...prev,
            { id: crypto.randomUUID(), segmentId, start, end },
        ]);
    }, []);
    const removeHighlight = useCallback((id: string) => {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
    }, []);
    const getSelectionSegmentInfo = useCallback((): {
        segmentId: string;
        start: number;
        end: number;
        highlightId?: string;
        x: number;
        y: number;
    } | null => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed)
            return null;
        let el: Node | null = sel.anchorNode;
        if (!el)
            return null;
        while (el && el.nodeType !== Node.ELEMENT_NODE)
            el = el.parentNode;
        const segment = (el as Element)?.closest?.("[data-segment-id]") as HTMLElement | null;
        if (!segment)
            return null;
        const segmentId = segment.getAttribute("data-segment-id");
        if (!segmentId)
            return null;
        try {
            const range = sel.getRangeAt(0);
            const r = document.createRange();
            r.setStart(segment, 0);
            r.setEnd(range.startContainer, range.startOffset);
            const rawStart = r.toString().length;
            r.setStart(segment, 0);
            r.setEnd(range.endContainer, range.endOffset);
            const rawEnd = r.toString().length;
            if (rawStart >= rawEnd)
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
            const highlightId = highlights.find((h) => h.segmentId === segmentId && start >= h.start && end <= h.end)?.id;
            return {
                segmentId,
                start,
                end,
                highlightId,
                x: rect.left + rect.width / 2,
                y: rect.top - 8,
            };
        }
        catch {
            return null;
        }
    }, [highlights]);
    useEffect(() => {
        const onMouseUp = () => {
            if (!contentRef.current)
                return;
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) {
                setToolbar(null);
                return;
            }
            const info = getSelectionSegmentInfo();
            if (!info || !contentRef.current.contains(sel.anchorNode)) {
                setToolbar(null);
                return;
            }
            setToolbar({
                show: true,
                x: info.x,
                y: info.y,
                segmentId: info.segmentId,
                start: info.start,
                end: info.end,
                highlightId: info.highlightId,
                selectedText: sel.toString(),
            });
        };
        document.addEventListener("mouseup", onMouseUp);
        return () => document.removeEventListener("mouseup", onMouseUp);
    }, [getSelectionSegmentInfo]);
    const handleHighlightClick = useCallback(() => {
        if (!toolbar)
            return;
        addHighlight(toolbar.segmentId, toolbar.start, toolbar.end);
        window.getSelection()?.removeAllRanges();
        setToolbar(null);
    }, [toolbar, addHighlight]);
    const handleUnhighlightClick = useCallback(() => {
        if (!toolbar?.highlightId)
            return;
        removeHighlight(toolbar.highlightId);
        window.getSelection()?.removeAllRanges();
        setToolbar(null);
    }, [toolbar, removeHighlight]);
    const handleFlashcardClick = useCallback((word: string) => {
        setFlashcardInitialWord(word);
        setShowFlashcardModal(true);
        window.getSelection()?.removeAllRanges();
        setToolbar(null);
    }, []);
    const toggleFullscreen = useCallback(() => {
        if (typeof document === "undefined")
            return;
        const doc = document as Document & {
            webkitFullscreenElement?: Element;
            webkitExitFullscreen?: () => Promise<void>;
        };
        const el = document.documentElement as HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void>;
        };
        if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
            if (el.requestFullscreen)
                el.requestFullscreen();
            else if (el.webkitRequestFullscreen)
                el.webkitRequestFullscreen();
            setIsFullscreen(true);
        }
        else {
            if (doc.exitFullscreen)
                doc.exitFullscreen();
            else if (doc.webkitExitFullscreen)
                doc.webkitExitFullscreen();
            setIsFullscreen(false);
        }
    }, []);
    if (!data)
        notFound();
    return (<div className="mx-auto max-w-3xl space-y-4">
      <nav className="flex items-center justify-between rounded-b-lg border-b border-zinc-200 bg-zinc-100 px-5 py-3 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-700 text-zinc-100 dark:bg-zinc-600">
            <Mic className="h-5 w-5"/>
          </div>
          <div className="leading-tight">
            <p className="font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              {t("ieltsSpeakingTest")}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {data.set.examLabel} – {data.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleFullscreen} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" aria-label={t("ariaToggleFullscreen")} title={t("ariaToggleFullscreen")}>
            {isFullscreen ? <Minimize2 className="h-4 w-4"/> : <Maximize2 className="h-4 w-4"/>}
          </button>
          <Link href="/ielts-speaking" className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600" aria-label={t("ariaBackToTestList")}>
            <ChevronLeft className="h-4 w-4"/>
            <span>{t("testList")}</span>
          </Link>
        </div>
      </nav>

      {content ? (<HighlightsContext.Provider value={{
                highlights,
                addHighlight,
                removeHighlight,
            }}>
          <div ref={contentRef} className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {content.part1.length > 0 && (<section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  <MessageCircle className="h-5 w-5"/>
                  {t("speakingPart1")}
                </h2>
                <ul className="space-y-3">
                  {content.part1.map((q) => (<li key={q.number} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {t("speakingQuestionN").replace("{n}", String(q.number))}
                      </span>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                        <HighlightableSegment id={`speaking-p1-q${q.number}`}>
                          {q.text}
                        </HighlightableSegment>
                      </p>
                    </li>))}
                </ul>
              </section>)}

            {content.part2.length > 0 && (<section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  <MessageCircle className="h-5 w-5"/>
                  {t("speakingPart2CueCard")}
                </h2>
                <ul className="space-y-3">
                  {content.part2.map((q) => (<li key={q.number} className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        {t("speakingQuestionN").replace("{n}", String(q.number))}
                      </span>
                      <p className="mt-1 whitespace-pre-line text-zinc-900 dark:text-zinc-100">
                        <HighlightableSegment id={`speaking-p2-q${q.number}`}>
                          {q.text}
                        </HighlightableSegment>
                      </p>
                    </li>))}
                </ul>
              </section>)}

            {content.part3.length > 0 && (<section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  <MessageCircle className="h-5 w-5"/>
                  {t("speakingPart3")}
                </h2>
                <ul className="space-y-3">
                  {content.part3.map((q) => (<li key={q.number} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {t("speakingQuestionN").replace("{n}", String(q.number))}
                      </span>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                        <HighlightableSegment id={`speaking-p3-q${q.number}`}>
                          {q.text}
                        </HighlightableSegment>
                      </p>
                    </li>))}
                </ul>
              </section>)}
          </div>

          {toolbar?.show && (<HighlightToolbar x={toolbar.x} y={toolbar.y} hasHighlightId={!!toolbar.highlightId} selectedText={toolbar.selectedText} onHighlight={handleHighlightClick} onUnhighlight={handleUnhighlightClick} onFlashcard={handleFlashcardClick}/>)}

          {showFlashcardModal && (<AddFlashcardModalLazy initialWord={flashcardInitialWord} onClose={() => {
                    setShowFlashcardModal(false);
                    setFlashcardInitialWord("");
                }}/>)}
        </HighlightsContext.Provider>) : (<div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("speakingCamNoContent")}
          </p>
        </div>)}
    </div>);
}
