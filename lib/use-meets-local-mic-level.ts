"use client";

import { useEffect, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { Track } from "livekit-client";
import { subscribeMicLevel } from "@/lib/meets-mic-level-analyser";

/**
 * Mức mic local 0–1 khi mic bật (để vẽ wave). Phụ thuộc track LiveKit đã publish.
 */
export function useMeetsLocalMicLevel(micEnabled: boolean): number {
  const room = useRoomContext();
  const [level, setLevel] = useState(0);
  const smoothRef = useRef(0);

  useEffect(() => {
    if (!micEnabled) {
      smoothRef.current = 0;
      setLevel(0);
      return;
    }

    const lp = room.localParticipant;

    const setSmoothed = (raw: number) => {
      smoothRef.current = smoothRef.current * 0.82 + raw * 0.18;
      setLevel(smoothRef.current);
    };

    let unsub: (() => void) | undefined;

    const tryAttach = () => {
      unsub?.();
      unsub = undefined;
      smoothRef.current = 0;
      setLevel(0);

      const pub = lp.getTrackPublication(Track.Source.Microphone);
      const track = pub?.track;
      if (!track || !("mediaStreamTrack" in track)) {
        return;
      }
      const mst = track.mediaStreamTrack;
      if (!mst || mst.readyState === "ended") {
        return;
      }
      unsub = subscribeMicLevel(mst, setSmoothed);
    };

    tryAttach();

    const onTrack = () => {
      tryAttach();
    };
    lp.on("localTrackPublished", onTrack);
    lp.on("localTrackUnpublished", onTrack);

    return () => {
      lp.off("localTrackPublished", onTrack);
      lp.off("localTrackUnpublished", onTrack);
      unsub?.();
      smoothRef.current = 0;
      setLevel(0);
    };
  }, [micEnabled, room]);

  return level;
}
