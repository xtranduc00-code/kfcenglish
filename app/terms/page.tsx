import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — Ken Workspace",
    description: "Terms of service for Ken Workspace.",
};

export default function TermsPage() {
    return (<section className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p>Last updated: March 2026</p>
      <p>
        Ken Workspace is provided as a demo/portfolio project for educational purposes.
        Use it at your own discretion.
      </p>
      <p>
        You agree not to misuse the service, attempt unauthorized access, or upload
        unlawful content.
      </p>
      <p>
        This project is not affiliated with any real brand. No warranty is provided, and
        the service may change or be removed at any time.
      </p>
    </section>);
}
