"use client";
import { useI18n } from "@/components/i18n-provider";
import { playBeep } from "@/lib/beep";
import { addPracticeAttempt, getPracticeRecord, saveDraft, type SpeakingQuestion, } from "@/lib/ielts-speaking-storage";
import { ChevronDown, ChevronRight, Mic, Timer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const PART2_PREP_SEC = 60;
const PART2_SPEAK_SEC = 120;
function formatCountdown(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}
function parsePart2Cue(text: string): {
    question: string;
    points: string[];
} {
    const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = normalized
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    if (lines.length === 0)
        return { question: text, points: [] };
    if (lines.length === 1)
        return { question: lines[0], points: [] };
    return { question: lines[0], points: lines.slice(1) };
}
let micUserMediaGate: Promise<void> = Promise.resolve();
async function withSingleMicAcquisition<T>(fn: () => Promise<T>): Promise<T> {
    await micUserMediaGate;
    let release!: () => void;
    micUserMediaGate = new Promise<void>((r) => {
        release = r;
    });
    try {
        return await fn();
    }
    finally {
        release();
    }
}
async function acquireMicrophoneStream(): Promise<MediaStream> {
    return withSingleMicAcquisition(async () => {
        const gUM = (c: MediaStreamConstraints) => navigator.mediaDevices.getUserMedia(c);
        const tries: MediaStreamConstraints[] = [
            { audio: true },
            { audio: {} },
            {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            },
        ];
        let last: unknown = new Error("getUserMedia");
        const attempt = async () => {
            for (const constraints of tries) {
                try {
                    return await gUM(constraints);
                }
                catch (e) {
                    last = e;
                }
            }
            throw last;
        };
        try {
            return await attempt();
        }
        catch {
            await new Promise((r) => setTimeout(r, 350));
            try {
                return await attempt();
            }
            catch { }
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        for (const d of devices) {
            if (d.kind !== "audioinput" || !d.deviceId)
                continue;
            try {
                return await gUM({
                    audio: { deviceId: { ideal: d.deviceId } },
                });
            }
            catch (e) {
                last = e;
            }
        }
        throw last;
    });
}
function createAudioMediaRecorder(stream: MediaStream): {
    recorder: MediaRecorder;
    blobMime: string;
    fileExt: string;
} {
    const candidates: {
        mime: string;
        ext: string;
    }[] = [
        { mime: "audio/webm;codecs=opus", ext: "webm" },
        { mime: "audio/webm", ext: "webm" },
        { mime: "audio/mp4", ext: "m4a" },
        { mime: "audio/ogg;codecs=opus", ext: "ogg" },
    ];
    for (const { mime, ext } of candidates) {
        if (!MediaRecorder.isTypeSupported(mime))
            continue;
        try {
            const recorder = new MediaRecorder(stream, { mimeType: mime });
            return {
                recorder,
                blobMime: mime.split(";")[0]!,
                fileExt: ext,
            };
        }
        catch {
        }
    }
    const recorder = new MediaRecorder(stream);
    const mt = recorder.mimeType || "audio/webm";
    const fileExt = mt.includes("mp4")
        ? "m4a"
        : mt.includes("ogg")
            ? "ogg"
            : "webm";
    return { recorder, blobMime: mt, fileExt };
}
export function PracticeModal({ question, onClose, examMode = false, }: {
    question: SpeakingQuestion;
    onClose: () => void;
    examMode?: boolean;
}) {
    const { t } = useI18n();
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [improveLoading, setImproveLoading] = useState(false);
    const [result, setResult] = useState<{
        score: number;
        feedback: string;
        improvedAnswer?: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<{
        answer: string;
        score?: number;
        feedback?: string;
        improvedAnswer?: string;
        practicedAt: string;
    }[]>([]);
    const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null);
    const isPart2 = question.part === "2";
    const [part2Phase, setPart2Phase] = useState<"prep" | "speaking" | "done" | null>(() => (question.part === "2" && examMode ? "prep" : null));
    const [countdownSeconds, setCountdownSeconds] = useState(() => question.part === "2" && examMode ? PART2_PREP_SEC : 0);
    const part2PhaseRef = useRef(part2Phase);
    part2PhaseRef.current = part2Phase;
    useEffect(() => {
        let cancelled = false;
        getPracticeRecord(question.id).then((data) => {
            if (!cancelled) {
                setTranscript(data.draft ?? "");
                setHistory(data.history ?? []);
                setResult(null);
                setError(null);
                setExpandedHistoryId(null);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [question.id]);
    useEffect(() => {
        if (!examMode || (part2Phase !== "prep" && part2Phase !== "speaking"))
            return;
        const id = setInterval(() => {
            setCountdownSeconds((s) => {
                if (s <= 1) {
                    const p = part2PhaseRef.current;
                    if (p === "prep") {
                        setPart2Phase("speaking");
                        setRecording(true);
                        return PART2_SPEAK_SEC;
                    }
                    setPart2Phase("done");
                    setRecording(false);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [part2Phase]);
    const recordingRef = useRef(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const micSessionRef = useRef(0);
    const [transcribing, setTranscribing] = useState(false);
    useEffect(() => {
        recordingRef.current = recording;
    }, [recording]);
    useEffect(() => {
        if (!recording)
            return;
        const session = ++micSessionRef.current;
        void playBeep(880, 90, 0.02);
        setError(null);
        setInterimTranscript("");
        audioChunksRef.current = [];
        if (!navigator.mediaDevices?.getUserMedia) {
            setError(t("voiceNotSupported"));
            setRecording(false);
            return;
        }
        if (typeof MediaRecorder === "undefined") {
            setError(t("voiceNotSupported"));
            setRecording(false);
            return;
        }
        void (async () => {
            let stream: MediaStream | null = null;
            try {
                stream = await acquireMicrophoneStream();
            }
            catch (err: unknown) {
                if (micSessionRef.current !== session)
                    return;
                const name = err instanceof DOMException
                    ? err.name
                    : err && typeof err === "object" && "name" in err
                        ? String((err as {
                            name: string;
                        }).name)
                        : "";
                if (name === "NotFoundError")
                    setError(t("micNotFound"));
                else if (name === "NotAllowedError" || name === "PermissionDeniedError")
                    setError(t("micPermissionDenied"));
                else
                    setError(t("couldNotStartMic"));
                setRecording(false);
                return;
            }
            if (micSessionRef.current !== session) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }
            mediaStreamRef.current = stream;
            let recorder: MediaRecorder;
            let blobMime: string;
            let fileExt: string;
            try {
                const r = createAudioMediaRecorder(stream);
                recorder = r.recorder;
                blobMime = r.blobMime;
                fileExt = r.fileExt;
            }
            catch {
                stream.getTracks().forEach((track) => track.stop());
                mediaStreamRef.current = null;
                if (micSessionRef.current === session) {
                    setError(t("couldNotStartMic"));
                    setRecording(false);
                }
                return;
            }
            if (micSessionRef.current !== session) {
                stream.getTracks().forEach((track) => track.stop());
                mediaStreamRef.current = null;
                return;
            }
            mediaRecorderRef.current = recorder;
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            recorder.onerror = () => {
                if (micSessionRef.current !== session)
                    return;
                setError(t("couldNotStartMic"));
                setRecording(false);
            };
            recorder.onstop = async () => {
                stream!.getTracks().forEach((track) => track.stop());
                mediaStreamRef.current = null;
                if (!recordingRef.current) {
                    void playBeep(660, 90, 0.02);
                }
                const blob = new Blob(audioChunksRef.current, { type: blobMime });
                audioChunksRef.current = [];
                if (blob.size === 0)
                    return;
                setTranscribing(true);
                try {
                    const formData = new FormData();
                    formData.append("audio", blob, `answer.${fileExt}`);
                    const res = await fetch("/api/ielts-speak-transcribe", {
                        method: "POST",
                        body: formData,
                    });
                    const data = await res.json();
                    if (!res.ok || !data?.text) {
                        setError(t("transcriptionFailed"));
                        return;
                    }
                    const text: string = data.text;
                    setTranscript((prev) => prev.trim() ? `${prev.trim()} ${text}` : text);
                }
                catch {
                    setError(t("networkErrorTryAgain"));
                }
                finally {
                    setTranscribing(false);
                }
            };
            try {
                recorder.start(200);
            }
            catch {
                stream.getTracks().forEach((track) => track.stop());
                mediaStreamRef.current = null;
                mediaRecorderRef.current = null;
                if (micSessionRef.current === session) {
                    setError(t("couldNotStartMic"));
                    setRecording(false);
                }
            }
        })();
        return () => {
            micSessionRef.current += 1;
            const rec = mediaRecorderRef.current;
            mediaRecorderRef.current = null;
            if (rec && rec.state !== "inactive") {
                try {
                    rec.stop();
                }
                catch {
                }
            }
            const s = mediaStreamRef.current;
            if (s) {
                s.getTracks().forEach((track) => track.stop());
                mediaStreamRef.current = null;
            }
        };
    }, [recording, t]);
    async function handleGetScore() {
        const answer = displayTranscript.trim();
        if (!answer) {
            setError(t("recordOrTypeFirst"));
            return;
        }
        setError(null);
        setResult(null);
        setLoading(true);
        try {
            const res = await fetch("/api/ielts-speak-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: question.text, answer }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || t("couldNotGetScore"));
                return;
            }
            const score = data.score ?? 0;
            const feedback = data.feedback ?? "";
            const improvedAnswer: string | undefined = typeof data.improvement === "string" ? data.improvement : undefined;
            setResult({ score, feedback, improvedAnswer });
            await addPracticeAttempt(question.id, {
                answer,
                score,
                feedback,
                improvedAnswer,
                practicedAt: new Date().toISOString(),
            });
            const next = await getPracticeRecord(question.id);
            setHistory(next.history);
            setTranscript("");
            setInterimTranscript("");
        }
        catch {
            setError(t("networkErrorTryAgain"));
        }
        finally {
            setLoading(false);
        }
    }
    const displayTranscript = transcript + (interimTranscript ? ` ${interimTranscript}` : "");
    async function handleClose() {
        await saveDraft(question.id, displayTranscript.trim());
        onClose();
    }
    const showPart2Prep = isPart2 && examMode && part2Phase === "prep";
    const showPart2Speaking = isPart2 && examMode && part2Phase === "speaking";
    const showPart2Done = isPart2 && examMode && part2Phase === "done";
    const part2AnswerDisabled = isPart2 && examMode && part2Phase === "prep";
    const showAnswerForm = true;
    return (<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => void handleClose()} aria-hidden/>
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {examMode ? t("answerModeTitle") : t("practiceModeTitle")}{" "}
            {isPart2 ? t("part2CueCard") : ""}
          </h3>
          <button type="button" onClick={() => void handleClose()} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" aria-label={t("ariaClose")}>
            <X className="h-5 w-5"/>
          </button>
        </div>

        <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("question")}
        </p>
        <div className="mt-1 min-w-0 overflow-visible rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          {isPart2 ? ((() => {
            const { question: qLine, points } = parsePart2Cue(question.text);
            return points.length > 0 ? (<>
                  <p className="font-medium">{qLine}</p>
                  <ol className="mt-2 list-inside list-decimal space-y-1 break-words pl-0.5 text-zinc-700 dark:text-zinc-300">
                    {points.map((point, i) => (<li key={i} className="break-words">
                        {point}
                      </li>))}
                  </ol>
                </>) : (<p className="break-words">{question.text}</p>);
        })()) : (<p className="break-words">{question.text}</p>)}
        </div>

        {showPart2Prep && (<div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50/80 p-6 text-center dark:border-amber-800 dark:bg-amber-950/50">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
              {t("preparationTime")}
            </p>
            <p className="mt-2 flex items-center justify-center gap-2 text-3xl font-mono font-bold text-amber-900 dark:text-amber-100">
              <Timer className="h-8 w-8"/>
              {formatCountdown(countdownSeconds)}
            </p>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              {t("prepTime1MinDesc")}
            </p>
          </div>)}

        {showPart2Speaking && (<div className="mt-4 rounded-xl border-2 border-red-200 bg-red-50/80 p-4 text-center dark:border-red-800 dark:bg-red-950/50">
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">
              {t("speakingTime")}
            </p>
            <p className="mt-1 flex items-center justify-center gap-2 text-2xl font-mono font-bold text-red-900 dark:text-red-100">
              <Timer className="h-6 w-6"/>
              {formatCountdown(countdownSeconds)}
            </p>
            <p className="mt-1 text-xs text-red-700 dark:text-red-300">
              {t("speakNowRecording")}
            </p>
          </div>)}

        {showPart2Done && (<p className="mt-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {t("timesUpReview")}
          </p>)}

        {showAnswerForm && (<>
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("yourAnswerVoice")}
            </p>
            {part2AnswerDisabled && (<p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                {t("availableWhenSpeaking")}
              </p>)}
            <textarea placeholder={part2AnswerDisabled
                ? t("prepTimePlaceholder")
                : t("clickMicOrType")} value={displayTranscript} onChange={(e) => {
                setTranscript(e.target.value);
                setInterimTranscript("");
            }} rows={4} disabled={part2AnswerDisabled} className="mt-1 w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"/>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" disabled={part2AnswerDisabled} onClick={() => {
                if (recording) {
                    recordingRef.current = false;
                    setRecording(false);
                }
                else {
                    setTranscript("");
                    setInterimTranscript("");
                    setResult(null);
                    setError(null);
                    recordingRef.current = true;
                    setRecording(true);
                }
            }} className={`inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${recording
                ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"}`} title={recording
                ? t("stopRecordingTitle")
                : t("startVoiceInputTitle")}>
                <Mic className="h-4 w-4"/>
                {recording ? t("stopButton") : t("voiceButton")}
              </button>
              {!examMode && (<button type="button" onClick={handleGetScore} disabled={loading || !displayTranscript.trim() || part2AnswerDisabled} className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                  {loading ? t("scoringDots") : t("getScoreAI")}
                </button>)}
            </div>
          </>)}
        {!examMode && error && (<p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>)}
        {!examMode && result && (<div className="mt-4 space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {t("scoreOf9").replace("{n}", String(result.score))}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {result.feedback || t("noFeedbackAvailable")}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                {t("improvementTarget")}
              </p>
              {improveLoading ? (<p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                  {t("generating")}
                </p>) : (<p className="mt-2 whitespace-pre-wrap text-sm text-emerald-800 dark:text-emerald-200">
                  {result.improvedAnswer || t("noImprovementAvailable")}
                </p>)}
            </div>
          </div>)}

        {!examMode && history.length > 0 && (<div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t("historyLabel")}
            </p>
            <ul className="mt-2 space-y-2">
              {history.map((attempt, idx) => (<li key={attempt.practicedAt + idx} className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                  <button type="button" onClick={() => setExpandedHistoryId(expandedHistoryId === idx ? null : idx)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {new Date(attempt.practicedAt).toLocaleString()}
                    </span>
                    {attempt.score != null && (<span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t("bandN").replace("{n}", String(attempt.score))}
                      </span>)}
                    {expandedHistoryId === idx ? (<ChevronDown className="h-4 w-4 shrink-0 text-zinc-500"/>) : (<ChevronRight className="h-4 w-4 shrink-0 text-zinc-500"/>)}
                  </button>
                  {expandedHistoryId === idx && (<div className="border-t border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">
                        {t("yourAnswerLabel")}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                        {attempt.answer}
                      </p>
                      <p className="mt-2 font-medium text-zinc-700 dark:text-zinc-300">
                        {t("feedbackLabel")}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                        {attempt.feedback || t("noFeedbackAvailable")}
                      </p>
                      <p className="mt-2 font-medium text-emerald-700 dark:text-emerald-300">
                        {t("improvementBand65")}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                        {attempt.improvedAnswer || t("noImprovementAvailable")}
                      </p>
                    </div>)}
                </li>))}
            </ul>
          </div>)}
      </div>
    </div>);
}
