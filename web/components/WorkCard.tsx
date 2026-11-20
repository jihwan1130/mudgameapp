"use client";

import { genreInfo, type Badge, type Work } from "@/data/works";
import { compact, cx, playTime } from "@/lib/format";
import { useApp } from "./AppProvider";
import Thumb from "./Thumb";

const BADGE_STYLE: Record<Badge, string> = {
  EVENT: "bg-event text-white",
  UP: "bg-up text-white",
  NEW: "bg-term text-white",
  "3다무": "bg-ink text-white",
  "15": "bg-white/90 text-ink",
};

/** 배지: 모노스페이스 + 대괄호 표기 (터미널 포인트) */
export function Badges({ badges, max = 2 }: { badges: Badge[]; max?: number }) {
  if (!badges.length) return null;
  return (
    <div className="absolute left-1.5 top-1.5 z-[1] flex flex-wrap gap-1">
      {badges.slice(0, max).map((b) => (
        <span key={b} className={cx("rounded px-1 py-px font-mono text-[10px] font-bold leading-4", BADGE_STYLE[b])}>
          [{b}]
        </span>
      ))}
    </div>
  );
}

/**
 * 작은 세로 카드.
 * - variant "row": 장르 섹션 (썸네일, 제목, 장르 · 엔딩 개수 · 평균 플레이 시간)
 * - variant "highlight": 하이라이트 줄 (제목 2줄 + 누적 플레이 수)
 * - rank 가 있으면 썸네일 왼쪽 아래에 큰 숫자
 */
export default function WorkCard({
  work,
  rank,
  variant = "row",
  className,
}: {
  work: Work;
  rank?: number;
  variant?: "row" | "highlight";
  className?: string;
}) {
  const { notify } = useApp();
  return (
    <button
      onClick={() => notify(`「${work.title}」 상세 페이지는 준비 중이에요`)}
      className={cx("group block text-left", className)}
    >
      <div className="scan aspect-[3/4] rounded-card transition-transform duration-300 ease-out group-hover:scale-[1.03]">
        <Thumb work={work} bare={rank !== undefined} className="absolute inset-0 text-[15px]" />
        <Badges badges={work.badges} />
        {work.isFree && (
          <span className="absolute bottom-1.5 right-1.5 z-[1] rounded bg-white/90 px-1.5 text-[10px] font-bold leading-4 text-ink">
            무료
          </span>
        )}
        {rank !== undefined && (
          <span
            className="absolute -bottom-1 left-1.5 z-[1] text-5xl font-black italic leading-none text-white md:text-6xl"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,.45)" }}
          >
            {rank}
          </span>
        )}
      </div>

      {variant === "highlight" ? (
        <div className="mt-2.5">
          <p className="line-clamp-2 text-sm font-semibold leading-snug md:text-[15px]">{work.title}</p>
          <p className="mt-1 text-xs text-sub">{compact(work.plays)} 명 플레이</p>
        </div>
      ) : (
        <div className="mt-2">
          <p className="truncate text-sm font-semibold">{work.title}</p>
          <p className="mt-0.5 truncate text-xs text-sub">
            {genreInfo(work.genre).label} · 엔딩 {work.endings}개
          </p>
          <p className="truncate text-xs text-sub">평균 {playTime(work.avgPlayMin)}</p>
        </div>
      )}
    </button>
  );
}
