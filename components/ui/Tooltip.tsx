"use client";
import { createContext, useCallback, useContext, useRef, useState, useMemo, type ReactNode, } from "react";
import { createPortal } from "react-dom";
const SHOW_DELAY_MS = 100;
const HIDE_DELAY_MS = 50;
const DEFAULT_OFFSET = 0;
const TOOLTIP_Z_INDEX = 9999;
type Placement = "top" | "bottom";
type TooltipContextValue = {
    setAnchor: (el: HTMLElement | null) => void;
    show: () => void;
    hide: () => void;
    visible: boolean;
};
const TooltipContext = createContext<TooltipContextValue | null>(null);
function useTooltip() {
    return useContext(TooltipContext);
}
export type TooltipProps = {
    content: ReactNode;
    placement?: Placement;
    delayShow?: number;
    delayHide?: number;
    offset?: number;
    children: ReactNode;
};
export const testPageTooltipPreset: Pick<TooltipProps, "offset" | "delayShow" | "delayHide"> = {
    offset: 0,
    delayShow: SHOW_DELAY_MS,
    delayHide: HIDE_DELAY_MS,
};
export function Tooltip({ content, placement = "top", delayShow = SHOW_DELAY_MS, delayHide = HIDE_DELAY_MS, offset = DEFAULT_OFFSET, children, }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const anchorRef = useRef<HTMLElement | null>(null);
    const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [position, setPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);
    const setAnchor = useCallback((el: HTMLElement | null) => {
        anchorRef.current = el;
    }, []);
    const show = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        if (showTimeoutRef.current)
            return;
        showTimeoutRef.current = setTimeout(() => {
            showTimeoutRef.current = null;
            const el = anchorRef.current;
            if (el && typeof document !== "undefined") {
                const rect = el.getBoundingClientRect();
                if (placement === "top") {
                    setPosition({
                        top: rect.top - offset,
                        left: rect.left + rect.width / 2,
                    });
                }
                else {
                    setPosition({
                        top: rect.bottom + offset,
                        left: rect.left + rect.width / 2,
                    });
                }
                setVisible(true);
            }
        }, delayShow);
    }, [delayShow, placement, offset]);
    const hide = useCallback(() => {
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = null;
        }
        hideTimeoutRef.current = setTimeout(() => {
            hideTimeoutRef.current = null;
            setVisible(false);
            setPosition(null);
        }, delayHide);
    }, [delayHide]);
    const value = useMemo<TooltipContextValue>(() => ({ setAnchor, show, hide, visible }), [setAnchor, show, hide, visible]);
    const tooltipEl = visible &&
        position &&
        typeof document !== "undefined" &&
        createPortal(<div className="pointer-events-none z-[9999] opacity-100 transition-opacity duration-75" style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                transform: placement === "top"
                    ? "translate(-50%, -100%)"
                    : "translate(-50%, 0)",
                zIndex: TOOLTIP_Z_INDEX,
            }} role="tooltip">
        <div className="rounded-md border border-zinc-200 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-md dark:border-zinc-700 dark:bg-zinc-800">
          {content}
        </div>
      </div>, document.body);
    return (<TooltipContext.Provider value={value}>
      <TooltipTrigger>{children}</TooltipTrigger>
      {tooltipEl}
    </TooltipContext.Provider>);
}
function TooltipTrigger({ children }: {
    children: ReactNode;
}) {
    const ctx = useTooltip();
    const onRef = useCallback((el: HTMLDivElement | null) => {
        ctx?.setAnchor(el);
    }, [ctx]);
    if (!ctx)
        return <>{children}</>;
    return (<div ref={onRef} onMouseEnter={ctx.show} onMouseLeave={ctx.hide} onFocus={ctx.show} onBlur={ctx.hide} className="inline-flex">
      {children}
    </div>);
}
