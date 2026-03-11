"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Copy, Languages, Mic, Volume2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { playBeep } from "@/lib/beep";
declare global {
    interface Window {
        SpeechRecognition?: new () => BrowserSpeechRecognition;
        webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
        webkitAudioContext?: typeof AudioContext;
    }
    interface BrowserSpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        start(): void;
        stop(): void;
        abort?(): void;
        onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
        onend: (() => void) | null;
        onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
    }
    interface BrowserSpeechRecognitionEvent {
        resultIndex: number;
        results: BrowserSpeechRecognitionResultList;
    }
    interface BrowserSpeechRecognitionResultList {
        length: number;
        [index: number]: BrowserSpeechRecognitionResult;
    }
    interface BrowserSpeechRecognitionResult {
        isFinal: boolean;
        length: number;
        [index: number]: BrowserSpeechRecognitionAlternative;
    }
    interface BrowserSpeechRecognitionAlternative {
        transcript: string;
        confidence?: number;
    }
    interface BrowserSpeechRecognitionErrorEvent {
        error: string;
    }
}
type TranslateDirection = "vi-en" | "en-vi";
function speakTranslate(text: string, lang: "vi-VN" | "en-US") {
    if (typeof window === "undefined" ||
        !text.trim() ||
        !("speechSynthesis" in window)) {
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}
function getSpeechRecognitionCtor(): (new () => BrowserSpeechRecognition) | null {
    if (typeof window === "undefined")
        return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}
export function TranslatePanel() {
    const { t } = useI18n();
    const [translateInput, setTranslateInput] = useState("");
    const [translateResult, setTranslateResult] = useState("");
    const [translateLoading, setTranslateLoading] = useState(false);
    const [translateDirection, setTranslateDirection] = useState<TranslateDirection>("en-vi");
    const [translateListening, setTranslateListening] = useState(false);
    const [translateInterim, setTranslateInterim] = useState("");
    const [translateCopyFeedback, setTranslateCopyFeedback] = useState(false);
    const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
    const copyTimeoutRef = useRef<number | null>(null);
    const listeningIntendedRef = useRef(false);
    useEffect(() => {
        const trimmed = translateInput.trim();
        if (!trimmed) {
            setTranslateResult("");
            setTranslateLoading(false);
            return;
        }
        const timeoutId = window.setTimeout(async () => {
            setTranslateLoading(true);
            try {
                const [sourceLang, targetLang] = translateDirection === "vi-en"
                    ? ["Vietnamese", "English"]
                    : ["English", "Vietnamese"];
                const response = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: trimmed,
                        sourceLang,
                        targetLang,
                    }),
                });
                const data = (await response.json()) as {
                    translation?: string;
                    error?: string;
                };
                if (!response.ok) {
                    setTranslateResult("");
                    return;
                }
                setTranslateResult(data.translation ?? "");
            }
            catch {
                setTranslateResult("");
            }
            finally {
                setTranslateLoading(false);
            }
        }, 600);
        return () => window.clearTimeout(timeoutId);
    }, [translateInput, translateDirection]);
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                window.clearTimeout(copyTimeoutRef.current);
            }
            try {
                recognitionRef.current?.stop();
            }
            catch {
            }
            recognitionRef.current = null;
        };
    }, []);
    const sourceLabel = translateDirection === "vi-en" ? t("ariaVietnamese") : t("ariaEnglish");
    const targetLabel = translateDirection === "vi-en" ? t("ariaEnglish") : t("ariaVietnamese");
    const sourceLangCode = translateDirection === "vi-en" ? "vi-VN" : "en-US";
    const targetLangCode = translateDirection === "vi-en" ? "en-US" : "vi-VN";
    const translateDisplayValue = translateListening && translateInterim
        ? `${translateInput}${translateInput ? " " : ""}${translateInterim}`
        : translateInput;
    function stopTranslateVoice({ withEndBeep = false, }: {
        withEndBeep?: boolean;
    } = {}) {
        listeningIntendedRef.current = false;
        const recognition = recognitionRef.current;
        recognitionRef.current = null;
        if (recognition) {
            try {
                recognition.onresult = null;
                recognition.onerror = null;
                recognition.onend = null;
                recognition.stop();
            }
            catch {
            }
        }
        setTranslateListening(false);
        setTranslateInterim("");
        if (withEndBeep) {
            void playBeep(660, 90, 0.02);
        }
    }
    async function startTranslateVoice() {
        if (typeof window !== "undefined" && !window.isSecureContext) {
            return;
        }
        const SpeechRecognitionCtor = getSpeechRecognitionCtor();
        if (!SpeechRecognitionCtor) {
            return;
        }
        setTranslateInterim("");
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        catch {
            return;
        }
        const recognition = new SpeechRecognitionCtor();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
            let finalInThisEvent = "";
            let interimText = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = result[0]?.transcript?.trim();
                if (!transcript)
                    continue;
                if (result.isFinal) {
                    finalInThisEvent += (finalInThisEvent ? " " : "") + transcript;
                }
                else {
                    interimText += (interimText ? " " : "") + transcript;
                }
            }
            setTranslateInterim(interimText);
            if (finalInThisEvent) {
                setTranslateInput((prev) => {
                    const base = prev.trim();
                    return base ? `${base} ${finalInThisEvent}` : finalInThisEvent;
                });
            }
        };
        recognition.onerror = (event: BrowserSpeechRecognitionErrorEvent) => {
            const code = event.error;
            if (code === "aborted") {
                return;
            }
            stopTranslateVoice();
        };
        recognition.onend = () => {
            if (listeningIntendedRef.current &&
                recognitionRef.current === recognition) {
                try {
                    recognition.start();
                }
                catch {
                    recognitionRef.current = null;
                    setTranslateListening(false);
                    setTranslateInterim("");
                    void playBeep(660, 90, 0.02);
                }
            }
            else {
                recognitionRef.current = null;
                setTranslateListening(false);
                setTranslateInterim("");
                void playBeep(660, 90, 0.02);
            }
        };
        try {
            listeningIntendedRef.current = true;
            void playBeep(880, 90, 0.02);
            setTranslateListening(true);
            recognition.start();
        }
        catch {
            recognitionRef.current = null;
            setTranslateListening(false);
        }
    }
    function toggleTranslateVoice() {
        if (translateListening) {
            stopTranslateVoice({ withEndBeep: true });
            return;
        }
        void startTranslateVoice();
    }
    async function copyTranslateResult() {
        if (!translateResult.trim())
            return;
        try {
            await navigator.clipboard.writeText(translateResult);
            setTranslateCopyFeedback(true);
            if (copyTimeoutRef.current) {
                window.clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = window.setTimeout(() => {
                setTranslateCopyFeedback(false);
            }, 1500);
        }
        catch {
        }
    }
    function swapTranslateDirection() {
        stopTranslateVoice();
        setTranslateDirection((prev) => (prev === "vi-en" ? "en-vi" : "vi-en"));
        setTranslateInput(translateResult);
        setTranslateResult(translateInput);
    }
    return (<section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <Languages className="h-6 w-6 text-zinc-600 dark:text-zinc-400"/>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {t("translate")}
        </h2>
      </div>

      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {t("translateDesc")}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {translateDirection === "vi-en" ? t("viToEn") : t("enToVi")}
        </span>

        <button type="button" onClick={swapTranslateDirection} title={t("swapDirection")} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
          <ArrowLeftRight className="h-4 w-4"/>
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:items-start">
        <div className="flex min-h-0 flex-col">
          <label className="shrink-0 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {sourceLabel}
          </label>

          <textarea value={translateDisplayValue} onChange={(e) => {
            setTranslateInput(e.target.value);
            if (translateListening) {
                setTranslateInterim("");
            }
        }} placeholder={translateDirection === "vi-en"
            ? t("typeVietnamese")
            : t("typeEnglish")} rows={5} className="mt-1.5 min-h-[10rem] w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-700 focus:ring-1 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"/>

          <div className="mt-2 flex items-center gap-2">
            <button type="button" onClick={toggleTranslateVoice} title={translateListening ? t("stopRecordingTitle") : t("voiceInputTitle")} className={`inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${translateListening
            ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/30 dark:border-red-500 dark:bg-red-500 dark:text-white"
            : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"}`}>
              <Mic className="h-5 w-5"/>
            </button>

            <button type="button" onClick={() => speakTranslate(translateInput, sourceLangCode)} disabled={!translateInput.trim()} title={t("listenButton")} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
              <Volume2 className="h-4 w-4"/>
            </button>

            {translateListening && (<span className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("listeningDots")}
              </span>)}
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <label className="shrink-0 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {targetLabel}
          </label>

          <div className="mt-1.5 min-h-[10rem] w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100">
            {translateLoading && !translateResult && (<span className="text-zinc-500 dark:text-zinc-400">
                {t("translatingDots")}
              </span>)}

            {!translateLoading && translateResult && (<p className="whitespace-pre-wrap text-base">{translateResult}</p>)}

            {!translateLoading && !translateResult && translateInput.trim() && (<span className="text-zinc-500 dark:text-zinc-400">
                {t("waitingDots")}
              </span>)}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button type="button" onClick={() => speakTranslate(translateResult, targetLangCode)} disabled={!translateResult.trim()} title={t("listenToTranslation")} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
              <Volume2 className="h-4 w-4"/>
            </button>

            <button type="button" onClick={copyTranslateResult} disabled={!translateResult.trim()} title={t("copyTranslation")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
              <Copy className="h-4 w-4 shrink-0"/>
              <span className="text-sm">
                {translateCopyFeedback ? t("copied") : t("copyButton")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>);
}
