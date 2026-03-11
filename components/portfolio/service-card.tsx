export function PortfolioServiceCard({ imageSrc, title, paragraph, }: {
    imageSrc: string;
    title: string;
    paragraph: string;
}) {
    return (<div className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
      <div className="relative mx-auto mb-4 flex h-24 w-24 shrink-0 items-center justify-center">
        
        <img src={imageSrc} alt="" className="h-20 w-20 object-contain"/>
      </div>
      <h3 className="shrink-0 border-b border-zinc-200 pb-3 text-lg font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-3 min-h-0 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {paragraph}
      </p>
    </div>);
}
