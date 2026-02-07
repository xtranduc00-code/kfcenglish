export function getNormalizedAnswer(value: string): string {
    return value.trim().toLowerCase();
}
export function formatCorrectAnswer(ans: string | string[]): string {
    return Array.isArray(ans) ? ans.join(", ") : ans;
}
