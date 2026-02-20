"use client";

import { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";
import { ConnectionState, RoomEvent } from "livekit-client";
import { MEETS_CAMERA_CAPTURE } from "@/lib/meets-livekit-options";

/**
 * Sau connect/reconnect, đồng bộ camera với MEETS_LIVEKIT_ROOM_OPTIONS (hiện tại 1080p).
 */
export function useMeetsCamera1080Resolution() {
    const room = useRoomContext();

    useEffect(() => {
        const apply = () => {
            if (room.state !== ConnectionState.Connected) {
                return;
            }
            const lp = room.localParticipant;
            if (!lp.isCameraEnabled) {
                return;
            }
            void lp.setCameraEnabled(true, {
                resolution: MEETS_CAMERA_CAPTURE.resolution,
            });
        };
        room.on(RoomEvent.Connected, apply);
        room.on(RoomEvent.Reconnected, apply);
        apply();
        return () => {
            room.off(RoomEvent.Connected, apply);
            room.off(RoomEvent.Reconnected, apply);
        };
    }, [room]);
}

/** @deprecated Dùng useMeetsCamera1080Resolution */
export const useMeetsCamera720Resolution = useMeetsCamera1080Resolution;
