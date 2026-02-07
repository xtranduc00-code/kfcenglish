export const inputClass = (correct: boolean | null, width = "w-28") => `h-8 ${width} rounded-md border px-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed dark:bg-zinc-950 dark:text-zinc-100 ${correct === true
    ? "border-emerald-500 bg-emerald-50/80 focus:ring-emerald-300 dark:border-emerald-600 dark:bg-emerald-950/40 dark:focus:ring-emerald-800"
    : correct === false
        ? "border-rose-400 bg-rose-50/80 focus:ring-rose-300 dark:border-rose-600 dark:bg-rose-950/40 dark:focus:ring-rose-900"
        : "border-zinc-300 focus:border-zinc-900 focus:ring-zinc-300 dark:border-zinc-600 dark:focus:border-zinc-400 dark:focus:ring-zinc-700"}`;
export const selectClass = (correct: boolean | null) => `h-10 min-w-[3.5rem] rounded-md border px-3 text-base text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed dark:bg-zinc-950 dark:text-zinc-100 ${correct === true
    ? "border-emerald-500 bg-emerald-50/80 focus:ring-emerald-300 dark:border-emerald-600 dark:bg-emerald-950/40 dark:focus:ring-emerald-800"
    : correct === false
        ? "border-rose-400 bg-rose-50/80 focus:ring-rose-300 dark:border-rose-600 dark:bg-rose-950/40 dark:focus:ring-rose-900"
        : "border-zinc-300 focus:border-zinc-900 dark:border-zinc-600 dark:focus:border-zinc-400"}`;
export const tickClass = (correct: boolean | null) => correct === true
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
export const notesContentClass = "text-base leading-relaxed text-zinc-900 dark:text-zinc-50 [&_input]:h-8 [&_input]:min-w-[6.5rem] [&_input]:border-zinc-300 [&_input]:bg-white [&>span]:align-baseline dark:[&_input]:border-zinc-600 dark:[&_input]:bg-zinc-950 [&_.whitespace-pre-line]:leading-6 [&>*:first-child]:mt-0 [&>*:first-child]:pt-0";
export const notesSectionGapClass = "mt-1.5 border-t border-zinc-200 pt-1 dark:border-zinc-700";
export const notesTitleCenteredClass = "text-center text-xl font-bold text-zinc-900 dark:text-zinc-100";
export const notesSubtitleClass = "text-center text-sm italic text-zinc-700 dark:text-zinc-300 mt-0.5";
export const ieltsTitleClass = "font-semibold text-zinc-800 dark:text-zinc-200";
export const ieltsQuestionTextClass = "font-normal text-zinc-600 dark:text-zinc-300";
export const ieltsOptionClass = "font-normal text-zinc-500 dark:text-zinc-400";
export const ieltsRadioClass = "mt-1 h-4 w-4 shrink-0 rounded-full border-zinc-300 text-zinc-900 focus:ring-zinc-400 disabled:cursor-not-allowed dark:border-zinc-600 dark:bg-zinc-800";
export const ieltsSectionCardClass = "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80 dark:shadow-none";
export const listeningTitleClass = ieltsTitleClass;
export const listeningQuestionTextClass = ieltsQuestionTextClass;
export const listeningOptionClass = ieltsOptionClass;
export const listeningRadioClass = ieltsRadioClass;
export const listeningSectionCardClass = ieltsSectionCardClass;
