"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalParticipant } from "@livekit/components-react";
import { toast } from "react-toastify";
import { useI18n } from "@/components/i18n-provider";
import { buildLocalParticipantMediaStream, chooseWebmMimeType } from "@/lib/meets-local-recording";

export type PendingMeetRecording = {
    blob: Blob;
    mimeType: string;
};

/**
 * Local MediaRecorder: in-call REC timer + toasts; blob kept for post-call download (not auto-saved on stop).
 */
export function useMeetsLocalRecording() {
    const { t } = useI18n();
    const { localParticipant } = useLocalParticipant();
    const localParticipantRef = useRef(localParticipant);
    localParticipantRef.current = localParticipant;

    const [isRecording, setIsRecording] = useState(false);
    const [recordingElapsedSec, setRecordingElapsedSec] = useState(0);
    const [busyRec, setBusyRec] = useState<"start" | "stop" | null>(null);
    const [pendingRecording, setPendingRecording] = useState<PendingMeetRecording | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    /** Resolved after MediaRecorder `stop` → `onstop` (so Leave can await finalize). */
    const onStopWaitersRef = useRef<Array<() => void>>([]);

    const flushStopWaiters = useCallback(() => {
        const waiters = onStopWaitersRef.current;
        onStopWaitersRef.current = [];
        waiters.forEach((fn) => fn());
    }, []);

    useEffect(() => {
        if (!isRecording) {
            return;
        }
        setRecordingElapsedSec(0);
        const id = window.setInterval(() => {
            setRecordingElapsedSec((s) => s + 1);
        }, 1000);
        return () => window.clearInterval(id);
    }, [isRecording]);

    const clearPendingRecording = useCallback(() => {
        setPendingRecording(null);
    }, []);

    const startRecording = useCallback(() => {
        setBusyRec("start");
        try {
            const stream = buildLocalParticipantMediaStream(localParticipantRef.current);
            if (!stream) {
                toast.error(t("meetsRecordingNeedMedia"));
                return;
            }
            const mimeType = chooseWebmMimeType();
            let mr: MediaRecorder;
            try {
                mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
            }
            catch {
                toast.error(t("meetsRecordingStartFailed"));
                return;
            }
            chunksRef.current = [];
            mr.ondataavailable = (ev) => {
                if (ev.data.size > 0) {
                    chunksRef.current.push(ev.data);
                }
            };
            mr.onstop = () => {
                const type = mr.mimeType || mimeType || "video/webm";
                const blob = new Blob(chunksRef.current, { type });
                chunksRef.current = [];
                recorderRef.current = null;
                setIsRecording(false);
                setBusyRec(null);
                if (blob.size < 1) {
                    toast.warning(t("meetsRecordingEmpty"));
                }
                else {
                    setPendingRecording({ blob, mimeType: type });
                    toast.success(t("meetsToastRecordingStopped"));
                }
                flushStopWaiters();
            };
            mr.onerror = () => {
                toast.error(t("meetsRecordingStartFailed"));
                recorderRef.current = null;
                setIsRecording(false);
                setBusyRec(null);
                flushStopWaiters();
            };
            mr.start(1000);
            recorderRef.current = mr;
            setIsRecording(true);
            toast.success(t("meetsToastRecordingStarted"));
        }
        finally {
            setBusyRec(null);
        }
    }, [flushStopWaiters, t]);

    const stopRecording = useCallback((): Promise<void> => {
        const mr = recorderRef.current;
        if (!mr || mr.state !== "recording") {
            setIsRecording(false);
            return Promise.resolve();
        }
        setBusyRec("stop");
        return new Promise<void>((resolve) => {
            const done = () => {
                setBusyRec(null);
                resolve();
            };
            onStopWaitersRef.current.push(done);
            try {
                mr.stop();
            }
            catch {
                onStopWaitersRef.current = onStopWaitersRef.current.filter((f) => f !== done);
                setBusyRec(null);
                resolve();
            }
        });
    }, []);

    useEffect(() => {
        return () => {
            const mr = recorderRef.current;
            if (mr && mr.state === "recording") {
                try {
                    mr.stop();
                }
                catch {
                    /* ignore */
                }
            }
        };
    }, []);

    return {
        isRecording,
        recordingElapsedSec,
        busyRec,
        startRecording,
        stopRecording,
        pendingRecording,
        clearPendingRecording,
    };
}
