"use client";

import { useState } from "react";
import { PLAYING, PURCHASED_IDS } from "@/data/user";
import { workById, genreInfo } from "@/data/works";
import { cx, ymd } from "@/lib/format";
import { useApp } from "../AppProvider";
import Thumb from "../Thumb";
import WorkCard from "../WorkCard";

export default function LibraryTab() {
  const { notify } = useApp();
  const [sub, setSub] = useState<"playing" | "bought">("playing");

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {[
          ["playing", `플레이 중인 작품 ${PLAYING.length}`],
          ["bought", `구매한 작품 ${PURCHASED_IDS.length}`],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSub(k as typeof sub)}
            className={cx(
              "h-9 rounded-full border px-4 text-sm",
              sub === k ? "border-ink bg-ink font-semibold text-white" : "border-line hover:border-ink/40"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {sub === "playing" ? (
        <ul className="divide-y divide-line">
          {PLAYING.map((p) => {
            const w = workById(p.workId);
            return (
              <li key={p.workId} className="flex items-center gap-4 py-4">
                <Thumb work={w} className="aspect-[3/4] w-16 shrink-0 rounded-lg text-[9px] md:w-20" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-sub">{genreInfo(w.genre).label}</p>
                  <p className="truncate font-semibold">{w.title}</p>
                  <p className="mt-0.5 truncate text-xs text-sub">
                    마지막 저장 · <span className="text-ink">{p.lastSave}</span>
                    <span className="ml-2 font-mono">{ymd(p.savedAt)}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 max-w-[320px] flex-1 overflow-hidden rounded-full bg-soft">
                      <div className="h-full rounded-full bg-term" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="font-mono text-xs text-sub">{p.progress}%</span>
                  </div>
                </div>
                <button
                  onClick={() => notify(`「${w.title}」 ${p.lastSave} 부터 이어할게요 (준비 중)`)}
                  className="h-9 shrink-0 rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85"
                >
                  이어하기
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6">
          {PURCHASED_IDS.map((id) => (
            <WorkCard key={id} work={workById(id)} />
          ))}
        </div>
      )}
    </div>
  );
}
