"use client";

import { useRef } from "react";
import type { Work } from "@/data/works";
import WorkCard from "./WorkCard";
import { ChevronRight } from "./Icons";

/** 섹션 제목: 회색 모노 "$ ls ./dir" + 굵은 제목 */
export function SectionTitle({ dir, title, right }: { dir: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline gap-2.5">
      <span className="font-mono text-xs text-sub">$ ls ./{dir}</span>
      <h2 className="text-lg font-bold md:text-xl">{title}</h2>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

/** 장르별 작품 줄 — 작은 세로 카드 가로 스크롤 + 우측 원형 ">" */
export default function GenreSection({
  dir,
  title,
  works,
  ranked,
}: {
  dir: string;
  title: string;
  works: Work[];
  ranked?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const scroll = () => {
    const el = rowRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <SectionTitle dir={dir} title={title} />
      <div
        ref={rowRef}
        className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 pt-1 md:mx-0 md:px-0"
      >
        {works.map((w, i) => (
          <WorkCard
            key={w.id}
            work={w}
            rank={ranked ? i + 1 : undefined}
            className="w-[34%] shrink-0 snap-start sm:w-[22%] md:w-[calc((100%-8*12px)/9)]"
          />
        ))}
      </div>
      <button
        onClick={scroll}
        aria-label={`${title} 더 보기`}
        className="absolute -right-4 top-[40%] z-10 hidden size-10 place-items-center rounded-full border border-line bg-white shadow-md hover:bg-soft md:grid"
      >
        <ChevronRight />
      </button>
    </section>
  );
}
