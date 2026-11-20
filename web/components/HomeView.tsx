"use client";

import { useState } from "react";
import { CHIPS, GENRES, ranking, worksByChip, worksByGenre, type ChipKey } from "@/data/works";
import FilterChips from "./FilterChips";
import NoticeBar from "./NoticeBar";
import HeroCarousel from "./HeroCarousel";
import HighlightRow from "./HighlightRow";
import GenreSection, { SectionTitle } from "./GenreSection";
import WorkCard from "./WorkCard";

export default function HomeView({ tab }: { tab: string }) {
  const [chip, setChip] = useState<ChipKey>("hot");
  const genre = GENRES.find((g) => g.label === tab);

  return (
    <div className="space-y-6 pt-5 md:space-y-8 md:pt-6">
      <FilterChips value={chip} onChange={setChip} />
      <NoticeBar />

      {genre ? (
        // ---------- 장르 탭: 해당 장르 전체 ----------
        <section>
          <SectionTitle dir={genre.dir} title={genre.label} right={<span className="text-sm text-sub">총 10작품</span>} />
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 md:gap-x-4">
            {worksByGenre(genre.key).map((w) => (
              <WorkCard key={w.id} work={w} variant="highlight" />
            ))}
          </div>
        </section>
      ) : (
        // ---------- 추천 탭 ----------
        <>
          <HeroCarousel />

          <section>
            <SectionTitle
              dir={chip}
              title={CHIPS.find((c) => c.key === chip)!.label}
            />
            <HighlightRow works={worksByChip(chip)} />
          </section>

          <div className="space-y-10 pt-4 md:space-y-12">
            <GenreSection dir="ranking" title="실시간 랭킹 TOP 10" works={ranking().slice(0, 10)} ranked />
            {GENRES.map((g) => (
              <GenreSection key={g.key} dir={g.dir} title={g.label} works={worksByGenre(g.key)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
