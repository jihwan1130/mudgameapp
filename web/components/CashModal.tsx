"use client";

import { useEffect, useState } from "react";
import { CASH_PRODUCTS, PAY_METHODS } from "@/data/user";
import { cx, won } from "@/lib/format";
import { useApp } from "./AppProvider";
import { CloseIcon } from "./Icons";

/** 캐시 충전 모달 — 결제 수단 선택 UI만 (실제 결제 연동 없음) */
export default function CashModal() {
  const { cash, closeCash, charge } = useApp();
  const [pi, setPi] = useState(2);
  const [method, setMethod] = useState(PAY_METHODS[0]);
  const p = CASH_PRODUCTS[pi];
  const bonus = Math.round((p.price * p.bonusRate) / 100);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCash();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [closeCash]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center" onClick={closeCash}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cash-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-[480px] sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 id="cash-title" className="text-lg font-bold">캐시 충전</h2>
          <button onClick={closeCash} aria-label="닫기" className="grid size-9 place-items-center rounded-full hover:bg-soft">
            <CloseIcon />
          </button>
        </div>
        <p className="mt-1 text-sm text-sub">
          보유 캐시 <b className="font-mono text-ink">{won(cash)}</b>
        </p>

        <h3 className="mt-5 text-sm font-semibold">충전 금액</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {CASH_PRODUCTS.map((x, i) => (
            <button
              key={x.price}
              onClick={() => setPi(i)}
              className={cx(
                "relative rounded-card border px-4 py-3 text-left transition-colors",
                i === pi ? "border-ink bg-ink text-white" : "border-line hover:border-ink/40",
                i === CASH_PRODUCTS.length - 1 && "col-span-2"
              )}
            >
              <span className="block text-base font-bold">{won(x.price)}</span>
              <span className={cx("text-xs", i === pi ? "text-white/70" : "text-sub")}>
                {x.bonusRate ? (
                  <>
                    + 보너스 <b className={i === pi ? "text-term" : "text-up"}>{x.bonusRate}%</b>
                    {" "}({Math.round((x.price * x.bonusRate) / 100).toLocaleString("ko-KR")}캐시)
                  </>
                ) : (
                  "기본 충전"
                )}
              </span>
            </button>
          ))}
        </div>

        <h3 className="mt-5 text-sm font-semibold">결제 수단</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {PAY_METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={cx(
                "h-9 rounded-full border px-4 text-sm",
                m === method ? "border-ink font-semibold" : "border-line text-sub hover:text-ink"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <dl className="mt-5 space-y-1.5 rounded-card bg-soft p-4 text-sm">
          <div className="flex justify-between"><dt className="text-sub">충전 금액</dt><dd className="font-mono">{won(p.price)}</dd></div>
          <div className="flex justify-between"><dt className="text-sub">보너스</dt><dd className="font-mono text-term">+{bonus.toLocaleString("ko-KR")}</dd></div>
          <div className="flex justify-between border-t border-line pt-1.5 font-semibold">
            <dt>충전 후 캐시</dt><dd className="font-mono">{won(cash + p.price + bonus)}</dd>
          </div>
        </dl>

        <button
          onClick={() => { charge(p.price, bonus, method); closeCash(); }}
          className="mt-5 h-12 w-full rounded-card bg-ink font-semibold text-white hover:bg-ink/85"
        >
          {won(p.price)} 결제하기
        </button>
        <p className="mt-2 text-center text-xs text-sub">데모 화면이에요. 실제 결제는 진행되지 않아요.</p>
      </div>
    </div>
  );
}
