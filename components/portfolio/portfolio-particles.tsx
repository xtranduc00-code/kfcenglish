"use client";
import { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { useThemeDark } from "@/components/portfolio/use-theme-dark";
export function PortfolioParticles() {
    const isDark = useThemeDark();
    const init = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);
    const options = useMemo(() => {
        if (isDark) {
            return {
                fullScreen: { enable: false },
                background: { color: { value: "transparent" } },
                fpsLimit: 60,
                interactivity: {
                    events: { onHover: { enable: true, mode: "grab" as const } },
                    modes: {
                        grab: { distance: 140, links: { opacity: 0.35 } },
                    },
                },
                particles: {
                    color: { value: "#a1a1aa" },
                    links: {
                        color: "#71717a",
                        distance: 130,
                        enable: true,
                        opacity: 0.35,
                        width: 1,
                    },
                    move: {
                        direction: "none" as const,
                        enable: true,
                        outModes: { default: "bounce" as const },
                        speed: 0.65,
                        straight: false,
                    },
                    number: { density: { enable: true, area: 900 }, value: 72 },
                    opacity: { value: { min: 0.15, max: 0.55 } },
                    shape: { type: "circle" as const },
                    size: { value: { min: 1, max: 2.5 } },
                },
                detectRetina: true,
            };
        }
        return {
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            interactivity: {
                events: { onHover: { enable: true, mode: "grab" as const } },
                modes: {
                    grab: {
                        distance: 130,
                        links: { opacity: 0.45 },
                    },
                },
            },
            particles: {
                color: { value: "#71717a" },
                links: {
                    color: "#a1a1aa",
                    distance: 125,
                    enable: true,
                    opacity: 0.65,
                    width: 1,
                },
                move: {
                    direction: "none" as const,
                    enable: true,
                    outModes: { default: "bounce" as const },
                    speed: 0.55,
                    straight: false,
                },
                number: { density: { enable: true, area: 800 }, value: 68 },
                opacity: { value: { min: 0.22, max: 0.5 } },
                shape: { type: "circle" as const },
                size: { value: { min: 1.2, max: 2.4 } },
            },
            detectRetina: true,
        };
    }, [isDark]);
    return (<Particles key={isDark ? "dark" : "light"} id="portfolio-tsparticles" className="absolute inset-0 h-full w-full" init={init} options={options}/>);
}
