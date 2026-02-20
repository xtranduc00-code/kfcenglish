"use client";

import { memo, useCallback, useEffect, useState } from "react";
import {
    Circle,
    Clock,
    Copy,
    LogOut,
    Maximize2,
    Minimize2,
    MonitorUp,
    Share2,
    Users,
} from "lucide-react";
import { useParticipants, useRoomContext } from "@livekit/components-react";
import { ConnectionState, RoomEvent } from "livekit-client";
import { toast } from "react-toastify";
import { useI18n } from "@/components/i18n-provider";
import { formatMmSs } from "@/lib/meets-format";

type Props = {
    roomDisplayName: string;
    /** Local participant is sharing their screen — Meet-style badge, no layout switch. */
    isPresenting?: boolean;
    /** Mở bước xác nhận rời phòng (parent gọi `beginLeave` sau khi user confirm). */
    onLeaveClick: () => void;
    onToggleStageFullscreen: () => void;
    isStageFullscreen: boolean;
};

export const CallRoomHeader = memo(function CallRoomHeader({
    roomDisplayName,
    isPresenting = false,
    onLeaveClick,
    onToggleStageFullscreen,
    isStageFullscreen,
}: Props) {
    const { t } = useI18n();
    const room = useRoomContext();
    const participants = useParticipants();
    const count = participants.length;
    const [elapsedSec, setElapsedSec] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const sync = () => {
            const ok = room.state === ConnectionState.Connected;
            setConnected(ok);
            if (ok) {
                setTimerRunning(true);
            }
        };
        sync();
        room.on(RoomEvent.Connected, sync);
        room.on(RoomEvent.Reconnected, sync);
        const onDisconnected = () => {
            setTimerRunning(false);
            setElapsedSec(0);
            setConnected(false);
        };
        room.on(RoomEvent.Disconnected, onDisconnected);
        return () => {
            room.off(RoomEvent.Connected, sync);
            room.off(RoomEvent.Reconnected, sync);
            room.off(RoomEvent.Disconnected, onDisconnected);
        };
    }, [room]);

    useEffect(() => {
        if (!timerRunning) {
            return;
        }
        const id = window.setInterval(() => {
            setElapsedSec((s) => s + 1);
        }, 1000);
        return () => window.clearInterval(id);
    }, [timerRunning]);

    const peopleLabel =
        count === 1 ? t("meetsPeopleOne") : t("meetsPeopleMany").replace("{n}", String(count));

    const roomUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/call/${encodeURIComponent(roomDisplayName)}`
            : "";

    const copyRoomLink = useCallback(async () => {
        if (!roomUrl) {
            return;
        }
        try {
            await navigator.clipboard.writeText(roomUrl);
            toast.success(t("meetsLinkCopied"));
        }
        catch {
            toast.error(t("meetsCopyFailed"));
        }
    }, [roomUrl, t]);

    const shareRoomLink = useCallback(async () => {
        if (!roomUrl) {
            return;
        }
        const payload = {
            title: t("meetsHubTitle"),
            text: roomDisplayName,
            url: roomUrl,
        };
        try {
            if (typeof navigator !== "undefined" && navigator.share) {
                await navigator.share(payload);
            }
            else {
                await copyRoomLink();
            }
        }
        catch (e) {
            if ((e as Error)?.name !== "AbortError") {
                void copyRoomLink();
            }
        }
    }, [roomUrl, roomDisplayName, copyRoomLink, t]);

    return (
        <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-700/60 bg-zinc-900/95 px-3 py-2.5 backdrop-blur-md sm:px-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 md:gap-4">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {connected ? (
                        <span
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/35"
                            title={t("meetsRoomConnected")}
                        >
                            <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400" aria-hidden />
                            {t("meetsLiveBadge")}
                        </span>
                    ) : null}
                    <p
                        className="truncate font-mono text-sm font-bold tracking-tight text-zinc-50 sm:text-base"
                        title={roomDisplayName}
                    >
                        {roomDisplayName}
                    </p>
                    {isPresenting ? (
                        <span className="inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                            <MonitorUp className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                            <span className="truncate">{t("meetsYouArePresenting")}</span>
                        </span>
                    ) : null}
                </div>
                <span className="hidden h-4 w-px shrink-0 bg-zinc-600 sm:block" aria-hidden />
                <div className="flex min-w-0 flex-wrap items-center gap-3 text-xs text-zinc-400 sm:text-sm">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium">
                        <Users className="h-4 w-4 shrink-0 text-sky-400/90" strokeWidth={2} aria-hidden />
                        <span className="text-zinc-300">{peopleLabel}</span>
                    </span>
                    <span
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-zinc-800/80 px-2 py-0.5 font-mono tabular-nums text-zinc-200"
                        title={t("meetsCallTimerHint")}
                    >
                        <Clock className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
                        {formatMmSs(elapsedSec)}
                    </span>
                </div>
            </div>
            <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
                <button
                    type="button"
                    onClick={() => void copyRoomLink()}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-zinc-600/80 bg-zinc-800/80 px-3 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                    title={t("meetsCopyLink")}
                    aria-label={t("meetsCopyLink")}
                >
                    <Copy className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                    <span className="hidden sm:inline">{t("meetsCopyLink")}</span>
                </button>
                <button
                    type="button"
                    onClick={() => void shareRoomLink()}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-zinc-600/80 bg-zinc-800/80 px-3 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                    title={t("meetsShareRoomLink")}
                    aria-label={t("meetsShareRoomLink")}
                >
                    <Share2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                    <span className="hidden md:inline">{t("meetsShareRoomLink")}</span>
                </button>
                <button
                    type="button"
                    onClick={onToggleStageFullscreen}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600/80 bg-zinc-800/80 text-zinc-100 transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                    aria-label={t("ariaToggleFullscreen")}
                    title={t("ariaToggleFullscreen")}
                >
                    {isStageFullscreen ? (
                        <Minimize2 className="h-4 w-4" strokeWidth={2} />
                    ) : (
                        <Maximize2 className="h-4 w-4" strokeWidth={2} />
                    )}
                </button>
                <button
                    type="button"
                    onClick={onLeaveClick}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-red-600 px-3.5 text-sm font-bold text-white shadow-md shadow-red-900/30 transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                >
                    <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                    {t("meetsLeaveRoom")}
                </button>
            </div>
        </header>
    );
});
