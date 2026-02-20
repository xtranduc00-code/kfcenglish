import type { LocalParticipant } from "livekit-client";
import { Track } from "livekit-client";

/**
 * MediaStream from what this participant is publishing (camera+mic, or screen+mic/audio).
 * Does not include remote participants — server-side egress would be needed for that.
 */
export function buildLocalParticipantMediaStream(lp: LocalParticipant): MediaStream | null {
    const out: MediaStreamTrack[] = [];
    const screen = lp.getTrackPublication(Track.Source.ScreenShare)?.track?.mediaStreamTrack;
    const screenAud = lp.getTrackPublication(Track.Source.ScreenShareAudio)?.track?.mediaStreamTrack;
    const cam = lp.getTrackPublication(Track.Source.Camera)?.track?.mediaStreamTrack;
    const mic = lp.getTrackPublication(Track.Source.Microphone)?.track?.mediaStreamTrack;

    if (screen) {
        out.push(screen);
        if (screenAud) {
            out.push(screenAud);
        }
        else if (mic) {
            out.push(mic);
        }
    }
    else {
        if (cam) {
            out.push(cam);
        }
        if (mic) {
            out.push(mic);
        }
    }
    if (out.length === 0) {
        return null;
    }
    return new MediaStream(out);
}

let cachedWebmMime: string | undefined | null = null;

/** First supported WebM mime; cached for the page lifetime (MediaRecorder support is stable). */
export function chooseWebmMimeType(): string | undefined {
    if (cachedWebmMime !== null) {
        return cachedWebmMime;
    }
    if (typeof MediaRecorder === "undefined") {
        cachedWebmMime = undefined;
        return undefined;
    }
    for (const type of [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
    ]) {
        if (MediaRecorder.isTypeSupported(type)) {
            cachedWebmMime = type;
            return type;
        }
    }
    cachedWebmMime = undefined;
    return undefined;
}
