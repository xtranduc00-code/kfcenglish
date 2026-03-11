"use client";
import { HighlightableSegment, tickClass, inputClass, selectClass } from "@/components/ielts";
import type { ReadingQuestionBlock } from "@/lib/reading-content";
function formatCorrectAnswer(ans: string | string[] | undefined): string {
    if (ans == null)
        return "";
    return Array.isArray(ans) ? ans.join(" / ") : String(ans);
}
const readingInputClass = (correct: boolean | null) => inputClass(correct, "min-w-[7rem]");
export type ReadingBlockRendererProps = {
    block: ReadingQuestionBlock;
    blockIndex: number;
    answers: Record<number, string>;
    updateAnswer: (qNum: number, value: string) => void;
    isCorrect: (qNum: number) => boolean | null;
    submitted: boolean;
    getCorrectAnswerText?: (qNum: number) => string | string[] | undefined;
};
export function ReadingBlockRenderer({ block, blockIndex, answers, updateAnswer, isCorrect, submitted, getCorrectAnswerText, }: ReadingBlockRendererProps) {
    const seg = (suffix: string, qNum?: number) => `reading-b${blockIndex}${qNum != null ? `-q${qNum}` : ""}-${suffix}`;
    if (block.type === "notes") {
        return (<div className="space-y-3">
        <p className="font-semibold text-base text-zinc-700 dark:text-zinc-300">
          <HighlightableSegment id={seg("inst")}>{block.instruction}</HighlightableSegment>
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          <HighlightableSegment id={seg("instsub")}>{block.instructionSub}</HighlightableSegment>
        </p>
        <p className="font-semibold text-base text-zinc-800 dark:text-zinc-100">
          <HighlightableSegment id={seg("title")}>{block.title}</HighlightableSegment>
        </p>
        <div className="space-y-4 text-base leading-relaxed">
          {block.items.map(({ qNum, prefix, suffix }) => (<p key={qNum} className="leading-8">
              <HighlightableSegment id={seg("pre", qNum)}>{prefix}</HighlightableSegment>
              <input type="text" value={answers[qNum] ?? ""} onChange={(e) => updateAnswer(qNum, e.target.value)} disabled={submitted} className={`mr-2 ${readingInputClass(isCorrect(qNum))}`}/>
              {suffix}
              {submitted && isCorrect(qNum) !== null && (<span className="ml-1.5 inline-flex flex-wrap items-center gap-1.5">
                  <span className={`text-sm font-medium ${tickClass(isCorrect(qNum))}`}>
                    {isCorrect(qNum) ? "✓" : "✗"}
                  </span>
                  {isCorrect(qNum) === false && getCorrectAnswerText?.(qNum) != null && (<span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Correct: {formatCorrectAnswer(getCorrectAnswerText(qNum))}
                    </span>)}
                </span>)}
            </p>))}
        </div>
      </div>);
    }
    if (block.type === "trueFalseNg") {
        const options = block.variant === "yesNoNg"
            ? [
                { value: "YES", label: "YES" },
                { value: "NO", label: "NO" },
                { value: "NOT GIVEN", label: "NOT GIVEN" },
            ]
            : [
                { value: "TRUE", label: "TRUE" },
                { value: "FALSE", label: "FALSE" },
                { value: "NOT GIVEN", label: "NOT GIVEN" },
            ];
        return (<div className="space-y-3">
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          <HighlightableSegment id={seg("inst")}>{block.instruction}</HighlightableSegment>
        </p>
        <ul className="space-y-4">
          {block.questions.map(({ qNum, text }) => {
                const correct = isCorrect(qNum);
                const val = answers[qNum] ?? "";
                return (<li key={qNum} className="space-y-2">
                <p className="text-base font-medium text-zinc-800 dark:text-zinc-100">
                  {qNum}. <HighlightableSegment id={seg("q", qNum)}>{text}</HighlightableSegment>
                </p>
                <div className="flex flex-wrap gap-3">
                  {options.map(({ value, label }) => (<label key={value} className="flex items-center gap-2 text-base">
                      <input type="radio" name={`r-${qNum}`} value={value} checked={val === value} onChange={() => updateAnswer(qNum, value)} disabled={submitted} className="border-zinc-300 text-zinc-900 focus:ring-zinc-400"/>
                      {label}
                    </label>))}
                </div>
                {submitted && correct !== null && (<span className="inline-flex flex-wrap items-center gap-1.5">
                    <span className={`text-sm font-medium ${tickClass(correct)}`}>
                      {correct ? "✓" : "✗"}
                    </span>
                    {correct === false && getCorrectAnswerText?.(qNum) != null && (<span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                        Correct: {formatCorrectAnswer(getCorrectAnswerText(qNum))}
                      </span>)}
                  </span>)}
              </li>);
            })}
        </ul>
      </div>);
    }
    if (block.type === "paragraphMatch") {
        return (<div className="space-y-3">
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          <HighlightableSegment id={seg("inst")}>{block.instruction}</HighlightableSegment>
        </p>
        {block.headings && (<ul className="mb-3 list-none space-y-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/50">
            {block.headings.map(({ letter, text }) => (<li key={letter} className="text-zinc-700 dark:text-zinc-300">
                <strong className="font-semibold">{letter}.</strong> <HighlightableSegment id={seg(`h-${letter}`)}>{text}</HighlightableSegment>
              </li>))}
          </ul>)}
        <ul className="space-y-3">
          {block.items.map(({ qNum, text }) => (<li key={qNum} className="flex flex-wrap items-center gap-2">
              <span className="w-8 font-semibold text-zinc-600 dark:text-zinc-400">
                {qNum}.
              </span>
              <span className="text-base text-zinc-700 dark:text-zinc-300">
                <HighlightableSegment id={seg("q", qNum)}>{text}</HighlightableSegment>
              </span>
              <select value={answers[qNum] ?? ""} onChange={(e) => updateAnswer(qNum, e.target.value)} disabled={submitted} className={selectClass(isCorrect(qNum))}>
                <option value="">—</option>
                {block.letters.map((L) => (<option key={L} value={L}>
                    {L}
                  </option>))}
              </select>
              {submitted && isCorrect(qNum) !== null && (<span className="inline-flex flex-wrap items-center gap-1.5">
                  <span className={`text-sm font-medium ${tickClass(isCorrect(qNum))}`}>
                    {isCorrect(qNum) ? "✓" : "✗"}
                  </span>
                  {isCorrect(qNum) === false && getCorrectAnswerText?.(qNum) != null && (<span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Correct: {formatCorrectAnswer(getCorrectAnswerText(qNum))}
                    </span>)}
                </span>)}
            </li>))}
        </ul>
      </div>);
    }
    if (block.type === "sentenceCompletion") {
        return (<div className="space-y-3">
        <p className="font-semibold text-base text-zinc-700 dark:text-zinc-300">
          <HighlightableSegment id={seg("inst")}>{block.instruction}</HighlightableSegment>
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          <HighlightableSegment id={seg("instsub")}>{block.instructionSub}</HighlightableSegment>
        </p>
        <ul className="list-disc space-y-2 pl-6 text-base">
          {block.items.map(({ qNum, textBefore, textAfter }) => (<li key={qNum}>
              <HighlightableSegment id={seg("before", qNum)}>{textBefore}</HighlightableSegment>
              <input type="text" value={answers[qNum] ?? ""} onChange={(e) => updateAnswer(qNum, e.target.value)} disabled={submitted} className={readingInputClass(isCorrect(qNum))}/>
              {textAfter != null && <HighlightableSegment id={seg("after", qNum)}>{textAfter}</HighlightableSegment>}
              {submitted && isCorrect(qNum) !== null && (<span className="inline-flex flex-wrap items-center gap-1.5 ml-1">
                  <span className={`text-sm font-medium ${tickClass(isCorrect(qNum))}`}>
                    {isCorrect(qNum) ? "✓" : "✗"}
                  </span>
                  {isCorrect(qNum) === false && getCorrectAnswerText?.(qNum) != null && (<span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Correct: {formatCorrectAnswer(getCorrectAnswerText(qNum))}
                    </span>)}
                </span>)}
            </li>))}
        </ul>
      </div>);
    }
    if (block.type === "matchPerson") {
        return (<div className="space-y-3">
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          <HighlightableSegment id={seg("inst")}>{block.instruction}</HighlightableSegment>
        </p>
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          <HighlightableSegment id={seg("listlabel")}>{block.listLabel ?? "List of People"}</HighlightableSegment>
        </p>
        <ul className="mb-4 list-disc pl-6 text-base text-zinc-600 dark:text-zinc-400">
          {block.people.map(({ letter, name }) => (<li key={letter}>
              <strong>{letter}.</strong> <HighlightableSegment id={seg(`person-${letter}`)}>{name}</HighlightableSegment>
            </li>))}
        </ul>
        <ul className="space-y-3">
          {block.items.map(({ qNum, text }) => (<li key={qNum} className="flex flex-wrap items-center gap-2">
              <span className="w-8 font-semibold text-zinc-600 dark:text-zinc-400">
                {qNum}.
              </span>
              <span className="text-base text-zinc-700 dark:text-zinc-300">
                <HighlightableSegment id={seg("q", qNum)}>{text}</HighlightableSegment>
              </span>
              <select value={answers[qNum] ?? ""} onChange={(e) => updateAnswer(qNum, e.target.value)} disabled={submitted} className={selectClass(isCorrect(qNum))}>
                <option value="">—</option>
                {block.people.map(({ letter: L }) => (<option key={L} value={L}>
                    {L}
                  </option>))}
              </select>
              {submitted && isCorrect(qNum) !== null && (<span className="inline-flex flex-wrap items-center gap-1.5">
                  <span className={`text-sm font-medium ${tickClass(isCorrect(qNum))}`}>
                    {isCorrect(qNum) ? "✓" : "✗"}
                  </span>
                  {isCorrect(qNum) === false && getCorrectAnswerText?.(qNum) != null && (<span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Correct: {formatCorrectAnswer(getCorrectAnswerText(qNum))}
                    </span>)}
                </span>)}
            </li>))}
        </ul>
      </div>);
    }
    if (block.type === "summary") {
        return (<div className="space-y-3">
        <p className="font-semibold text-base text-zinc-700 dark:text-zinc-300">
          <HighlightableSegment id={seg("inst")}>{block.instruction}</HighlightableSegment>
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          <HighlightableSegment id={seg("instsub")}>{block.instructionSub}</HighlightableSegment>
        </p>
        <p className="font-semibold text-base text-zinc-800 dark:text-zinc-100">
          <HighlightableSegment id={seg("title")}>{block.title}</HighlightableSegment>
        </p>
        <div className="space-y-2 text-base">
          {block.items.map(({ qNum, prefix, suffix }) => (<p key={qNum}>
              <HighlightableSegment id={seg("pre", qNum)}>{prefix}</HighlightableSegment>
              <input type="text" value={answers[qNum] ?? ""} onChange={(e) => updateAnswer(qNum, e.target.value)} disabled={submitted} className={readingInputClass(isCorrect(qNum))}/>
              {suffix != null && <HighlightableSegment id={seg("suf", qNum)}>{suffix}</HighlightableSegment>}
              {submitted && isCorrect(qNum) !== null && (<span className="inline-flex flex-wrap items-center gap-1.5 ml-1">
                  <span className={`text-sm font-medium ${tickClass(isCorrect(qNum))}`}>
                    {isCorrect(qNum) ? "✓" : "✗"}
                  </span>
                  {isCorrect(qNum) === false && getCorrectAnswerText?.(qNum) != null && (<span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Correct: {formatCorrectAnswer(getCorrectAnswerText(qNum))}
                    </span>)}
                </span>)}
            </p>))}
        </div>
      </div>);
    }
    if (block.type === "multipleChoice") {
        return (<div className="space-y-6">
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          <HighlightableSegment id={seg("inst")}>{block.instruction}</HighlightableSegment>
        </p>
        {block.questions.map(({ qNum, text, options }) => {
                const correct = isCorrect(qNum);
                const val = answers[qNum] ?? "";
                return (<div key={qNum} className="space-y-2">
              <p className="text-base font-medium text-zinc-800 dark:text-zinc-100">
                {qNum}. <HighlightableSegment id={seg("q", qNum)}>{text}</HighlightableSegment>
              </p>
              <div className="space-y-1 pl-2">
                {options.map(({ letter, text: optText }) => {
                        const isWrongChoice = submitted && correct === false && val === letter;
                        const isCorrectChoice = submitted && correct === true && val === letter;
                        return (<label key={letter} className={`flex cursor-pointer items-start gap-2 text-base ${isWrongChoice ? "text-rose-600 dark:text-rose-400" : ""} ${isCorrectChoice ? "text-emerald-700 dark:text-emerald-400 font-medium" : ""}`}>
                      <input type="radio" name={`mc-${qNum}`} value={letter} checked={val === letter} onChange={() => updateAnswer(qNum, letter)} disabled={submitted} className="mt-0.5 shrink-0 border-zinc-300 text-zinc-900 focus:ring-zinc-400"/>
                      <span>
                        <strong>{letter}.</strong> <HighlightableSegment id={seg(`opt-${qNum}-${letter}`)}>{optText}</HighlightableSegment>
                      </span>
                    </label>);
                    })}
              </div>
              {submitted && correct !== null && (<span className="inline-flex items-center gap-2">
                  <span className={`text-sm font-medium ${tickClass(correct)}`}>
                    {correct ? "✓" : "✗"}
                  </span>
                  {correct === false && getCorrectAnswerText?.(qNum) != null && (<span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Correct: {formatCorrectAnswer(getCorrectAnswerText(qNum))}
                    </span>)}
                </span>)}
            </div>);
            })}
      </div>);
    }
    if (block.type === "summaryFromList") {
        return (<div className="space-y-3">
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          <HighlightableSegment id={seg("inst")}>{block.instruction}</HighlightableSegment>
        </p>
        {block.title && (<p className="font-semibold text-base text-zinc-800 dark:text-zinc-100">
            <HighlightableSegment id={seg("title")}>{block.title}</HighlightableSegment>
          </p>)}
        <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/50 sm:grid-cols-4">
          {block.options.map(({ letter, text }) => (<p key={letter} className="text-zinc-700 dark:text-zinc-300">
              <strong>{letter}.</strong> <HighlightableSegment id={seg(`opt-${letter}`)}>{text}</HighlightableSegment>
            </p>))}
        </div>
        <div className="space-y-2 text-base">
          {block.items.map(({ qNum, prefix, suffix }) => (<p key={qNum}>
              <HighlightableSegment id={seg("pre", qNum)}>{prefix}</HighlightableSegment>
              <select value={answers[qNum] ?? ""} onChange={(e) => updateAnswer(qNum, e.target.value)} disabled={submitted} className={selectClass(isCorrect(qNum))}>
                <option value="">—</option>
                {block.options.map(({ letter }) => (<option key={letter} value={letter}>
                    {letter}
                  </option>))}
              </select>
              {suffix != null && <HighlightableSegment id={seg("suf", qNum)}>{suffix}</HighlightableSegment>}
              {submitted && isCorrect(qNum) !== null && (<span className="inline-flex flex-wrap items-center gap-1.5 ml-1">
                  <span className={`text-sm font-medium ${tickClass(isCorrect(qNum))}`}>
                    {isCorrect(qNum) ? "✓" : "✗"}
                  </span>
                  {isCorrect(qNum) === false && getCorrectAnswerText?.(qNum) != null && (<span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Correct: {formatCorrectAnswer(getCorrectAnswerText(qNum))}
                    </span>)}
                </span>)}
            </p>))}
        </div>
      </div>);
    }
    return null;
}
