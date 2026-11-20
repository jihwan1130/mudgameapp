import type { Work } from "@/data/works";
import WorkCard from "./WorkCard";

/** 히어로 아래 세로형 카드 6개 */
export default function HighlightRow({ works }: { works: Work[] }) {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-6 md:grid-cols-6 md:gap-x-4">
      {works.slice(0, 6).map((w) => (
        <WorkCard key={w.id} work={w} variant="highlight" />
      ))}
    </div>
  );
}
