export function TechStackCard({ label, tags, }: {
    label: string;
    tags: string[];
}) {
    return (<div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-700 dark:bg-zinc-800/40">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {label}
      </h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (<span key={tag} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200">
            {tag}
          </span>))}
      </div>
    </div>);
}
