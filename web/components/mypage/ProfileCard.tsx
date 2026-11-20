"use client";

import { ENDINGS, PLAYING, PURCHASED_IDS, USER } from "@/data/user";
import { won } from "@/lib/format";
import { useApp } from "../AppProvider";

export default function ProfileCard() {
  const { cash, openCash } = useApp();
  const found = ENDINGS.reduce((s, e) => s + e.endings.filter((x) => x.found).length, 0);

  const stats = [
    { label: "보유 작품", value: PURCHASED_IDS.length },
    { label: "플레이 중", value: PLAYING.length },
    { label: "발견한 엔딩", value: found },
  ];

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-line p-5 md:flex-row md:items-center md:p-7">
      <div className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-ink text-2xl font-bold text-white">
          {USER.nickname[0]}
        </span>
        <div>
          <h1 className="text-xl font-bold">{USER.nickname}</h1>
          <p className="font-mono text-xs text-sub">@{USER.handle}</p>
          <div className="mt-2 flex gap-4 text-xs text-sub">
            {stats.map((s) => (
              <span key={s.label}>
                {s.label} <b className="font-mono text-ink">{s.value}</b>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-card bg-soft px-5 py-4 md:ml-auto md:min-w-[320px]">
        <div>
          <p className="text-xs text-sub">보유 캐시</p>
          <p className="font-mono text-2xl font-bold">{won(cash)}</p>
        </div>
        <button onClick={openCash} className="h-10 shrink-0 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-ink/85">
          캐시 충전
        </button>
      </div>
    </section>
  );
}
