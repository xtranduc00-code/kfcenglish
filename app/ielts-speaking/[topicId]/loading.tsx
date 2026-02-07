export default function TopicLoading() {
    return (<div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"/>
      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (<div key={i} className="h-64 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800"/>))}
      </div>
    </div>);
}
