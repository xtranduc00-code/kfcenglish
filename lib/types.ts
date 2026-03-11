export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type PartOfSpeech = "n" | "v" | "adj" | "adv" | "prep" | "pron" | "conj" | "det" | "interj" | "phrase" | "other";
export type DictionarySense = {
    partOfSpeech: PartOfSpeech;
    level: CEFRLevel;
    ipaUs: string;
    meaning: string;
    collocations: string[];
    phrasalVerbs: string[];
    synonyms: string[];
    antonyms: string[];
    examples: string[];
};
export type DictionaryEntry = {
    word: string;
    senses: DictionarySense[];
    wordFamily?: string[];
};
export type WordRow = {
    id: string;
    word: string;
    normalized_word: string;
    ipa_us?: string;
    is_saved: boolean;
    part_of_speech: PartOfSpeech;
    level: CEFRLevel;
    meaning: string;
    synonyms: string[];
    antonyms: string[];
    examples: string[];
    note?: string | null;
    tags?: string[];
    senses?: DictionarySense[];
    created_at: string;
    updated_at: string;
};
