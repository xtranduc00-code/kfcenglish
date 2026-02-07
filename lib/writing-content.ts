import { engnovateWritingContent } from "./engnovate-writing-generated/content";
export type WritingTaskContent = {
    task1: {
        prompt: string;
        imageUrl: string | null;
    };
    task2: {
        prompt: string;
    };
};
export function hasWritingContent(setId: string, testId: string): boolean {
    const key = `${setId}|${testId}`;
    return key in engnovateWritingContent;
}
export function getWritingContent(setId: string, testId: string): WritingTaskContent | null {
    const key = `${setId}|${testId}`;
    const raw = engnovateWritingContent[key as keyof typeof engnovateWritingContent];
    if (!raw)
        return null;
    return raw;
}
