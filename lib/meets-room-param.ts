import { MEETS_ROOM_NAME_RE } from "@/lib/meets-recent-rooms";

/** Decode + validate room slug from dynamic route segment. */
export function parseMeetRoomRouteParam(raw: string | undefined | null): string | null {
    if (raw == null || raw === "") {
        return null;
    }
    let room = raw;
    try {
        room = decodeURIComponent(raw);
    }
    catch {
        room = raw;
    }
    if (!room || !MEETS_ROOM_NAME_RE.test(room)) {
        return null;
    }
    return room;
}
