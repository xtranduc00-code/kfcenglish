"use client";
import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
function fmtCountdown(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
export function ExamTimer({ totalMinutes }: {
    totalMinutes: number;
}) {
    const [secs, setSecs] = useState(totalMinutes * 60);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSecs((s) => Math.max(0, s - 1));
        }, 1000);
        return () => { if (intervalRef.current)
            clearInterval(intervalRef.current); };
    }, []);
    const urgent = secs <= 300;
    return (<div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors ${urgent
            ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"}`}>
      <Clock className={`h-4 w-4 ${urgent ? "animate-pulse" : ""}`}/>
      {fmtCountdown(secs)}
    </div>);
}
