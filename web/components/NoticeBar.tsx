"use client";

import { useApp } from "./AppProvider";
import { ChevronRight } from "./Icons";

/** 공지 띠 배너 — 회색 둥근 박스 한 줄 */
export default function NoticeBar() {
  const { notify } = useApp();
  return (
    <button
      onClick={() => notify("오늘의 전편무료 작품은 곧 공개돼요")}
      className="flex h-12 w-full items-center gap-3 rounded-card bg-soft pl-4 pr-2 text-left hover:bg-[#efefef]"
    >
      <span className="shrink-0 font-mono text-[11px] font-semibold text-term">[SYSTEM]</span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        ▶ 오늘의 <b>전.편.무.료</b> 작품
      </span>
      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-white">
        <ChevronRight className="size-4" />
      </span>
    </button>
  );
}
