"use client";

import { useMemo, useState } from "react";
import { MOCK_TODAY, type CashType } from "@/data/user";
import { cx, signedWon, won, ymd } from "@/lib/format";
import { useApp } from "../AppProvider";

const TYPES: { key: "all" | CashType; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "charge", label: "충전" },
  { key: "use", label: "사용" },
  { key: "refund", label: "환불" },
];
const PERIODS = [
  { months: 1, label: "1개월" },
  { months: 3, label: "3개월" },
  { months: 6, label: "6개월" },
  { months: 0, label: "전체" },
];
const TYPE_LABEL: Record<CashType, string> = { charge: "충전", use: "사용", refund: "환불" };

/** 캐시 내역 — 날짜/금액 숫자만 모노스페이스로 로그 느낌 */
export default function CashHistoryTab() {
  const { history, cash } = useApp();
  const [type, setType] = useState<"all" | CashType>("all");
  const [months, setMonths] = useState(3);

  const rows = useMemo(() => {
    const from = new Date(MOCK_TODAY);
    if (months) from.setMonth(from.getMonth() - months);
    return history.filter(
      (h) => (type === "all" || h.type === type) && (!months || new Date(h.date) >= from)
    );
  }, [history, type, months]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full bg-soft p-1">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={cx(
                "h-8 rounded-full px-4 text-sm",
                type === t.key ? "bg-white font-semibold shadow-sm" : "text-sub hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              onClick={() => setMonths(p.months)}
              className={cx(
                "h-8 rounded-full border px-3 text-xs",
                months === p.months ? "border-ink bg-ink font-semibold text-white" : "border-line text-sub hover:text-ink"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-soft text-left text-xs text-sub">
            <tr>
              <th className="px-4 py-3 font-medium">날짜</th>
              <th className="px-4 py-3 font-medium">구분</th>
              <th className="px-4 py-3 font-medium">내용</th>
              <th className="px-4 py-3 text-right font-medium">금액</th>
              <th className="px-4 py-3 text-right font-medium">잔액</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((h) => (
              <tr key={h.id} className="hover:bg-[#fafafa]">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-sub">{ymd(h.date)}</td>
                <td className="px-4 py-3">
                  <span
                    className={cx(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      h.type === "use" ? "bg-up/10 text-up" : h.type === "charge" ? "bg-term/10 text-term" : "bg-event/10 text-event"
                    )}
                  >
                    {TYPE_LABEL[h.type]}
                  </span>
                </td>
                <td className="px-4 py-3">{h.desc}</td>
                <td className={cx("whitespace-nowrap px-4 py-3 text-right font-mono font-semibold", h.amount >= 0 ? "text-term" : "text-up")}>
                  {signedWon(h.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sub">{won(h.balance)}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-sub">
                  <span className="font-mono">[empty]</span> 이 기간에는 내역이 없어요
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-right text-xs text-sub">
        현재 잔액 <b className="font-mono text-ink">{won(cash)}</b>
      </p>
    </div>
  );
}
