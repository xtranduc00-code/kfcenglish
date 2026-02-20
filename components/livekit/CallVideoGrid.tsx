"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import {
    isTrackReference,
    ParticipantPlaceholder,
    VideoTrack,
    useParticipants,
    useTracks,
} from "@livekit/components-react";
import { Pin } from "lucide-react";
import { Track } from "livekit-client";
import { useI18n } from "@/components/i18n-provider";
import {
    type MeetsVideoSubscriptionProfile,
    useMeetsTrackSubscriptionProfile,
} from "@/lib/use-meets-track-subscription-profile";

const VideoCell = memo(function VideoCell({
    trackRef,
    fit,
    minHeightClass,
    fillStage,
    subscriptionProfile,
}: {
    trackRef: TrackReferenceOrPlaceholder;
    fit: "cover" | "contain";
    minHeightClass?: string;
    fillStage?: boolean;
    subscriptionProfile: MeetsVideoSubscriptionProfile;
}) {
    useMeetsTrackSubscriptionProfile(trackRef, subscriptionProfile);

    const isScreen = trackRef.source === Track.Source.ScreenShare;
    const frame = fillStage
        ? "relative flex h-full min-h-0 w-full flex-1 overflow-hidden bg-[#2B2F36] dark:bg-black"
        : `relative flex w-full overflow-hidden rounded-lg bg-[#2B2F36] ring-1 ring-black/10 dark:bg-black dark:ring-white/[0.06] ${minHeightClass ?? "min-h-0"}`;
    return (
        <div className={frame}>
            {isTrackReference(trackRef) ? (
                <VideoTrack
                    trackRef={trackRef}
                    manageSubscription={false}
                    className="h-full w-full min-h-0 max-h-full min-w-0"
                    style={{
                        objectFit: fit,
                        maxHeight: fit === "contain" ? "100%" : undefined,
                    }}
                />
            ) : (
                <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-[#2B2F36] dark:bg-black">
                    <ParticipantPlaceholder className="h-16 w-16 text-gray-500 dark:text-zinc-500 sm:h-20 sm:w-20" />
                </div>
            )}
            <div className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm dark:rounded-lg dark:bg-black/60">
                {trackRef.participant.name || trackRef.participant.identity}
                {isScreen ? " · screen" : ""}
            </div>
        </div>
    );
});

function trackKey(trackRef: TrackReferenceOrPlaceholder): string {
    return `${trackRef.participant.identity}-${trackRef.source}-${trackRef.publication?.trackSid ?? "p"}`;
}

function fitForTrack(trackRef: TrackReferenceOrPlaceholder): "cover" | "contain" {
    return trackRef.source === Track.Source.ScreenShare ? "contain" : "cover";
}

/** Góc preview bản thân — luôn hiện khi có track camera local (kể cả một mình trong phòng). */
const LocalSelfPip = memo(function LocalSelfPip({
    trackRef,
}: {
    trackRef: TrackReferenceOrPlaceholder;
}) {
    const { t } = useI18n();
    const subscriptionProfile: MeetsVideoSubscriptionProfile = "thumbnail";
    useMeetsTrackSubscriptionProfile(trackRef, subscriptionProfile);
    const fit = fitForTrack(trackRef);

    return (
        <div
            className="pointer-events-none absolute bottom-[5.75rem] right-4 z-[38] w-[min(42vw,200px)] max-w-[220px] sm:bottom-[6rem] sm:right-5"
            data-meet-self-pip="true"
        >
            <div className="pointer-events-auto relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 ring-2 ring-white/20 shadow-[0_14px_40px_rgba(0,0,0,0.55)]">
                {isTrackReference(trackRef) ? (
                    <VideoTrack
                        trackRef={trackRef}
                        manageSubscription={false}
                        className="h-full w-full object-cover"
                        style={{ objectFit: fit }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                        <ParticipantPlaceholder className="h-12 w-12 text-zinc-500" />
                    </div>
                )}
                <div className="pointer-events-none absolute bottom-1.5 left-1.5 max-w-[calc(100%-12px)] truncate rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    {t("meetsChatYou")}
                </div>
            </div>
        </div>
    );
});

const VideoTile = memo(function VideoTile({
    trackRef,
    fit,
    minHeightClass,
    fillStage,
    tileKey,
    pinnedKey,
    onPinToggle,
    compact,
}: {
    trackRef: TrackReferenceOrPlaceholder;
    fit: "cover" | "contain";
    minHeightClass?: string;
    fillStage?: boolean;
    tileKey: string;
    pinnedKey: string | null;
    onPinToggle: (key: string) => void;
    compact?: boolean;
}) {
    const { t } = useI18n();
    const isPinned = pinnedKey === tileKey;
    const subscriptionProfile: MeetsVideoSubscriptionProfile = compact ? "thumbnail" : "main";
    return (
        <div
            className={`group relative min-h-0 ${compact ? "aspect-video w-[min(44vw,200px)] shrink-0 sm:w-52" : "h-full w-full"}`}
        >
            <VideoCell
                trackRef={trackRef}
                fit={fit}
                fillStage={fillStage}
                minHeightClass={minHeightClass}
                subscriptionProfile={subscriptionProfile}
            />
            <div
                className={`pointer-events-none absolute inset-x-0 top-0 flex justify-end p-2 ${compact ? "opacity-100 sm:opacity-0 sm:group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
            >
                <button
                    type="button"
                    className={`pointer-events-auto rounded-lg border border-white/20 bg-black/60 p-2 text-white shadow-md backdrop-blur-sm transition hover:bg-black/75 ${isPinned ? "opacity-100 ring-2 ring-amber-400/90" : ""}`}
                    title={isPinned ? t("meetsUnpinTrack") : t("meetsPinTrack")}
                    aria-label={isPinned ? t("meetsUnpinTrack") : t("meetsPinTrack")}
                    aria-pressed={isPinned}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPinToggle(tileKey);
                    }}
                >
                    <Pin className={`h-4 w-4 ${isPinned ? "fill-amber-300 text-amber-100" : ""}`} strokeWidth={2} />
                </button>
            </div>
        </div>
    );
});

const TRACK_SOURCES = [
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
] as const;

/**
 * — Grid when no screen share and nothing pinned.
 * — Meet-style focus: any screen share → main stage + camera strip; optional pin overrides main tile.
 */
export const CallVideoGrid = memo(function CallVideoGrid() {
    const { t } = useI18n();
    const [pinnedKey, setPinnedKey] = useState<string | null>(null);
    const participants = useParticipants();
    const hasRemoteParticipant = useMemo(() => participants.some((p) => !p.isLocal), [participants]);

    const tracks = useTracks([...TRACK_SOURCES], { onlySubscribed: false });

    const { cameraTracks, liveScreens, localScreen, remoteScreens, allForPinLookup, localCameraTrack } =
        useMemo(() => {
            const screenTracks = tracks.filter((tr) => tr.source === Track.Source.ScreenShare);
            const cameraTracksFiltered = tracks.filter((tr) => tr.source === Track.Source.Camera);
            const liveScreensFiltered = screenTracks.filter(isTrackReference);
            const localS = liveScreensFiltered.find((r) => r.participant.isLocal) ?? null;
            const remoteS = liveScreensFiltered.filter((r) => !r.participant.isLocal);

            const localCam =
                cameraTracksFiltered.find((tr) => tr.participant.isLocal && tr.source === Track.Source.Camera) ??
                null;

            const camerasForLayout = hasRemoteParticipant
                ? cameraTracksFiltered.filter((tr) => !tr.participant.isLocal)
                : cameraTracksFiltered;

            const all = [...camerasForLayout, ...liveScreensFiltered];
            return {
                cameraTracks: camerasForLayout,
                liveScreens: liveScreensFiltered,
                localScreen: localS,
                remoteScreens: remoteS,
                allForPinLookup: all,
                localCameraTrack: localCam,
            };
        }, [tracks, hasRemoteParticipant]);

    useEffect(() => {
        if (!pinnedKey) {
            return;
        }
        const ok = allForPinLookup.some((tr) => trackKey(tr) === pinnedKey);
        if (!ok) {
            setPinnedKey(null);
        }
    }, [allForPinLookup, pinnedKey]);

    const autoScreenFocus =
        localScreen ?? (remoteScreens.length > 0 ? remoteScreens[0] : null);

    const focusTrack = useMemo(() => {
        if (pinnedKey) {
            const hit = allForPinLookup.find((tr) => trackKey(tr) === pinnedKey);
            if (hit) {
                return hit;
            }
        }
        return autoScreenFocus;
    }, [allForPinLookup, pinnedKey, autoScreenFocus]);

    const useFocusLayout = liveScreens.length > 0 || pinnedKey !== null;

    const onPinToggle = useCallback((key: string) => {
        setPinnedKey((prev) => (prev === key ? null : key));
    }, []);

    const focusKey = focusTrack ? trackKey(focusTrack) : "";

    const stripTracks = useMemo(() => {
        if (!focusTrack) {
            return [];
        }
        const fk = trackKey(focusTrack);
        return allForPinLookup.filter((tr) => trackKey(tr) !== fk);
    }, [allForPinLookup, focusTrack]);

    /** Cameras + remote screens only (no duplicate local screen in grid). */
    const stageTiles = useMemo(
        () => [...cameraTracks, ...remoteScreens],
        [cameraTracks, remoteScreens],
    );

    const selfPip = localCameraTrack ? <LocalSelfPip trackRef={localCameraTrack} /> : null;

    if (useFocusLayout && focusTrack) {
        return (
            <div className="relative flex h-full min-h-0 w-full flex-1 flex-col gap-2 p-2 sm:gap-3 sm:p-3">
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl ring-1 ring-white/10">
                    <VideoTile
                        trackRef={focusTrack}
                        fit={fitForTrack(focusTrack)}
                        fillStage
                        tileKey={focusKey}
                        pinnedKey={pinnedKey}
                        onPinToggle={onPinToggle}
                    />
                </div>
                {stripTracks.length > 0 ? (
                    <div
                        className="flex max-h-[min(30vh,220px)] shrink-0 gap-2 overflow-x-auto overflow-y-hidden py-1 [-webkit-overflow-scrolling:touch]"
                        role="region"
                        aria-label={t("meetsFilmstripLabel")}
                    >
                        {stripTracks.map((tr) => {
                            const k = trackKey(tr);
                            return (
                                <VideoTile
                                    key={k}
                                    trackRef={tr}
                                    fit={fitForTrack(tr)}
                                    compact
                                    tileKey={k}
                                    pinnedKey={pinnedKey}
                                    onPinToggle={onPinToggle}
                                />
                            );
                        })}
                    </div>
                ) : null}
                {selfPip}
            </div>
        );
    }

    const mainStage =
        stageTiles.length === 1 ? (
            <div className="flex h-full min-h-0 w-full flex-1 items-stretch justify-center px-0 py-0">
                <div className="flex h-full min-h-0 w-full flex-1">
                    <VideoTile
                        trackRef={stageTiles[0]}
                        fit={fitForTrack(stageTiles[0])}
                        fillStage
                        tileKey={trackKey(stageTiles[0])}
                        pinnedKey={pinnedKey}
                        onPinToggle={onPinToggle}
                    />
                </div>
            </div>
        ) : (
            <div className="grid h-full min-h-0 w-full flex-1 grid-cols-1 gap-2 px-2 py-2 sm:grid-cols-2 sm:gap-3 sm:px-3 sm:py-3 md:gap-4">
                {stageTiles.map((trackRef) => {
                    const isScreen = trackRef.source === Track.Source.ScreenShare;
                    const minH = isScreen
                        ? "min-h-[200px] flex-1 sm:min-h-[240px]"
                        : "min-h-[220px] flex-1 sm:min-h-[260px]";
                    const k = trackKey(trackRef);
                    return (
                        <VideoTile
                            key={k}
                            trackRef={trackRef}
                            fit={fitForTrack(trackRef)}
                            minHeightClass={`min-h-0 ${minH}`}
                            tileKey={k}
                            pinnedKey={pinnedKey}
                            onPinToggle={onPinToggle}
                        />
                    );
                })}
            </div>
        );

    return (
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col">
            {mainStage}
            {selfPip}
        </div>
    );
});
