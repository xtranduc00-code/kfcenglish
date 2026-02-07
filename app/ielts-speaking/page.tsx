"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { addTopic, deleteTopic, getTopics, updateTopic, type Topic, } from "@/lib/ielts-speaking-storage";
import { speakingCamSets } from "@/lib/speaking-cam-data";
import { hasSpeakingCamContent } from "@/lib/speaking-cam-content";
import { ClipboardList, FolderOpen, ListMusic, Mic, Pencil, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
export default function IeltsSpeakingPage() {
    const { t } = useI18n();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [newTopicName, setNewTopicName] = useState("");
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    async function refresh() {
        try {
            const [topicList, countMap] = await Promise.all([
                getTopics(),
                fetch("/api/ielts/question-counts").then((r) => (r.ok ? r.json() : {})),
            ]);
            setTopics(topicList);
            setCounts(countMap ?? {});
        }
        catch {
            setTopics([]);
            setCounts({});
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        void refresh();
    }, []);
    async function handleAddTopic() {
        const name = newTopicName.trim();
        if (!name)
            return;
        try {
            await addTopic(name);
            setNewTopicName("");
            setAdding(false);
            await refresh();
        }
        catch {
        }
    }
    async function handleRenameTopic(id: string, name: string) {
        const trimmed = name.trim();
        if (!trimmed)
            return;
        try {
            await updateTopic(id, trimmed);
            await refresh();
        }
        catch {
        }
    }
    async function handleDeleteTopic(id: string) {
        if (typeof window !== "undefined" && window.confirm(t("confirmDeleteTopic"))) {
            try {
                await deleteTopic(id);
                await refresh();
            }
            catch {
            }
        }
    }
    return (<div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-zinc-600 dark:text-zinc-400"/>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {t("ieltsSpeaking")}
          </h1>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t("ieltsSpeakingIntro")}
        </p>
        <Link href="/ielts-speaking/exam" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
          <ClipboardList className="h-5 w-5"/>
          {t("examPracticeAll")}
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t("topics")}</h2>
          {!adding ? (<button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
              <Plus className="h-4 w-4"/>
              {t("newTopic")}
            </button>) : (<div className="flex items-center gap-2">
              <input type="text" placeholder={t("topicNamePlaceholder")} value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} onKeyDown={(e) => {
                if (e.key === "Enter")
                    handleAddTopic();
                if (e.key === "Escape")
                    setAdding(false);
            }} autoFocus className="h-9 w-56 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"/>
              <button type="button" onClick={handleAddTopic} disabled={!newTopicName.trim()} className="h-9 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900">
                {t("add")}
              </button>
              <button type="button" onClick={() => { setAdding(false); setNewTopicName(""); }} className="h-9 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                {t("cancel")}
              </button>
            </div>)}
        </div>

        {!loading && topics.length === 0 && !adding && (<p className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
            {t("noTopicsYet")}
          </p>)}

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {loading ? (<p className="mt-4 text-sm text-zinc-500">{t("loadingDots")}</p>) : (topics.map((topic) => (<TopicFolder key={topic.id} topic={topic} questionCount={counts[topic.id] ?? 0} onRename={(newName) => handleRenameTopic(topic.id, newName)} onDelete={() => handleDeleteTopic(topic.id)} t={t}/>)))}
        </ul>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-zinc-500 dark:text-zinc-400"/>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t("cambridgeTestSets")}
          </h2>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {speakingCamSets.map((set) => (<li key={set.id} className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {set.examLabel}
                </p>
                <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {set.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {t("testsAvailable")
                .replace("{count}", String(set.tests.filter((te) => hasSpeakingCamContent(set.id, te.id)).length))
                .replace("{total}", String(set.tests.length))}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                {set.tests.map((test) => {
                const enabled = hasSpeakingCamContent(set.id, test.id);
                return enabled ? (<Link key={test.id} href={`/ielts-speaking/cam/${set.id}/${test.id}`} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
                      <span>
                        {set.examLabel} – {test.label}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {t("start")}
                      </span>
                    </Link>) : (<div key={test.id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-100/80 px-3 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-500">
                      <span>
                        {set.examLabel} – {test.label}
                      </span>
                      <span className="text-xs">{t("none")}</span>
                    </div>);
            })}
              </div>
            </li>))}
        </ul>
      </section>
    </div>);
}
function TopicFolder({ topic, questionCount, onRename, onDelete, t, }: {
    topic: Topic;
    questionCount: number;
    onRename: (newName: string) => void;
    onDelete: () => void;
    t: (key: import("@/lib/i18n").TranslationKey) => string;
}) {
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(topic.name);
    function saveRename() {
        const trimmed = editName.trim();
        if (trimmed && trimmed !== topic.name)
            onRename(trimmed);
        setEditing(false);
        setEditName(topic.name);
    }
    return (<li className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <Link href={`/ielts-speaking/${topic.id}`} className="min-w-0 flex-1 flex items-center gap-3 no-underline">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <FolderOpen className="h-5 w-5 text-zinc-600 dark:text-zinc-400"/>
        </span>
        <div className="min-w-0 flex-1">
          {editing ? (<input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} onBlur={saveRename} onKeyDown={(e) => { if (e.key === "Enter")
            saveRename(); if (e.key === "Escape")
            setEditing(false); }} autoFocus className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" onClick={(e) => e.preventDefault()}/>) : (<p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{topic.name}</p>)}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {questionCount === 1 ? t("questionSingular") : t("questionPlural").replace("{n}", String(questionCount))}
          </p>
        </div>
      </Link>
      {!editing && (<div className="flex shrink-0 gap-0.5">
          <button type="button" onClick={(e) => { e.preventDefault(); setEditing(true); setEditName(topic.name); }} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" title={t("renameTopicTitle")} aria-label={t("ariaRenameTopic")}>
            <Pencil className="h-4 w-4"/>
          </button>
          <button type="button" onClick={(e) => { e.preventDefault(); onDelete(); }} className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400" title={t("deleteTopicTitle")} aria-label={t("ariaDeleteTopic")}>
            <Trash2 className="h-4 w-4"/>
          </button>
        </div>)}
    </li>);
}
