"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useI18n } from "@/components/i18n-provider";
function RealtimeCallLoading() {
    const { t } = useI18n();
    return (<div className="flex min-h-[50vh] items-center justify-center text-zinc-500 dark:text-zinc-400">
      {t("realtimePageLoading")}
    </div>);
}
const CallKenPage = dynamic(() => import("@/features/call-ken/routes/index").then((m) => m.CallKenPage), {
    ssr: false,
    loading: () => <RealtimeCallLoading />,
});
export default function RealTimeCallPage() {
    const getApiKey = useMemo(() => async () => {
        const res = await fetch("/api/realtime-client-secret");
        const data = await res.json();
        if (!res.ok)
            throw new Error(data.error ?? "Failed to get session");
        return { apiKey: data.apiKey };
    }, []);
    useEffect(() => {
        import("@/features/call-ken/lib/audio").then((audio) => {
            if (audio.isAudioSupported()) {
                audio.preloadAudio(audio.sounds.dialing);
                audio.preloadAudio(audio.sounds.connected);
            }
        });
    }, []);
    return (<div className="-mx-4 min-h-full w-[calc(100%+2rem)] overflow-y-auto bg-zinc-50 pt-2 md:-mx-8 md:w-[calc(100%+4rem)] md:pt-4 dark:bg-zinc-950" style={{
            minHeight: "calc(100vh - 3rem)",
            fontFamily: "var(--font-geist-sans), sans-serif",
        }}>
      <CallKenPage getApiKey={getApiKey}/>
    </div>);
}
