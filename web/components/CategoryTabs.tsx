import Link from "next/link";
import { TABS } from "@/data/works";
import { cx } from "@/lib/format";

/** 1차 메뉴 — 선택된 탭은 굵게 + 밑줄 */
export default function CategoryTabs({ active }: { active?: string | null }) {
  return (
    <nav aria-label="카테고리" className="no-scrollbar -mb-px flex gap-5 overflow-x-auto md:gap-7">
      {TABS.map((t) => {
        const on = t === active;
        return (
          <Link
            key={t}
            href={t === "추천" ? "/" : `/?tab=${encodeURIComponent(t)}`}
            scroll={false}
            aria-current={on ? "page" : undefined}
            className={cx(
              "shrink-0 border-b-2 pb-2.5 pt-1 text-[15px] transition-colors md:text-base",
              on ? "border-ink font-bold text-ink" : "border-transparent text-sub hover:text-ink"
            )}
          >
            {t}
          </Link>
        );
      })}
    </nav>
  );
}
