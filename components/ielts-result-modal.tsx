"use client";
import { X } from "lucide-react";
import { formatCorrectAnswer, rawScoreToBand } from "@/lib/listening-utils";
import { useI18n } from "@/components/i18n-provider";
export type IeltsAnswer = string | string[];
type Props = {
    onClose: () => void;
    correctAnswers: Record<number, IeltsAnswer> | undefined;
    answers: Record<number, string>;
    isCorrect: (qNum: number) => boolean | null;
    totalCount?: number;
    onAddFlashcard?: (word: string) => void;
};
export function IeltsResultModal({ onClose, correctAnswers, answers, isCorrect, totalCount = 40, onAddFlashcard, }: Props) {
    const { t } = useI18n();
    const correctCount = correctAnswers
        ? Object.keys(correctAnswers).filter((q) => isCorrect(Number(q)) === true).length
        : 0;
    const band = correctAnswers ? rawScoreToBand(correctCount) : null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ielts-result-modal-title">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 id="ielts-result-modal-title" className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {t("bandScore").replace("{band}", String(band ?? "—"))}
          </h2>
          <div className="flex items-center gap-4 text-base text-zinc-600 dark:text-zinc-400">
            <span>{correctAnswers ? `${correctCount}/${totalCount}` : "—"}</span>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200" aria-label={t("ariaClose")}>
            <X className="h-5 w-5"/>
          </button>
        </div>
        <div className="max-h-[calc(90vh-5.5rem)] overflow-y-auto">
          <table className="w-full text-left text-base">
            <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-200">#</th>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-200">
                  {t("yourAnswer")}
                </th>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-200">
                  {t("correctAnswer")}
                </th>
                {onAddFlashcard && (<th className="w-20 px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-200">
                    {t("add")}
                  </th>)}
              </tr>
            </thead>
            <tbody>
              {correctAnswers &&
            Object.keys(correctAnswers)
                .map(Number)
                .sort((a, b) => a - b)
                .map((qNum) => {
                const correct = isCorrect(qNum);
                const userAns = answers[qNum] ?? "";
                const correctAns = correctAnswers[qNum];
                const correctStr = correctAns !== undefined ? formatCorrectAnswer(correctAns) : "";
                const wordToAdd = correctStr.split(",")[0]?.trim() || correctStr || userAns;
                return (<tr key={qNum} className={correct === true
                        ? "bg-emerald-50/80 dark:bg-emerald-950/30"
                        : "bg-rose-50/80 dark:bg-rose-950/25"}>
                        <td className="border-t border-zinc-200 px-5 py-3 font-medium dark:border-zinc-700">
                          {qNum}
                        </td>
                        <td className="border-t border-zinc-200 px-5 py-3 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
                          {userAns || "—"}
                        </td>
                        <td className="border-t border-zinc-200 px-5 py-3 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
                          {correctStr}
                        </td>
                        {onAddFlashcard && (<td className="border-t border-zinc-200 px-5 py-3 dark:border-zinc-700">
                            {wordToAdd ? (<button type="button" onClick={() => onAddFlashcard(wordToAdd)} className="rounded bg-zinc-200 px-2 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600">
                                {t("addFlashcardShort")}
                              </button>) : (<span className="text-zinc-400">—</span>)}
                          </td>)}
                      </tr>);
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
