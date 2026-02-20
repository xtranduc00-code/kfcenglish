"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Pencil, PhoneCall, Plus, Trash2, Video } from "lucide-react";
import { toast } from "react-toastify";
import { useI18n } from "@/components/i18n-provider";
import {
    generateMeetRoomSlug,
    getRecentMeetRooms,
    MEETS_ROOM_NAME_RE,
    rememberMeetRoom,
    removeMeetRoomFromRecent,
    setMeetRoomLabel,
    type MeetRecentEntry,
} from "@/lib/meets-recent-rooms";

export default function CallHubPage() {
    const { t } = useI18n();
    const router = useRouter();
    const [slug, setSlug] = useState("");
    const [hint, setHint] = useState<string | null>(null);
    const [recent, setRecent] = useState<MeetRecentEntry[]>([]);
    const [editingRoom, setEditingRoom] = useState<string | null>(null);
    const [editLabelDraft, setEditLabelDraft] = useState("");

    const refreshRecent = useCallback(() => {
        setRecent(getRecentMeetRooms());
    }, []);

    useEffect(() => {
        refreshRecent();
    }, [refreshRecent]);

    const goToRoom = useCallback(
        (room: string) => {
            rememberMeetRoom(room);
            refreshRecent();
            router.push(`/call/${encodeURIComponent(room)}`);
        },
        [router, refreshRecent],
    );

    const createMeeting = () => {
        setHint(null);
        goToRoom(generateMeetRoomSlug());
    };

    const joinMeeting = () => {
        const trimmed = slug.trim();
        const room = trimmed === "" ? generateMeetRoomSlug() : trimmed;
        if (!MEETS_ROOM_NAME_RE.test(room)) {
            setHint(t("meetsInvalidRoom"));
            return;
        }
        setHint(null);
        goToRoom(room);
    };

    const copyRoomLink = async (room: string) => {
        const url = `${typeof window !== "undefined" ? window.location.origin : ""}/call/${encodeURIComponent(room)}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success(t("meetsLinkCopied"));
        }
        catch {
            toast.error(t("meetsCopyFailed"));
        }
    };

    const removeRecent = (room: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        removeMeetRoomFromRecent(room);
        if (editingRoom === room) {
            setEditingRoom(null);
        }
        refreshRecent();
    };

    const startEditLabel = (entry: MeetRecentEntry, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingRoom(entry.room);
        setEditLabelDraft(entry.label ?? "");
    };

    const saveEditLabel = (room: string) => {
        setMeetRoomLabel(room, editLabelDraft);
        setEditingRoom(null);
        refreshRecent();
    };

    const cancelEditLabel = () => {
        setEditingRoom(null);
        setEditLabelDraft("");
    };

    const card =
        "rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#D1D5DB] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] sm:p-9 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:hover:translate-y-0 dark:hover:border-white/15 dark:hover:shadow-none dark:backdrop-blur-sm";
    const inputClass =
        "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 text-sm text-[#111827] shadow-none outline-none ring-0 placeholder:text-[#9CA3AF] focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-white/15 dark:bg-black/30 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white/25 dark:focus:ring-1 dark:focus:ring-white/20";
    /** Secondary / join — outline accent, still readable vs primary CTA */
    const actionBtn =
        "inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-[0_1px_2px_rgba(59,130,246,0.08)] transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 sm:w-auto sm:min-w-[10rem] dark:border-sky-500/35 dark:bg-white/10 dark:text-sky-100 dark:shadow-none dark:hover:border-sky-400/50 dark:hover:bg-sky-950/40 dark:focus-visible:ring-sky-400/40";
    /** Primary CTA — brand blue, highest visual weight */
    const createBtn =
        "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(59,130,246,0.55)] transition hover:bg-blue-500 hover:shadow-[0_6px_20px_-2px_rgba(59,130,246,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F7F9] dark:bg-sky-600 dark:shadow-[0_4px_18px_-4px_rgba(14,165,233,0.45)] dark:hover:bg-sky-500 dark:focus-visible:ring-sky-400/50 dark:focus-visible:ring-offset-[#0a0a0b]";

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-12 pb-10 pt-2 sm:pt-4">
            <header className="text-center sm:text-left">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-blue-50/90 px-3.5 py-1.5 text-xs font-semibold text-blue-800 shadow-[0_1px_2px_rgba(59,130,246,0.12)] dark:border-sky-500/25 dark:bg-sky-950/40 dark:text-sky-200 dark:shadow-none">
                    <Video className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400" strokeWidth={2} aria-hidden />
                    {t("meetsHubBadge")}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white">
                    {t("meetsHubTitle")}
                </h1>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#64748B] dark:text-zinc-400">
                    {t("meetsHubSubtitle")}
                </p>
            </header>

            <section className={card}>
                <div className="space-y-5">
                    <h2 className="text-base font-semibold text-[#0f172a] dark:text-zinc-100">
                        {t("meetsCreateSectionTitle")}
                    </h2>
                    <p className="-mt-2 text-sm leading-relaxed text-[#64748B] dark:text-zinc-400">
                        {t("meetsCreateSectionHint")}
                    </p>
                    <button type="button" onClick={createMeeting} className={createBtn}>
                        <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                        {t("meetsCreateMeeting")}
                    </button>
                </div>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center" aria-hidden>
                        <div className="w-full border-t border-[#E5E7EB] dark:border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-zinc-500">
                        <span className="bg-[#F6F7F9] px-3 dark:bg-[#0a0a0a]">{t("meetsOrDivider")}</span>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <h2 className="text-base font-semibold text-[#0f172a] dark:text-zinc-100">
                            {t("meetsJoinSectionTitle")}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#64748B] dark:text-zinc-400">
                            {t("meetsJoinSectionHint")}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="room-slug" className="sr-only">
                                {t("meetsRoomLabel")}
                            </label>
                            <input
                                id="room-slug"
                                type="text"
                                autoComplete="off"
                                placeholder={t("meetsRoomPlaceholder")}
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && joinMeeting()}
                                className={inputClass}
                            />
                        </div>
                        <button type="button" onClick={joinMeeting} className={actionBtn}>
                            <PhoneCall className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                            {t("meetsJoinMeeting")}
                        </button>
                    </div>
                    <p className="text-xs text-[#94A3B8] dark:text-zinc-500">{t("meetsJoinEmptyHint")}</p>
                    {hint ? (
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-300" role="alert">
                            {hint}
                        </p>
                    ) : null}
                </div>
            </section>

            {recent.length > 0 ? (
                <section>
                    <h2 className="mb-4 text-base font-semibold text-[#0f172a] dark:text-zinc-100">
                        {t("meetsRecentHeading")}
                    </h2>
                    <ul className="flex flex-col gap-3">
                        {recent.map((entry) => (
                            <li key={entry.room}>
                                <div className="group flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-[0_4px_16px_rgba(59,130,246,0.12)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none dark:hover:border-sky-500/30 dark:hover:bg-sky-950/25 dark:hover:shadow-none">
                                    {editingRoom === entry.room ? (
                                        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                                            <input
                                                type="text"
                                                autoComplete="off"
                                                value={editLabelDraft}
                                                onChange={(e) => setEditLabelDraft(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        saveEditLabel(entry.room);
                                                    }
                                                    if (e.key === "Escape") {
                                                        cancelEditLabel();
                                                    }
                                                }}
                                                className={inputClass}
                                                aria-label={t("meetsRenameRoom")}
                                            />
                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => saveEditLabel(entry.room)}
                                                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                                                >
                                                    {t("meetsSaveLabel")}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={cancelEditLabel}
                                                    className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#64748B] hover:bg-white dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/10"
                                                >
                                                    {t("meetsCancelLabel")}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/call/${encodeURIComponent(entry.room)}`}
                                            onClick={() => rememberMeetRoom(entry.room)}
                                            className="min-w-0 flex-1 text-left transition group-hover:text-blue-800 dark:group-hover:text-sky-200"
                                        >
                                            <span className="block truncate text-sm font-semibold text-[#0f172a] dark:text-zinc-100">
                                                {entry.label ?? entry.room}
                                            </span>
                                            {entry.label ? (
                                                <span className="mt-0.5 block truncate font-mono text-xs text-[#64748B] dark:text-zinc-500">
                                                    {t("meetsRoomIdCaption")}: {entry.room}
                                                </span>
                                            ) : null}
                                        </Link>
                                    )}
                                    {editingRoom === entry.room ? null : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={(e) => startEditLabel(entry, e)}
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-blue-100 hover:text-blue-700 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-sky-300"
                                                title={t("meetsRenameRoom")}
                                                aria-label={t("meetsRenameRoom")}
                                            >
                                                <Pencil className="h-4 w-4" strokeWidth={2} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => void copyRoomLink(entry.room)}
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-blue-100 hover:text-blue-700 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-sky-300"
                                                title={t("meetsCopyLink")}
                                                aria-label={t("meetsCopyLink")}
                                            >
                                                <Copy className="h-4 w-4" strokeWidth={2} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => removeRecent(entry.room, e)}
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950/60 dark:hover:text-red-300"
                                                title={t("meetsRemoveRecent")}
                                                aria-label={t("meetsRemoveRecent")}
                                            >
                                                <Trash2 className="h-4 w-4" strokeWidth={2} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </div>
    );
}
