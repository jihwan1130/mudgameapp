import { PURCHASES, type PurchaseMethod } from "@/data/user";
import { workById } from "@/data/works";
import { cx, won, ymd } from "@/lib/format";
import Thumb from "../Thumb";

const METHOD_STYLE: Record<PurchaseMethod, string> = {
  소장: "bg-ink text-white",
  대여: "bg-event/10 text-event",
  회차구매: "bg-soft text-ink",
};

export default function PurchasesTab() {
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[680px] text-sm">
        <thead className="bg-soft text-left text-xs text-sub">
          <tr>
            <th className="px-4 py-3 font-medium">작품명</th>
            <th className="px-4 py-3 font-medium">구매 방식</th>
            <th className="px-4 py-3 text-right font-medium">결제 캐시</th>
            <th className="px-4 py-3 font-medium">구매일</th>
            <th className="px-4 py-3 font-medium">대여 남은 기간</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {PURCHASES.map((p, i) => {
            const w = workById(p.workId);
            return (
              <tr key={i} className="hover:bg-[#fafafa]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb work={w} className="aspect-[3/4] w-9 shrink-0 rounded-md text-[6px]" />
                    <span className="font-medium">{w.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cx("rounded-full px-2.5 py-0.5 text-xs font-semibold", METHOD_STYLE[p.method])}>
                    {p.method}
                    {p.episodes ? ` ${p.episodes}화` : ""}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono">{won(p.paid)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-sub">{ymd(p.date)}</td>
                <td className="px-4 py-3 text-xs">
                  {p.method !== "대여" ? (
                    <span className="text-sub">-</span>
                  ) : p.rentalDaysLeft ? (
                    <span className="font-semibold text-event">{p.rentalDaysLeft}일 남음</span>
                  ) : (
                    <span className="text-sub">기간 만료</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
