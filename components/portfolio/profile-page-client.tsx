"use client";

import Link from "next/link";
import { Award, Briefcase, ExternalLink, GraduationCap } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PortfolioSectionHeading } from "@/components/portfolio/section-heading";
import { PortfolioResumeEntry } from "@/components/portfolio/resume-entry";
import { ScrollReveal } from "@/components/portfolio/scroll-reveal";
import { TechStackCard } from "@/components/portfolio/tech-stack-card";
import { RESUME_EXPERIENCE_EN, RESUME_EXPERIENCE_VI } from "@/lib/resume-experience";

const SECTION =
    "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-10";

function Subheading({ icon: Icon, title, className = "" }: {
    icon: typeof Briefcase;
    title: string;
    className?: string;
}) {
    return (<div className={`mb-6 mt-10 flex items-center gap-3 first:mt-0 ${className}`}>
      <Icon className="h-8 w-8 text-zinc-700 dark:text-zinc-300"/>
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
    </div>);
}

const PROJECT_DEMO_HREF = "/listening";

export function ProfilePageClient() {
    const { t, locale } = useI18n();
    const techStack = [
        { label: t("resumeTechFrontend"), tags: ["React", "Next.js", "TypeScript", "TailwindCSS"] },
        { label: t("resumeTechBackend"), tags: ["Node.js"] },
        { label: t("resumeTechDatabase"), tags: ["PostgreSQL", "Supabase"] },
        { label: t("resumeTechAI"), tags: ["OpenAI API", "Realtime interaction"] },
        { label: t("resumeTechTools"), tags: ["Git", "Docker", "Vercel"] },
    ];
    const education = [
        { year: t("resumeEdu1Year"), title: t("resumeEdu1Title"), subTitle: t("resumeEdu1School") },
        { year: t("resumeEdu2Year"), title: t("resumeEdu2Title"), subTitle: t("resumeEdu2School") },
    ];
    const experience = locale === "vi" ? RESUME_EXPERIENCE_VI : RESUME_EXPERIENCE_EN;
    const projectBullets = [t("resumeProjB1"), t("resumeProjB2"), t("resumeProjB3")];
    const certificates = [t("resumeCert1"), t("resumeCert2")];

    return (<div className="mx-auto max-w-4xl space-y-8 pb-8">
      <ScrollReveal as="section" className={SECTION}>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {t("aboutKicker")}
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.15] tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl md:text-[2.35rem]">
            {t("aboutHeadline")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("aboutBody1")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {t("aboutBody2Location")}
            <br />
            <span className="text-zinc-600 dark:text-zinc-300">{t("aboutBody2Languages")}</span>
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={SECTION}>
        <PortfolioSectionHeading title={t("resumeTechTitle")} subtitle={t("resumeTechSubtitle")}/>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {techStack.map((row) => (<TechStackCard key={row.label} label={row.label} tags={row.tags}/>))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={SECTION}>
        <PortfolioSectionHeading title={t("resumeProjects")}/>
        <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-zinc-900/20 bg-gradient-to-br from-zinc-900/[0.03] to-transparent p-6 shadow-md dark:border-zinc-100/20 dark:from-zinc-100/[0.06] md:p-8">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-zinc-900/5 dark:bg-zinc-100/10" aria-hidden/>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t("resumeFlagshipMeta")}
          </p>
          <h4 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            {t("resumeProjectName")}
          </h4>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("resumeProjectBlurb")}
          </p>
          <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {projectBullets.map((b) => (<li key={b}>{b}</li>))}
          </ul>
          <div className="mt-8">
            <Link href={PROJECT_DEMO_HREF} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
              <ExternalLink className="h-4 w-4 shrink-0"/>
              {t("resumeLiveDemo")}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={SECTION}>
        <Subheading icon={Briefcase} title={t("resumeWorkingExperience")} className="!mt-0"/>
        <div className="border-l-2 border-zinc-200 pl-6 dark:border-zinc-700">
          {experience.map((item) => (<div key={`${item.title}-${item.year}`}>
              <PortfolioResumeEntry {...item}/>
            </div>))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={SECTION}>
        <Subheading icon={GraduationCap} title={t("resumeEducation")} className="!mt-0"/>
        <div className="border-l-2 border-zinc-200 pl-6 dark:border-zinc-700">
          {education.map((item) => (<div key={item.title}>
              <PortfolioResumeEntry {...item}/>
            </div>))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={SECTION}>
        <Subheading icon={Award} title={t("resumeCertificates")} className="!mt-0"/>
        <ul className="space-y-3 border-l-2 border-zinc-200 pl-6 text-sm leading-relaxed text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
          {certificates.map((line) => (<li key={line}>{line}</li>))}
        </ul>
      </ScrollReveal>
    </div>);
}
