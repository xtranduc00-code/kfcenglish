import type { Editor } from "@tiptap/core";

/** Bước cỡ chữ (px) — kiểu Word / ghi chú. */
export const RTE_FONT_SIZE_STEPS_PX = [
  12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48,
] as const;

/** Gần với `text-sm` (14px). */
export const RTE_DEFAULT_FONT_PX = 14;

export function rteParseFontSizePx(
  s: string | undefined | null,
): number | null {
  if (!s || typeof s !== "string") return null;
  const t = s.trim();
  const px = t.match(/^(\d+(?:\.\d+)?)\s*px$/i);
  if (px) return Math.round(Number(px[1]));
  const rem = t.match(/^(\d+(?:\.\d+)?)\s*rem$/i);
  if (rem) return Math.round(Number(rem[1]) * 16);
  return null;
}

function nearestStepIndex(px: number): number {
  let best = 0;
  let bestD = Math.abs(RTE_FONT_SIZE_STEPS_PX[0] - px);
  for (let i = 1; i < RTE_FONT_SIZE_STEPS_PX.length; i++) {
    const d = Math.abs(RTE_FONT_SIZE_STEPS_PX[i] - px);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/** Tăng/giảm cỡ chữ (mark `textStyle.fontSize`). */
export function rteBumpFontSize(editor: Editor, dir: -1 | 1): void {
  const attrs = editor.getAttributes("textStyle") as {
    fontSize?: string | null;
  };
  const curPx =
    rteParseFontSizePx(attrs.fontSize ?? undefined) ?? RTE_DEFAULT_FONT_PX;
  let idx = nearestStepIndex(curPx);
  idx = Math.max(
    0,
    Math.min(RTE_FONT_SIZE_STEPS_PX.length - 1, idx + dir),
  );
  const nextPx = RTE_FONT_SIZE_STEPS_PX[idx];
  if (nextPx === RTE_DEFAULT_FONT_PX) {
    editor.chain().focus().unsetFontSize().run();
    return;
  }
  editor.chain().focus().setFontSize(`${nextPx}px`).run();
}
