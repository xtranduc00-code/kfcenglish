import { authFetch } from "@/lib/auth-context";
import { safeMeetFileBase } from "@/lib/meets-format";

/** Trigger a one-off file download in the browser. */
export function downloadBlobAsFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/** Download persisted meet chat as .txt (server-side). Returns false if request fails. */
export async function downloadMeetChatTxt(roomDisplayName: string): Promise<boolean> {
    try {
        const res = await authFetch(
            `/api/meets/session/${encodeURIComponent(roomDisplayName)}/chat.txt`,
        );
        if (!res.ok) {
            return false;
        }
        const blob = await res.blob();
        downloadBlobAsFile(blob, `meet-${safeMeetFileBase(roomDisplayName)}-chat.txt`);
        return true;
    }
    catch {
        return false;
    }
}
