"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useChat, useLocalParticipant } from "@livekit/components-react";
import { MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import { authFetch } from "@/lib/auth-context";
import { useI18n } from "@/components/i18n-provider";

type Props = {
    roomDisplayName: string;
    className?: string;
};

type ChatMsgLike = {
    timestamp?: number;
    from?: { identity?: string; name?: string };
    message?: string;
};

/** List only — avoids re-rendering bubbles while the draft input changes. */
const MeetChatMessageList = memo(function MeetChatMessageList({
    messages,
    localIdentity,
}: {
    messages: readonly ChatMsgLike[];
    localIdentity: string;
}) {
    const { t } = useI18n();

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
                <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10"
                    aria-hidden
                >
                    <MessageCircle className="h-7 w-7 text-sky-400/90" strokeWidth={1.75} />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-100">{t("meetsChatStartConversation")} 👋</p>
                    <p className="text-xs leading-relaxed text-zinc-500">{t("meetsChatStartHint")}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {messages.map((msg) => {
                const mine = msg.from?.identity === localIdentity;
                const label =
                    (mine ? t("meetsChatYou") : msg.from?.name) || msg.from?.identity || t("meetsChatAnonymous");
                const time =
                    typeof msg.timestamp === "number"
                        ? new Date(msg.timestamp).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : "";
                return (
                    <div
                        key={`${msg.timestamp}-${msg.from?.identity}-${msg.message?.slice(0, 12)}`}
                        className={`rounded-xl px-3 py-2 ${
                            mine
                                ? "ml-2 bg-sky-600/35 text-zinc-50 ring-1 ring-sky-500/30"
                                : "mr-2 bg-zinc-800/90 text-zinc-100 ring-1 ring-white/10"
                        }`}
                    >
                        <div className="mb-0.5 flex items-baseline justify-between gap-2 text-xs text-zinc-400">
                            <span className="truncate font-medium text-zinc-300">{label}</span>
                            {time ? <span className="shrink-0 tabular-nums">{time}</span> : null}
                        </div>
                        <p className="whitespace-pre-wrap break-words text-sm text-zinc-100">{msg.message}</p>
                    </div>
                );
            })}
        </>
    );
});

/** Luôn dark — đồng bộ với vùng video (Meet / Discord). */
const PANEL_SHELL =
    "flex max-h-[min(50vh,420px)] min-h-[240px] flex-col rounded-2xl border border-zinc-700/80 bg-[#1f2937] text-zinc-100 shadow-[0_8px_32px_rgba(0,0,0,0.35)] ring-1 ring-black/20 lg:max-h-none lg:min-h-0 lg:rounded-2xl lg:shadow-[0_12px_40px_rgba(0,0,0,0.4)]";

/** In-meet chat: dark surfaces aligned with call stage */
export const CallChatPanel = memo(function CallChatPanel({ roomDisplayName, className = "" }: Props) {
    const { t } = useI18n();
    const { chatMessages, send, isSending } = useChat();
    const { localParticipant } = useLocalParticipant();
    const [draft, setDraft] = useState("");
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = listRef.current;
        if (!el) {
            return;
        }
        el.scrollTop = el.scrollHeight;
    }, [chatMessages.length]);

    const submit = useCallback(async () => {
        const text = draft.trim();
        if (!text || isSending) {
            return;
        }
        setDraft("");
        try {
            await send(text);
            const persist = await authFetch("/api/meets/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ room: roomDisplayName, message: text }),
            });
            if (!persist.ok && persist.status !== 503) {
                toast.warning(t("meetsChatSaveFailed"));
            }
        }
        catch {
            setDraft(text);
        }
    }, [draft, isSending, roomDisplayName, send, t]);

    return (
        <div className={`${PANEL_SHELL} ${className}`}>
            <div className="shrink-0 border-b border-zinc-600/60 bg-zinc-900/40 px-4 py-3">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-50">{t("meetsChatTitle")}</h2>
                <p className="mt-1 text-xs leading-snug text-zinc-500">{t("meetsChatHint")}</p>
            </div>
            <div
                ref={listRef}
                className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3 text-sm sm:px-4"
            >
                <MeetChatMessageList messages={chatMessages} localIdentity={localParticipant.identity} />
            </div>
            <form
                className="flex shrink-0 gap-2 border-t border-zinc-600/60 bg-zinc-900/30 p-3 sm:p-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    void submit();
                }}
            >
                <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={t("meetsChatPlaceholder")}
                    autoComplete="off"
                    className="min-w-0 flex-1 rounded-xl border border-zinc-600/70 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/25"
                />
                <button
                    type="submit"
                    disabled={isSending || !draft.trim()}
                    className="shrink-0 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-45"
                >
                    {t("meetsChatSend")}
                </button>
            </form>
        </div>
    );
});
