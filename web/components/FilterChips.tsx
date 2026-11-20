"use client";

import { CHIPS, type ChipKey } from "@/data/works";
import { cx } from "@/lib/format";
import { BoltIcon } from "./Icons";

/** 2차 필터 칩 — 가로 스크롤, 선택 시 검정 채움 */
export default function FilterChips({ value, onChange }: { value: ChipKey; onChange: (k: ChipKey) => void }) {
  return (
    <div role="tablist" aria-label="필터" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
      {CHIPS.map((c) => {
        const on = c.key === value;
        return (
          <button
            key={c.key}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(c.key)}
            className={cx(
              "flex h-9 shrink-0 items-center gap-1 rounded-full border px-4 text-sm transition-colors",
              on ? "border-ink bg-ink font-semibold text-white" : "border-line bg-white text-ink hover:border-ink/40"
            )}
          >
            {"icon" in c && <BoltIcon className={cx("size-3.5", on ? "text-term" : "text-ink")} />}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
