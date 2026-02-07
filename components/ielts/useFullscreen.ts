"use client";
import { useCallback, useState } from "react";
export function useFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const toggleFullscreen = useCallback(() => {
        if (typeof document === "undefined")
            return;
        const doc = document as Document & {
            webkitFullscreenElement?: Element;
            webkitExitFullscreen?: () => Promise<void>;
        };
        const el = document.documentElement as HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void>;
        };
        if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
            if (el.requestFullscreen)
                el.requestFullscreen();
            else if (el.webkitRequestFullscreen)
                el.webkitRequestFullscreen();
            setIsFullscreen(true);
        }
        else {
            if (doc.exitFullscreen)
                doc.exitFullscreen();
            else if (doc.webkitExitFullscreen)
                doc.webkitExitFullscreen();
            setIsFullscreen(false);
        }
    }, []);
    return { isFullscreen, toggleFullscreen };
}
