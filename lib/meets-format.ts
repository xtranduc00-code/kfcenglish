/** Shared mm:ss for call timer, REC chip, etc. */
export function formatMmSs(totalSec: number): string {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Safe filename segment from room display name */
export function safeMeetFileBase(roomDisplayName: string): string {
    return roomDisplayName.replace(/[^a-zA-Z0-9_-]/g, "_");
}
