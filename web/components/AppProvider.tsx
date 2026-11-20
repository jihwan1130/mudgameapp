"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CASH_HISTORY, MOCK_TODAY, USER, type CashEntry } from "@/data/user";
import CashModal from "./CashModal";

interface AppState {
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
  cash: number;
  history: CashEntry[];
  charge: (price: number, bonus: number, method: string) => void;
  cashOpen: boolean;
  openCash: () => void;
  closeCash: () => void;
  notify: (msg: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
};

/** 로그인/캐시/충전 모달/토스트 — 전부 mock 상태 (새로고침 시 캐시는 초기화) */
export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(true);
  const [cash, setCash] = useState(USER.cash);
  const [history, setHistory] = useState<CashEntry[]>(CASH_HISTORY);
  const [cashOpen, setCashOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // 로그인 여부만 브라우저에 기억 (데모)
  useEffect(() => {
    const saved = localStorage.getItem("whatif_logged_in");
    if (saved !== null) setLoggedIn(saved === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("whatif_logged_in", loggedIn ? "1" : "0");
  }, [loggedIn]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = useCallback((msg: string) => setToast(msg), []);

  const charge = useCallback(
    (price: number, bonus: number, method: string) => {
      const add = price + bonus;
      setCash((c) => {
        const next = c + add;
        setHistory((h) => [
          {
            id: `c${Date.now()}`,
            date: MOCK_TODAY.toISOString(),
            type: "charge",
            desc: `${method} 충전${bonus ? ` (+보너스 ${bonus.toLocaleString("ko-KR")})` : ""}`,
            amount: add,
            balance: next,
          },
          ...h,
        ]);
        return next;
      });
      setToast(`₩${add.toLocaleString("ko-KR")} 충전 완료 (데모)`);
    },
    []
  );

  const value: AppState = {
    loggedIn,
    login: () => { setLoggedIn(true); setToast(`${USER.nickname}님, 반가워요!`); },
    logout: () => { setLoggedIn(false); setToast("로그아웃 되었어요"); },
    cash,
    history,
    charge,
    cashOpen,
    openCash: () => (loggedIn ? setCashOpen(true) : setToast("로그인 후 충전할 수 있어요")),
    closeCash: () => setCashOpen(false),
    notify,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      {cashOpen && <CashModal />}
      {toast && (
        <div
          role="status"
          className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg"
        >
          <span className="mr-1.5 font-mono text-term">&gt;</span>
          {toast}
        </div>
      )}
    </Ctx.Provider>
  );
}
