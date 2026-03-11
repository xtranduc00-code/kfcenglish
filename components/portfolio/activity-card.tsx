export function PortfolioActivityCard({ text }: {
    text: string;
}) {
    return (<div className="flex h-full min-h-0 flex-col rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 text-sm leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
      {text}
    </div>);
}
