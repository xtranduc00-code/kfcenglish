"use client";

import { memo } from "react";

type Props = {
  /** 0–1 */
  level: number;
  className?: string;
  barClassName?: string;
};

/** Vài cột nhỏ phản ánh mức âm (đang nói). */
export const MicLevelBars = memo(function MicLevelBars({
  level,
  className = "",
  barClassName = "bg-current",
}: Props) {
  const indices = [0, 1, 2, 3, 4] as const;
  return (
    <div
      className={`flex h-7 w-[22px] shrink-0 items-end justify-center gap-0.5 ${className}`}
      aria-hidden
    >
      {indices.map((i) => {
        const bias = 0.35 + (i / indices.length) * 0.65;
        const h = Math.min(100, 12 + level * 88 * bias);
        return (
          <div
            key={i}
            className={`w-0.5 min-h-[3px] rounded-full ${barClassName} transition-[height,opacity] duration-75`}
            style={{
              height: `${h}%`,
              opacity: 0.35 + level * 0.65,
            }}
          />
        );
      })}
    </div>
  );
});
