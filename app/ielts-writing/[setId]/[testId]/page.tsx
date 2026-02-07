"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft, BookText, Maximize2, Minimize2 } from "lucide-react";
import { getWritingTest } from "@/lib/writing-data";
import { getWritingContent } from "@/lib/writing-content";
import { useI18n } from "@/components/i18n-provider";
import { ExamTimer } from "@/components/exam-countdown";
import { AddFlashcardModal, HighlightableSegment, HighlightToolbar, HighlightsContext, type Highlight, } from "@/components/ielts";
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor").then((m) => m.RichTextEditor), { ssr: false, loading: () => <div className="min-h-[200px] animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"/> });
export default function WritingTestPage() {
    const { t } = useI18n();
    const params = useParams<{
        setId: string;
        testId: string;
    }>();
    const setId = params.setId ?? "";
    const testId = params.testId ?? "";
    const data = useMemo(() => getWritingTest(setId, testId), [setId, testId]);
    const content = useMemo(() => getWritingContent(setId, testId), [setId, testId]);
    const [task1Html, setTask1Html] = useState("");
    const [task2Html, setTask2Html] = useState("");
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
    const highlightsValue = useMemo(() => ({ highlights, addHighlight, removeHighlight }), [highlights, addHighlight, removeHighlight]);
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
    return (<div className="mx-auto max-w-4xl space-y-4">
      <nav className="flex items-center justify-between rounded-b-lg border-b border-zinc-200 bg-zinc-100 px-5 py-3 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-700 text-zinc-100 dark:bg-zinc-600">
            <BookText className="h-5 w-5"/>
          </div>
          <div className="leading-tight">
            <p className="font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              {t("ieltsWritingTest")}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {data.set.examLabel} – {data.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExamTimer totalMinutes={60}/>
          <button type="button" onClick={toggleFullscreen} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" aria-label={t("ariaToggleFullscreen")} title={t("ariaToggleFullscreen")}>
            {isFullscreen ? <Minimize2 className="h-4 w-4"/> : <Maximize2 className="h-4 w-4"/>}
          </button>
          <Link href="/ielts-writing" className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600" aria-label={t("ariaBackToTestList")}>
            <ChevronLeft className="h-4 w-4"/>
            <span>{t("testList")}</span>
          </Link>
        </div>
      </nav>

      {content ? (<div ref={contentRef} className="relative space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <HighlightsContext.Provider value={highlightsValue}>
          
          <section className="border-b border-zinc-200 pb-8 dark:border-zinc-700">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t("writingTask1")}
            </h2>
            <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t("writingTask1Desc")}
            </p>
            <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="whitespace-pre-line text-zinc-900 dark:text-zinc-100">
                <HighlightableSegment id="writing-task1-prompt">
                  {content.task1.prompt}
                </HighlightableSegment>
              </p>
            </div>
            {content.task1.imageUrl && (<div className="relative mb-4 aspect-video max-h-80 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <Image src={content.task1.imageUrl} alt={t("writingTask1ImageAlt")} fill className="object-contain" unoptimized/>
              </div>)}
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("writingTask1Label")}
            </label>
            <RichTextEditor value={task1Html} onChange={setTask1Html} placeholder={t("writingTask1Placeholder")} minHeightClassName="min-h-[200px]"/>
          </section>

          
          <section className="pt-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t("writingTask2")}
            </h2>
            <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t("writingTask2Desc")}
            </p>
            <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="whitespace-pre-line text-zinc-900 dark:text-zinc-100">
                <HighlightableSegment id="writing-task2-prompt">
                  {content.task2.prompt}
                </HighlightableSegment>
              </p>
            </div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("writingTask2Label")}
            </label>
            <RichTextEditor value={task2Html} onChange={setTask2Html} placeholder={t("writingTask2Placeholder")} minHeightClassName="min-h-[300px]"/>
          </section>
          {toolbar?.show && (<HighlightToolbar x={toolbar.x} y={toolbar.y} hasHighlightId={!!toolbar.highlightId} selectedText={toolbar.selectedText} onHighlight={handleHighlightClick} onUnhighlight={handleUnhighlightClick} onFlashcard={handleFlashcardClick}/>)}
          {showFlashcardModal && (<AddFlashcardModal initialWord={flashcardInitialWord} onClose={() => { setShowFlashcardModal(false); setFlashcardInitialWord(""); }}/>)}
          </HighlightsContext.Provider>
        </div>) : (<div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("writingNoContent")}
          </p>
        </div>)}
    </div>);
}
