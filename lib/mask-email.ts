/** Display-only obfuscation for “we sent mail to du***@gmail.com” (client already knows full address). */
export function maskEmailForDisplay(email: string): string {
    const e = email.trim().toLowerCase();
    const at = e.lastIndexOf("@");
    if (at <= 0 || at >= e.length - 1) {
        return e || "—";
    }
    const local = e.slice(0, at);
    const domain = e.slice(at + 1);
    if (local.length <= 2) {
        return `**@${domain}`;
    }
    return `${local.slice(0, 2)}***@${domain}`;
}
