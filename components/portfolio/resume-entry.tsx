export function PortfolioResumeEntry({ year, title, subTitle, text, bullets, }: {
    year: string;
    title: string;
    subTitle?: string;
    text?: string;
    bullets?: string[];
}) {
    return (<div className="relative flex gap-4 pb-10 last:pb-0 md:gap-8">
      <div className="relative flex shrink-0 flex-col items-center">
        <span className="z-10 flex h-4 w-4 shrink-0 rounded-full border-2 border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900"/>
        <div className="absolute top-4 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700"/>
      </div>
      <div className="min-w-0 flex-1 pt-0 md:pl-2">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{year}</p>
        <h4 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h4>
        {subTitle ? (<p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{subTitle}</p>) : null}
        {text ? (<p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {text}
          </p>) : null}
        {bullets && bullets.length > 0 ? (<ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {bullets.map((b) => (<li key={b}>{b}</li>))}
          </ul>) : null}
      </div>
    </div>);
}
