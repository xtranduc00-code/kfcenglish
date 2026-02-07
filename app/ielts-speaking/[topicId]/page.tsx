"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { addQuestions, addTopicVocabItem, deleteQuestion, getQuestions, getTopic, getTopicVocab, removeTopicVocabItem, updateQuestion, updateTopicVocabItem, type SpeakingPart, type SpeakingQuestion, type Topic, type VocabItem, } from "@/lib/ielts-speaking-storage";
import { PracticeModal } from "@/components/ielts-speaking/practice-modal";
import { ArrowLeft, BookOpen, Check, Mic, Pencil, Plus, Search, Trash2, X, } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import type { TranslationKey } from "@/lib/i18n";
function AddQuestionsModal({ topicId, onClose, onAdded, t, }: {
    topicId: string;
    onClose: () => void;
    onAdded: () => void;
    t: (k: TranslationKey) => string;
}) {
    const [part, setPart] = useState<SpeakingPart>("1");
    const [text, setText] = useState("");
    async function handleAdd() {
        const trimmed = text.trim();
        if (!trimmed)
            return;
        const count = await addQuestions(topicId, part, trimmed);
        setText("");
        onAdded();
        if (count > 0)
            onClose();
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden/>
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t("addQuestions")}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" aria-label={t("ariaClose")}>
            <X className="h-5 w-5"/>
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {part === "2" ? t("addQuestionsPart2Hint") : t("addQuestionsHint")}
        </p>
        <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("partLabelShort")}
        </label>
        <select value={part} onChange={(e) => setPart(e.target.value as SpeakingPart)} className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
          <option value="1">{t("part1Option")}</option>
          <option value="2">{t("part2Option")}</option>
          <option value="3">{t("part3Option")}</option>
        </select>
        <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {part === "2" ? t("addQuestionsPart2Label") : t("addQuestionsQuestionsLabel")}
        </label>
        <textarea placeholder={part === "2" ? t("addQuestionsPart2Placeholder") : t("addQuestionsPlaceholder")} value={text} onChange={(e) => setText(e.target.value)} rows={8} className="mt-1 w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"/>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => void handleAdd()} disabled={!text.trim()} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
            {t("addToPart").replace("{part}", part)}
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>);
}
function VocabularyModal({ topicId, onClose, t, }: {
    topicId: string;
    onClose: () => void;
    t: (k: TranslationKey) => string;
}) {
    const [vocab, setVocab] = useState<VocabItem[]>([]);
    const [word, setWord] = useState("");
    const [explanation, setExplanation] = useState("");
    const [example, setExample] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editWord, setEditWord] = useState("");
    const [editExplanation, setEditExplanation] = useState("");
    const [editExample, setEditExample] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        let cancelled = false;
        getTopicVocab(topicId).then((data) => {
            if (!cancelled)
                setVocab(data);
        });
        return () => {
            cancelled = true;
        };
    }, [topicId]);
    async function refreshVocab() {
        const data = await getTopicVocab(topicId);
        setVocab(data);
    }
    async function handleAdd() {
        const w = word.trim();
        if (!w)
            return;
        await addTopicVocabItem(topicId, w, explanation.trim() || undefined, example.trim() || undefined);
        setWord("");
        setExplanation("");
        setExample("");
        await refreshVocab();
    }
    function startEdit(idx: number) {
        const item = vocab[idx];
        setEditWord(item.word);
        setEditExplanation(item.explanation ?? "");
        setEditExample(item.example ?? "");
        setEditingIndex(idx);
    }
    function cancelEdit() {
        setEditingIndex(null);
    }
    async function handleSaveEdit(idx: number) {
        const w = editWord.trim();
        if (!w)
            return;
        await updateTopicVocabItem(topicId, idx, w, editExplanation.trim() || undefined, editExample.trim() || undefined);
        cancelEdit();
        await refreshVocab();
    }
    async function handleRemove(index: number) {
        await removeTopicVocabItem(topicId, index);
        if (editingIndex === index)
            cancelEdit();
        else if (editingIndex !== null && editingIndex > index)
            setEditingIndex(editingIndex - 1);
        await refreshVocab();
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden/>
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-zinc-600 dark:text-zinc-400"/>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t("vocabAndExplanation")}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" aria-label={t("ariaClose")}>
            <X className="h-5 w-5"/>
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Review before speaking. Add words and short explanations for this topic.
        </p>

        {vocab.length > 5 && (<div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"/>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("searchPlaceholder")} className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"/>
            </div>
          </div>)}

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {t("wordPhraseLabel")} <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder="e.g. take up a hobby" value={word} onChange={(e) => setWord(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), void handleAdd())} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {t("explanationOptional")}
              </label>
              <input type="text" placeholder="e.g. to start doing a hobby" value={explanation} onChange={(e) => setExplanation(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), void handleAdd())} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"/>
            </div>
            <button type="button" onClick={() => void handleAdd()} disabled={!word.trim()} className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
              {t("add")}
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {t("exampleOptional")}
            </label>
            <textarea placeholder="e.g. I took up painting last year" value={example} onChange={(e) => setExample(e.target.value)} rows={3} className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"/>
          </div>
        </div>

        {vocab.length === 0 ? (<p className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 py-4 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
            {t("noVocabYet")}
          </p>) : (() => {
            const filtered = searchQuery.trim()
                ? vocab
                    .map((item, originalIdx) => ({ item, originalIdx }))
                    .filter(({ item }) => item.word.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                    (item.explanation?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ?? false) ||
                    (item.example?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ?? false))
                : vocab.map((item, originalIdx) => ({ item, originalIdx }));
            return filtered.length === 0 ? (<p className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 py-4 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
              {t("noSearchResults")}
            </p>) : (<ul className="mt-4 space-y-2">
            {filtered.map(({ item, originalIdx }) => (<li key={`${item.word}-${originalIdx}`} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    {editingIndex === originalIdx ? (<>
                        <input type="text" value={editWord} onChange={(e) => setEditWord(e.target.value)} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                void handleSaveEdit(originalIdx);
                            }
                            if (e.key === "Escape")
                                cancelEdit();
                        }} placeholder="Word / phrase" className="block w-full border-0 border-b border-transparent bg-transparent px-0 py-0 font-medium text-zinc-900 outline-none focus:border-amber-500 dark:text-zinc-100" autoFocus/>
                        <input type="text" value={editExplanation} onChange={(e) => setEditExplanation(e.target.value)} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                void handleSaveEdit(originalIdx);
                            }
                            if (e.key === "Escape")
                                cancelEdit();
                        }} placeholder="Explanation (optional)" className="block w-full border-0 border-b border-transparent bg-transparent px-0 py-0 text-sm text-zinc-600 outline-none focus:border-amber-500 dark:text-zinc-400"/>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm italic text-zinc-500 dark:text-zinc-400">e.g.</span>
                          <textarea value={editExample} onChange={(e) => setEditExample(e.target.value)} onKeyDown={(e) => {
                            if (e.key === "Escape")
                                cancelEdit();
                        }} placeholder="Example (optional, multiple lines OK)" rows={3} className="min-h-[4rem] w-full resize-y rounded border border-zinc-300 bg-white px-2 py-1.5 text-base text-zinc-500 outline-none focus:border-amber-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-400"/>
                        </div>
                      </>) : (<>
                        <p className="cursor-text font-medium text-zinc-900 dark:text-zinc-100" onClick={() => startEdit(originalIdx)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), startEdit(originalIdx))}>
                          {item.word}
                        </p>
                        {item.explanation && (<p className="cursor-text text-sm text-zinc-600 dark:text-zinc-400" onClick={() => startEdit(originalIdx)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), startEdit(originalIdx))}>
                            {item.explanation}
                          </p>)}
                        {item.example && (<p className="cursor-text whitespace-pre-line text-base italic text-zinc-500 dark:text-zinc-400" onClick={() => startEdit(originalIdx)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), startEdit(originalIdx))}>
                            e.g. {item.example}
                          </p>)}
                      </>)}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" onClick={() => editingIndex === originalIdx ? void handleSaveEdit(originalIdx) : startEdit(originalIdx)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300" aria-label={editingIndex === originalIdx ? t("saveButton") : t("editLabel")}>
                      {editingIndex === originalIdx ? (<Check className="h-4 w-4 text-green-600 dark:text-green-400"/>) : (<Pencil className="h-4 w-4"/>)}
                    </button>
                    {editingIndex !== originalIdx && (<button type="button" onClick={() => void handleRemove(originalIdx)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400" aria-label={t("deleteButton")}>
                        <Trash2 className="h-4 w-4"/>
                      </button>)}
                  </div>
                </div>
              </li>))}
          </ul>);
        })()}
      </div>
    </div>);
}
function parsePart2Cue(text: string): {
    question: string;
    points: string[];
} {
    const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = normalized
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    if (lines.length === 0)
        return { question: text, points: [] };
    if (lines.length === 1)
        return { question: lines[0], points: [] };
    return { question: lines[0], points: lines.slice(1) };
}
function QuestionItem({ q, onEdited, onDelete, onPractice, t, }: {
    q: SpeakingQuestion;
    onEdited: () => void;
    onDelete: (id: string) => void;
    onPractice: (q: SpeakingQuestion) => void;
    t: (k: TranslationKey) => string;
}) {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(q.text);
    const isPart2 = q.part === "2";
    const part2Parsed = isPart2 ? parsePart2Cue(q.text) : null;
    async function saveEdit() {
        const trimmed = editText.trim();
        if (trimmed && trimmed !== q.text) {
            await updateQuestion(q.id, { text: trimmed });
            onEdited();
        }
        setEditing(false);
        setEditText(q.text);
    }
    useEffect(() => {
        setEditText(q.text);
    }, [q.text]);
    return (<li className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      {editing ? (<div className="space-y-2">
          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" autoFocus/>

          <div className="flex gap-2">
            <button type="button" onClick={() => void saveEdit()} className="rounded bg-zinc-900 px-2 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
              {t("saveLabel")}
            </button>

            <button type="button" onClick={() => {
                setEditing(false);
                setEditText(q.text);
            }} className="rounded border border-zinc-200 px-2 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              {t("cancel")}
            </button>
          </div>
        </div>) : part2Parsed && part2Parsed.points.length > 0 ? (<div className="space-y-2">
          <div className="flex items-start gap-2">
            <button type="button" onClick={() => onPractice(q)} className="min-w-0 flex-1 text-left text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
              {part2Parsed.question}
            </button>

            <div className="flex shrink-0 items-start gap-0.5">
              <button type="button" onClick={() => onPractice(q)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400" title="Practice (voice + AI score)" aria-label="Practice">
                <Mic className="h-4 w-4"/>
              </button>

              <button type="button" onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" title={t("editLabel")} aria-label={t("editLabel")}>
                <Pencil className="h-4 w-4"/>
              </button>

              <button type="button" onClick={() => onDelete(q.id)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400" title={t("deleteButton")} aria-label={t("deleteButton")}>
                <Trash2 className="h-4 w-4"/>
              </button>
            </div>
          </div>

          <ol className="list-inside list-decimal space-y-1 pl-0.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {part2Parsed.points.map((point, i) => (<li key={i} className="break-words">
                {point}
              </li>))}
          </ol>
        </div>) : (<div className="flex items-start gap-2">
          <button type="button" onClick={() => onPractice(q)} className="min-w-0 flex-1 text-left text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            <span className="break-words">{q.text}</span>
          </button>

          <div className="flex shrink-0 items-start gap-0.5">
            <button type="button" onClick={() => onPractice(q)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400" title="Practice (voice + AI score)" aria-label="Practice">
              <Mic className="h-4 w-4"/>
            </button>

            <button type="button" onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" title={t("editLabel")} aria-label={t("editLabel")}>
              <Pencil className="h-4 w-4"/>
            </button>

            <button type="button" onClick={() => onDelete(q.id)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400" title={t("deleteButton")} aria-label={t("deleteButton")}>
              <Trash2 className="h-4 w-4"/>
            </button>
          </div>
        </div>)}
    </li>);
}
function QuestionList({ questions, onEdited, onDelete, onPractice, t, }: {
    questions: SpeakingQuestion[];
    onEdited: () => void;
    onDelete: (id: string) => void;
    onPractice: (q: SpeakingQuestion) => void;
    t: (k: TranslationKey) => string;
}) {
    return (<ul className="mt-3 space-y-2">
      {questions.length === 0 && (<li className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 py-4 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
          {t("noQuestionsYetAddBelow")}
        </li>)}
      {questions.map((q) => (<QuestionItem key={q.id} q={q} onEdited={onEdited} onDelete={onDelete} onPractice={onPractice} t={t}/>))}
    </ul>);
}
export default function IeltsSpeakingTopicPage() {
    const params = useParams();
    const topicId = params.topicId as string;
    const { t } = useI18n();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [part1, setPart1] = useState<SpeakingQuestion[]>([]);
    const [part2, setPart2] = useState<SpeakingQuestion[]>([]);
    const [part3, setPart3] = useState<SpeakingQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [practiceQuestion, setPracticeQuestion] = useState<SpeakingQuestion | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [vocabModalOpen, setVocabModalOpen] = useState(false);
    const [vocabCount, setVocabCount] = useState(0);
    async function refresh() {
        if (!topicId)
            return;
        setLoading(true);
        try {
            const [topicData, questions, vocab] = await Promise.all([
                getTopic(topicId),
                getQuestions(topicId),
                getTopicVocab(topicId),
            ]);
            setTopic(topicData);
            setPart1(questions.filter((q) => q.part === "1"));
            setPart2(questions.filter((q) => q.part === "2"));
            setPart3(questions.filter((q) => q.part === "3"));
            setVocabCount(vocab.length);
        }
        finally {
            setLoading(false);
        }
    }
    async function refreshVocabCount() {
        if (!topicId)
            return;
        const v = await getTopicVocab(topicId);
        setVocabCount(v.length);
    }
    useEffect(() => {
        if (topicId)
            void refresh();
    }, [topicId]);
    async function handleDelete(id: string) {
        await deleteQuestion(id);
        await refresh();
    }
    if (!topicId) {
        return (<div className="mx-auto max-w-4xl p-8">
        <p className="text-zinc-500">{t("invalidTopic")}</p>
        <Link href="/ielts-speaking" className="mt-4 inline-block text-sm text-zinc-600 underline dark:text-zinc-400">
          {t("topics")}
        </Link>
      </div>);
    }
    if (loading) {
        return (<div className="mx-auto max-w-4xl p-8">
        <p className="text-zinc-500">{t("loadingDots")}</p>
        <Link href="/ielts-speaking" className="mt-4 inline-block text-sm text-zinc-600 underline dark:text-zinc-400">
          {t("topics")}
        </Link>
      </div>);
    }
    if (!topic) {
        return (<div className="mx-auto max-w-4xl p-8">
        <p className="text-zinc-500">{t("topicNotFound")}</p>
        <Link href="/ielts-speaking" className="mt-4 inline-block text-sm text-zinc-600 underline dark:text-zinc-400">
          {t("topics")}
        </Link>
      </div>);
    }
    const PARTS: {
        id: SpeakingPart;
        label: string;
    }[] = [
        { id: "1", label: t("partLabel").replace("{n}", "1") },
        { id: "2", label: t("partLabel").replace("{n}", "2") },
        { id: "3", label: t("partLabel").replace("{n}", "3") },
    ];
    return (<div className="mx-auto max-w-5xl space-y-6">
      {practiceQuestion && (<PracticeModal question={practiceQuestion} onClose={() => setPracticeQuestion(null)}/>)}
      {addModalOpen && (<AddQuestionsModal topicId={topicId} onClose={() => setAddModalOpen(false)} onAdded={() => void refresh()} t={t}/>)}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Link href="/ielts-speaking" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          <ArrowLeft className="h-4 w-4"/>
          {t("topics")}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mic className="h-6 w-6 text-zinc-600 dark:text-zinc-400"/>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {topic.name}
            </h1>
          </div>
          <button type="button" onClick={() => setAddModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
            <Plus className="h-4 w-4"/>
            {t("addQuestions")}
          </button>
        </div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t("addEditDeleteQuestionsDesc")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setVocabModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
            <BookOpen className="h-4 w-4"/>
            {t("vocabAndExplanation")} ({vocabCount})
          </button>
        </div>
      </section>

      {vocabModalOpen && (<VocabularyModal topicId={topicId} onClose={() => {
                void refreshVocabCount();
                setVocabModalOpen(false);
            }} t={t}/>)}

      <div className="grid gap-6 lg:grid-cols-3">
        {PARTS.map(({ id, label }) => {
            const questions = id === "1" ? part1 : id === "2" ? part2 : part3;
            return (<section key={id} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {label}
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {questions.length === 1
                    ? t("questionSingular")
                    : t("questionPlural").replace("{n}", String(questions.length))}
              </p>

              <QuestionList questions={questions} onEdited={() => void refresh()} onDelete={(qId) => void handleDelete(qId)} onPractice={setPracticeQuestion} t={t}/>
            </section>);
        })}
      </div>
    </div>);
}
