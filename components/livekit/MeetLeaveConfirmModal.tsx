"use client";

import { LogOut } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

type Props = {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export function MeetLeaveConfirmModal({ open, onCancel, onConfirm }: Props) {
    const { t } = useI18n();
    if (!open) {
        return null;
    }
    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            role="presentation"
            onClick={onCancel}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="meet-leave-title"
                className="w-full max-w-sm rounded-2xl border border-zinc-600 bg-zinc-900 p-5 text-zinc-100 shadow-2xl ring-1 ring-black/40"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-400 ring-1 ring-red-500/30">
                    <LogOut className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <h2 id="meet-leave-title" className="text-lg font-bold text-zinc-50">
                    {t("meetsLeaveConfirmTitle")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{t("meetsLeaveConfirmHint")}</p>
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-zinc-700"
                        onClick={onCancel}
                    >
                        {t("meetsLeaveCancel")}
                    </button>
                    <button
                        type="button"
                        className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/40 hover:bg-red-500"
                        onClick={onConfirm}
                    >
                        {t("meetsLeaveConfirmAction")}
                    </button>
                </div>
            </div>
        </div>
    );
}
