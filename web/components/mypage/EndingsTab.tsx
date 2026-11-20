import { ENDINGS } from "@/data/user";
import { workById } from "@/data/works";
import { cx } from "@/lib/format";
import Thumb from "../Thumb";
import { LockIcon } from "../Icons";

/** 작품별 발견한 엔딩 / 전체 엔딩 — 못 찾은 엔딩은 ??? 잠금 */
export default function EndingsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {ENDINGS.map((rec) => {
        const w = workById(rec.workId);
        const found = rec.endings.filter((e) => e.found).length;
        const total = rec.endings.length;
        return (
          <article key={rec.workId} className="rounded-card border border-line p-4">
            <div className="flex items-center gap-3">
              <Thumb work={w} className="aspect-[3/4] w-12 shrink-0 rounded-lg text-[7px]" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{w.title}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft">
                    <div className="h-full rounded-full bg-term" style={{ width: `${(found / total) * 100}%` }} />
                  </div>
                  <span className="font-mono text-sm font-semibold">
                    {found}/{total}
                  </span>
                </div>
              </div>
            </div>
            <ol className="mt-4 grid grid-cols-2 gap-2">
              {rec.endings.map((e, i) => (
                <li
                  key={i}
                  className={cx(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    e.found ? "bg-soft" : "border border-dashed border-line text-sub"
                  )}
                >
                  <span className="font-mono text-[11px] text-sub">#{String(i + 1).padStart(2, "0")}</span>
                  {e.found ? (
                    <span className="truncate">{e.name}</span>
                  ) : (
                    <>
                      <span className="font-mono tracking-widest">???</span>
                      <LockIcon className="ml-auto size-3.5" />
                    </>
                  )}
                </li>
              ))}
            </ol>
          </article>
        );
      })}
    </div>
  );
}
