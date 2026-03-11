export function PortfolioSkillBar({ title, percent, }: {
    title: string;
    percent: number;
}) {
    return (<div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">{title}</span>
        <span className="text-zinc-500 dark:text-zinc-400">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100" style={{ width: `${percent}%` }}/>
      </div>
    </div>);
}
