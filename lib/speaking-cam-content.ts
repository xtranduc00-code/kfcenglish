import { engnovateSpeakingContent } from "./engnovate-speaking-generated/content";
export type SpeakingPartContent = {
    part1: Array<{
        number: number;
        text: string;
    }>;
    part2: Array<{
        number: number;
        text: string;
    }>;
    part3: Array<{
        number: number;
        text: string;
    }>;
};
export function hasSpeakingCamContent(setId: string, testId: string): boolean {
    const key = `${setId}|${testId}`;
    return key in engnovateSpeakingContent;
}
export function getSpeakingCamContent(setId: string, testId: string): SpeakingPartContent | null {
    const key = `${setId}|${testId}`;
    const raw = engnovateSpeakingContent[key as keyof typeof engnovateSpeakingContent];
    if (!raw)
        return null;
    return raw;
}
