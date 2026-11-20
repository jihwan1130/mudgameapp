"use client";

import { useCallback, useEffect, useState } from "react";
import { genreInfo, HERO, workById } from "@/data/works";
import { compact } from "@/lib/format";
import Thumb from "./Thumb";
import { ChevronLeft, ChevronRight } from "./Icons";

const SLIDES = HERO.map((h) => ({ ...h, work: workById(h.id) }));
const N = SLIDES.length;
const mod = (a: number) => ((a % N) + N) % N;

/** 카드가 바뀔 때마다 한 글자씩 출력 (터미널 포인트) */
function TypeLine({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const t = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), 55);
    return () => clearInterval(t);
  }, [text]);
  return (
    <p className="mt-2 min-h-[1.5em] text-sm text-white/90 md:text-lg" aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span aria-hidden className="term-cursor ml-0.5 font-mono text-term">_</span>
    </p>
  );
}

/**
 * 가운데 큰 카드 + 양옆 일부가 보이는 캐러셀.
 * pos 는 끝없이 늘어나는 가상 인덱스라 마지막 → 처음으로 자연스럽게 이어져요.
 */
export default function HeroCarousel() {
  const [pos, setPos] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((step: number) => setPos((p) => p + step), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 4000);
    return () => clearInterval(t);
  }, [paused, go, pos]);

  const active = mod(pos);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="추천 작품"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[220px] overflow-hidden sm:h-[300px] md:h-[380px]">
        {[-2, -1, 0, 1, 2].map((d) => {
          const k = pos + d;
          const s = SLIDES[mod(k)];
          return (
            <article
              key={k}
              aria-hidden={d !== 0}
              onClick={() => d !== 0 && go(d)}
              className="absolute top-0 left-1/2 h-full w-[86%] cursor-pointer overflow-hidden rounded-card transition-[transform,opacity] duration-500 ease-out sm:w-[72%] md:w-[64%]"
              style={{
                transform: `translateX(calc(-50% + ${d} * (100% + 12px)))`,
                opacity: d === 0 ? 1 : 0.55,
              }}
            >
              <Thumb work={s.work} size="lg" priority={d === 0} className="absolute inset-0 text-[22px] md:text-[32px] [&>div:last-child]:hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                <span className="text-xs font-medium text-white/70">
                  {genreInfo(s.work.genre).label} · {compact(s.work.plays)}명 플레이
                </span>
                <h2 className="mt-1 text-2xl font-extrabold leading-tight text-white md:text-4xl">{s.work.title}</h2>
                {d === 0 ? <TypeLine text={s.copy} /> : <p className="mt-2 min-h-[1.5em] text-sm text-white/80 md:text-lg">{s.copy}</p>}
              </div>
            </article>
          );
        })}

        {/* 페이지 표시 */}
        <span className="absolute right-[9%] top-3 z-10 rounded-full bg-black/45 px-2.5 py-1 font-mono text-xs text-white sm:right-[16%] md:right-[19%]">
          {active + 1} / {N}
        </span>
      </div>

      <button
        onClick={() => go(-1)}
        aria-label="이전 작품"
        className="absolute left-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white shadow-md hover:bg-soft sm:grid md:left-[11%]"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="다음 작품"
        className="absolute right-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white shadow-md hover:bg-soft sm:grid md:right-[11%]"
      >
        <ChevronRight />
      </button>
    </section>
  );
}
