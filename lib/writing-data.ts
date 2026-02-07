export type WritingTest = {
    id: string;
    label: string;
    testNumber: number;
};
export type WritingSet = {
    id: string;
    title: string;
    examLabel: string;
    cambridgeNumber: number;
    variant: "academic" | "general";
    tests: WritingTest[];
};
const TEST_IDS: WritingTest[] = [
    { id: "test-1", label: "Test 1", testNumber: 1 },
    { id: "test-2", label: "Test 2", testNumber: 2 },
    { id: "test-3", label: "Test 3", testNumber: 3 },
    { id: "test-4", label: "Test 4", testNumber: 4 },
];
export const writingSets: WritingSet[] = [
    { id: "cambridge-20", title: "Cambridge IELTS 20", examLabel: "Cam 20 Academic", cambridgeNumber: 20, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-19", title: "Cambridge IELTS 19", examLabel: "Cam 19 Academic", cambridgeNumber: 19, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-18", title: "Cambridge IELTS 18", examLabel: "Cam 18 Academic", cambridgeNumber: 18, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-17", title: "Cambridge IELTS 17", examLabel: "Cam 17 Academic", cambridgeNumber: 17, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-16", title: "Cambridge IELTS 16", examLabel: "Cam 16 Academic", cambridgeNumber: 16, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-15", title: "Cambridge IELTS 15", examLabel: "Cam 15 Academic", cambridgeNumber: 15, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-14", title: "Cambridge IELTS 14", examLabel: "Cam 14 Academic", cambridgeNumber: 14, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-13", title: "Cambridge IELTS 13", examLabel: "Cam 13 Academic", cambridgeNumber: 13, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-12", title: "Cambridge IELTS 12", examLabel: "Cam 12 Academic", cambridgeNumber: 12, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-11", title: "Cambridge IELTS 11", examLabel: "Cam 11 Academic", cambridgeNumber: 11, variant: "academic", tests: [...TEST_IDS] },
    { id: "cambridge-10", title: "Cambridge IELTS 10", examLabel: "Cam 10 Academic", cambridgeNumber: 10, variant: "academic", tests: [...TEST_IDS] },
];
export function getWritingSet(setId: string): WritingSet | undefined {
    return writingSets.find((s) => s.id === setId);
}
export function getWritingTest(setId: string, testId: string): (WritingTest & {
    set: WritingSet;
}) | undefined {
    const set = getWritingSet(setId);
    if (!set)
        return undefined;
    const test = set.tests.find((t) => t.id === testId);
    if (!test)
        return undefined;
    return { ...test, set };
}
