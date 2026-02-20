/** Room slug rules — keep in sync with API + hub validation */
export const MEETS_ROOM_NAME_RE = /^[a-zA-Z0-9_-]{1,128}$/;

const STORAGE_KEY = "kfc-meets-recent-rooms";
const MAX_RECENT = 12;
/** Friendly label (your device only) — any reasonable text length */
export const MEETS_ROOM_LABEL_MAX = 80;

export type MeetRecentEntry = {
    room: string;
    /** Optional nickname shown in “Recent rooms” on this device only */
    label?: string;
};

export function generateMeetRoomSlug(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return `meet-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
    }
    return `meet-${Math.random().toString(36).slice(2, 12)}`;
}

export function normalizeMeetRoomLabel(raw: string | null | undefined): string | undefined {
    if (raw == null) {
        return undefined;
    }
    const t = raw.replace(/\s+/g, " ").trim().slice(0, MEETS_ROOM_LABEL_MAX);
    return t.length > 0 ? t : undefined;
}

function parseStoredList(raw: string | null): MeetRecentEntry[] {
    if (!raw) {
        return [];
    }
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) {
            return [];
        }
        const out: MeetRecentEntry[] = [];
        for (const item of parsed) {
            if (typeof item === "string" && MEETS_ROOM_NAME_RE.test(item)) {
                out.push({ room: item });
                continue;
            }
            if (item && typeof item === "object" && "room" in item) {
                const r = (item as { room?: unknown; label?: unknown }).room;
                if (typeof r !== "string" || !MEETS_ROOM_NAME_RE.test(r)) {
                    continue;
                }
                const labelRaw = (item as { label?: unknown }).label;
                const label =
                    typeof labelRaw === "string"
                        ? normalizeMeetRoomLabel(labelRaw)
                        : undefined;
                out.push(label ? { room: r, label } : { room: r });
            }
        }
        return out.slice(0, MAX_RECENT);
    }
    catch {
        return [];
    }
}

export function getRecentMeetRooms(): MeetRecentEntry[] {
    if (typeof window === "undefined") {
        return [];
    }
    return parseStoredList(window.localStorage.getItem(STORAGE_KEY));
}

function persistList(entries: MeetRecentEntry[]): void {
    if (typeof window === "undefined") {
        return;
    }
    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(entries.slice(0, MAX_RECENT)),
    );
}

/**
 * Pin room to top of recents.
 * Omit `label` to keep a previously stored display name; pass a string (incl. empty) to set/clear.
 */
export function rememberMeetRoom(room: string, label?: string): void {
    if (typeof window === "undefined" || !MEETS_ROOM_NAME_RE.test(room)) {
        return;
    }
    const prev = getRecentMeetRooms();
    const existing = prev.find((e) => e.room === room);
    const rest = prev.filter((e) => e.room !== room);
    let nextLabel: string | undefined;
    if (label === undefined) {
        nextLabel = existing?.label;
    }
    else {
        nextLabel = normalizeMeetRoomLabel(label);
    }
    const entry: MeetRecentEntry =
        nextLabel !== undefined ? { room, label: nextLabel } : { room };
    persistList([entry, ...rest]);
}

/** Update display name for a room already in recents (or add with label only). */
export function setMeetRoomLabel(room: string, label: string): void {
    if (typeof window === "undefined" || !MEETS_ROOM_NAME_RE.test(room)) {
        return;
    }
    const lab = normalizeMeetRoomLabel(label);
    const prev = getRecentMeetRooms();
    const rest = prev.filter((e) => e.room !== room);
    const entry: MeetRecentEntry =
        lab !== undefined ? { room, label: lab } : { room };
    persistList([entry, ...rest]);
}

export function removeMeetRoomFromRecent(room: string): void {
    if (typeof window === "undefined") {
        return;
    }
    persistList(getRecentMeetRooms().filter((e) => e.room !== room));
}
