export function PortfolioSectionHeading({ title, subtitle, }: {
    title: string;
    subtitle?: string;
}) {
    return (<div className="relative mb-10">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
        {title}
      </h2>
      {subtitle && (<p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>)}
      <div className="mt-4 h-1 w-16 rounded-full bg-zinc-900 dark:bg-zinc-100"/>
    </div>);
}
