"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, BookText, ChevronLeft, ChevronRight, LayoutGrid, Maximize2, Minimize2, X } from "lucide-react";
import { AddFlashcardModal, HighlightableSegment, HighlightsContext, HighlightToolbar, useFullscreen, getSelectionHighlightInfo, type Highlight, } from "@/components/ielts";
import { getReadingTest } from "@/lib/reading-data";
import { getReadingContent, type ReadingContentMap } from "@/lib/reading-content";
import { getNormalizedAnswer } from "@/lib/ielts-utils";
import { IeltsResultModal } from "@/components/ielts-result-modal";
import { useI18n } from "@/components/i18n-provider";
import type { TranslationKey } from "@/lib/i18n";
import { ExamTimer } from "@/components/exam-countdown";
import { Tooltip } from "@/components/ui/Tooltip";
import { PassageWithAnswerHighlights } from "@/components/reading/PassageWithAnswerHighlights";
import { ReadingBlockRenderer } from "@/components/reading/ReadingBlockRenderer";
const TOTAL_PARTS = 3;
const READING_PART_KEYS: Record<number, TranslationKey> = {
    1: "readingPart1",
    2: "readingPart2",
    3: "readingPart3",
};
const READING_PART_STARTS = [1, 14, 27] as const;
const READING_PART_COUNTS = [13, 13, 14] as const;
export default function ReadingTestPage() {
    const { t } = useI18n();
    const params = useParams<{
        setId: string;
        testId: string;
    }>();
    const data = useMemo(() => getReadingTest(params.setId ?? "", params.testId ?? ""), [params.setId, params.testId]);
    const content = useMemo(() => getReadingContent(params.setId ?? "", params.testId ?? ""), [params.setId, params.testId]);
    const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
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
    const [showQuestionBoard, setShowQuestionBoard] = useState(false);
    const { isFullscreen, toggleFullscreen } = useFullscreen();
    const passageRef = useRef<HTMLDivElement>(null);
    const questionsRef = useRef<HTMLDivElement>(null);
    const correctAnswers = data?.correctAnswers;
    const hasContent = content != null && "passages" in content && "parts" in content;
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
    const getSelectionSegmentInfo = useCallback(() => {
        return getSelectionHighlightInfo(window.getSelection(), highlights);
    }, [highlights]);
    useEffect(() => {
        const onMouseUp = () => {
            if (submitted) {
                setToolbar(null);
                return;
            }
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) {
                setToolbar(null);
                return;
            }
            const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
            const inPassage = range &&
                passageRef.current &&
                (passageRef.current.contains(range.startContainer) ||
                    passageRef.current.contains(range.endContainer));
            const inQuestions = range &&
                questionsRef.current &&
                (questionsRef.current.contains(range.startContainer) ||
                    questionsRef.current.contains(range.endContainer));
            if (!inPassage && !inQuestions) {
                setToolbar(null);
                return;
            }
            const info = getSelectionSegmentInfo();
            if (!info) {
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
    }, [getSelectionSegmentInfo, submitted]);
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
    const updateAnswer = useCallback((qNum: number, value: string) => {
        setAnswers((prev) => ({ ...prev, [qNum]: value }));
    }, []);
    const isCorrect = useCallback((qNum: number): boolean | null => {
        if (!submitted || !correctAnswers || correctAnswers[qNum] === undefined)
            return null;
        const user = getNormalizedAnswer(answers[qNum] ?? "");
        const expected = correctAnswers[qNum];
        if (Array.isArray(expected)) {
            return expected.some((e) => getNormalizedAnswer(e) === user);
        }
        return getNormalizedAnswer(expected) === user;
    }, [submitted, correctAnswers, answers]);
    const correctCount = correctAnswers
        ? Object.keys(correctAnswers).filter((q) => isCorrect(Number(q)) === true).length
        : 0;
    const totalCount = correctAnswers ? Object.keys(correctAnswers).length : 40;
    const resultText = correctAnswers
        ? t("resultCorrect").replace("{count}", String(correctCount)).replace("{total}", String(totalCount))
        : t("submittedNoKey");
    const handleSubmit = useCallback(() => {
        setHighlights([]);
        setToolbar(null);
        setSubmitted(true);
        setShowResultModal(true);
    }, []);
    if (!data)
        notFound();
    if (!hasContent || !content) {
        return (<div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <BookText className="h-5 w-5"/>
          <span>
            {data.set.examLabel} – {data.label}
          </span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          {t("readingNoContent")}
        </p>
        <Link href="/ielts-reading" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
          <ArrowLeft className="h-4 w-4"/>
          {t("backToTests")}
        </Link>
      </div>);
    }
    const typedContent = content as ReadingContentMap;
    const passage = typedContent.passages.find((p) => p.part === currentPart);
    const partBlocks = typedContent.parts[currentPart].blocks;
    return (<div className="ielts-exam mx-auto max-w-6xl space-y-4">
      <nav className="flex items-center justify-between rounded-b-lg border-b border-zinc-200 bg-zinc-100 px-5 py-3 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-700 text-zinc-100 dark:bg-zinc-600">
            <BookText className="h-5 w-5"/>
          </div>
          <div className="leading-tight">
            <p className="font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              {t("ieltsReadingTest")}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {data.set.examLabel} – {data.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExamTimer totalMinutes={60}/>
          <Tooltip content={t("ariaToggleFullscreen")}>
            <button type="button" onClick={toggleFullscreen} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" aria-label={t("ariaToggleFullscreen")}>
              {isFullscreen ? <Minimize2 className="h-4 w-4"/> : <Maximize2 className="h-4 w-4"/>}
            </button>
          </Tooltip>
          <Tooltip content={t("ariaBackToTestList")}>
            <Link href="/ielts-reading" className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600" aria-label={t("ariaBackToTestList")}>
              <ChevronLeft className="h-4 w-4"/>
              <span>{t("testList")}</span>
            </Link>
          </Tooltip>
        </div>
      </nav>

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <header className="flex flex-col gap-3 border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tooltip content={t("questionBoard")}>
                <button type="button" onClick={() => setShowQuestionBoard(true)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800" aria-label={t("questionBoard")}>
                  <LayoutGrid className="h-5 w-5"/>
                </button>
              </Tooltip>
              <Tooltip content={t("ariaPreviousPart")}>
                <button type="button" aria-label={t("ariaPreviousPart")} disabled={currentPart === 1} onClick={() => setCurrentPart((p) => Math.max(1, p - 1) as 1 | 2 | 3)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <ChevronLeft className="h-4 w-4"/>
                </button>
              </Tooltip>
              <span className="rounded bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                {t("partLabel").replace("{n}", String(currentPart))}
              </span>
              <span className="font-semibold">{t(READING_PART_KEYS[currentPart])}</span>
              <Tooltip content={t("ariaNextPart")}>
                <button type="button" aria-label={t("ariaNextPart")} disabled={currentPart === TOTAL_PARTS} onClick={() => setCurrentPart((p) => Math.min(TOTAL_PARTS, p + 1) as 1 | 2 | 3)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <ChevronRight className="h-4 w-4"/>
                </button>
              </Tooltip>
            </div>
          </div>
        </header>

        <HighlightsContext.Provider value={highlightsValue}>
        <div className="flex flex-col gap-0 md:flex-row">
          <div ref={passageRef} className="relative flex min-h-[280px] flex-1 flex-col overflow-hidden border-b border-zinc-200 md:max-h-[70vh] md:border-b-0 md:border-r md:border-zinc-200">
              <div className="shrink-0 p-6 pb-0">
                <div className="mb-5">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    SECTION {currentPart}
                  </p>
                  <p className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Questions {READING_PART_STARTS[currentPart - 1]} –{" "}
                    {READING_PART_STARTS[currentPart - 1] + READING_PART_COUNTS[currentPart - 1] - 1}
                  </p>
                </div>
                {submitted && (<div className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Passage
                  </div>)}
                <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {passage?.title}
                </h3>
                {submitted && correctAnswers && (<div className="mb-4 flex flex-wrap gap-1.5">
                    {Array.from({ length: READING_PART_COUNTS[currentPart - 1] }, (_, i) => {
                const qNum = READING_PART_STARTS[currentPart - 1] + i;
                const correct = isCorrect(qNum);
                const base = "flex h-7 w-7 shrink-0 items-center justify-center rounded border text-xs font-semibold transition hover:opacity-90";
                const color = correct === true
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : correct === false
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200";
                return (<Tooltip key={qNum} content={t("scrollToQuestionTooltip").replace("{n}", String(qNum))}>
                            <button type="button" onClick={() => {
                        const el = document.getElementById(`reading-answer-${qNum}`);
                        el?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }} className={`${base} ${color}`}>
                              {qNum}
                            </button>
                          </Tooltip>);
            })}
                  </div>)}
              </div>
              <div className="flex-1 overflow-y-auto p-6 pt-2">
                <div className="whitespace-pre-line text-base leading-relaxed text-zinc-700 dark:text-zinc-300 select-text">
                {submitted ? (<div data-segment-id={`passage-${currentPart}`} className="highlight-segment">
                    <PassageWithAnswerHighlights content={passage?.content ?? ""} correctAnswers={correctAnswers} partStart={READING_PART_STARTS[currentPart - 1]} partCount={READING_PART_COUNTS[currentPart - 1]} submitted={submitted}/>
                  </div>) : (<HighlightableSegment id={`passage-${currentPart}`}>
                    {passage?.content ?? ""}
                  </HighlightableSegment>)}
                </div>
              </div>
              {toolbar?.show && (<HighlightToolbar x={toolbar.x} y={toolbar.y} hasHighlightId={!!toolbar.highlightId} selectedText={toolbar.selectedText} onHighlight={handleHighlightClick} onUnhighlight={handleUnhighlightClick} onFlashcard={handleFlashcardClick}/>)}
          </div>
          <div ref={questionsRef} className="flex-1 overflow-y-auto p-6 md:max-h-[65vh]">
            <div className="space-y-6">
              {partBlocks.map((block, i) => (<div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <ReadingBlockRenderer block={block} blockIndex={i} answers={answers} updateAnswer={updateAnswer} isCorrect={isCorrect} submitted={submitted} getCorrectAnswerText={correctAnswers
                ? (q) => correctAnswers[q]
                : undefined}/>
                </div>))}
            </div>
          </div>
        </div>
        </HighlightsContext.Provider>

        {!submitted ? (<footer className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-5 dark:border-zinc-800">
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: READING_PART_COUNTS[currentPart - 1] }, (_, i) => {
                const qNum = READING_PART_STARTS[currentPart - 1] + i;
                const answered = (answers[qNum] ?? "").trim() !== "";
                return (<span key={qNum} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium ${answered
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                    {qNum}
                  </span>);
            })}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[1, 2, 3].map((section) => {
                const start = READING_PART_STARTS[section - 1];
                const count = READING_PART_COUNTS[section - 1];
                const done = Array.from({ length: count }, (_, i) => start + i).filter((q) => (answers[q] ?? "").trim() !== "").length;
                const isCurrent = currentPart === section;
                return (<div key={section} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${isCurrent
                        ? "border-red-500 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-950/50 dark:text-red-200"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                    <span className="font-medium">{t("sectionLabel").replace("{n}", String(section))}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">|</span>
                    <span>{t("doneCount").replace("{done}", String(done)).replace("{total}", String(count))}</span>
                  </div>);
            })}
              <Tooltip content={t("submit")}>
                <button type="button" onClick={() => setShowSubmitConfirm(true)} className="cursor-pointer rounded-xl bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                  {t("submit")}
                </button>
              </Tooltip>
            </div>
          </footer>) : (<div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-6 py-5 dark:border-zinc-800">
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              {resultText}
            </p>
            <div className="flex flex-wrap gap-2">
              <Tooltip content={t("retake")}>
                <button type="button" onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setShowResultModal(false);
                setCurrentPart(1);
                setHighlights([]);
            }} className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
                  ↺ {t("retake")}
                </button>
              </Tooltip>
              <Tooltip content={t("resultDetails")}>
                <button type="button" onClick={() => setShowResultModal(true)} className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
                  {t("resultDetails")}
                </button>
              </Tooltip>
            </div>
          </div>)}
      </section>

      {showQuestionBoard && (<div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 sm:items-center" onClick={() => setShowQuestionBoard(false)} role="dialog" aria-modal="true" aria-labelledby="question-board-title">
          <div className="w-full max-w-md rounded-t-2xl bg-white shadow-xl dark:bg-zinc-900 sm:max-h-[85vh] sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-zinc-500 dark:text-zinc-400"/>
                <h2 id="question-board-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("questionBoard")}
                </h2>
              </div>
              <Tooltip content={t("ariaClose")}>
                <button type="button" onClick={() => setShowQuestionBoard(false)} className="cursor-pointer rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200" aria-label={t("ariaClose")}>
                  <X className="h-5 w-5"/>
                </button>
              </Tooltip>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:max-h-[calc(85vh-8rem)]">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 40 }, (_, i) => {
                const qNum = i + 1;
                const answered = (answers[qNum] ?? "").trim() !== "";
                const section = qNum <= 13 ? 1 : qNum <= 26 ? 2 : 3;
                return (<Tooltip key={qNum} content={t("scrollToQuestionTooltip").replace("{n}", String(qNum))}>
                      <button type="button" onClick={() => {
                        setCurrentPart(section as 1 | 2 | 3);
                        setShowQuestionBoard(false);
                    }} className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition ${answered
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"}`}>
                        {qNum}
                      </button>
                    </Tooltip>);
            })}
              </div>
            </div>
          </div>
        </div>)}

      {showSubmitConfirm && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="reading-submit-confirm-title">
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h2 id="reading-submit-confirm-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t("submitConfirmTitle")}
            </h2>
            <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400">
              {t("submitConfirmBody")}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Tooltip content={t("cancel")}>
                <button type="button" onClick={() => setShowSubmitConfirm(false)} className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
                  {t("cancel")}
                </button>
              </Tooltip>
              <Tooltip content={t("submit")}>
                <button type="button" onClick={() => {
                setShowSubmitConfirm(false);
                handleSubmit();
            }} className="cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                  {t("submit")}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>)}

      {showResultModal && correctAnswers && (<IeltsResultModal onClose={() => setShowResultModal(false)} correctAnswers={correctAnswers} answers={answers} isCorrect={isCorrect} totalCount={Object.keys(correctAnswers).length}/>)}

      {showFlashcardModal && (<AddFlashcardModal initialWord={flashcardInitialWord} onClose={() => setShowFlashcardModal(false)}/>)}
    </div>);
}
