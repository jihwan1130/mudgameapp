"use client";

import { useState } from "react";
import { cx } from "@/lib/format";
import { useApp } from "../AppProvider";
import ProfileCard from "./ProfileCard";
import LibraryTab from "./LibraryTab";
import EndingsTab from "./EndingsTab";
import CashHistoryTab from "./CashHistoryTab";
import PurchasesTab from "./PurchasesTab";
import WishlistTab from "./WishlistTab";
import SettingsTab from "./SettingsTab";

const TABS = [
  { key: "library", label: "내 서재", El: LibraryTab },
  { key: "endings", label: "엔딩 컬렉션", El: EndingsTab },
  { key: "cash", label: "캐시 내역", El: CashHistoryTab },
  { key: "purchases", label: "구매 내역", El: PurchasesTab },
  { key: "wish", label: "찜한 작품", El: WishlistTab },
  { key: "settings", label: "계정 설정", El: SettingsTab },
] as const;

export default function MyPageView() {
  const { loggedIn, login } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("library");

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <p className="font-mono text-sm text-up">[401] unauthorized</p>
        <h1 className="mt-2 text-2xl font-bold">로그인이 필요해요</h1>
        <p className="mt-2 text-sm text-sub">내 서재, 엔딩 컬렉션, 캐시 내역은 로그인 후 볼 수 있어요.</p>
        <button onClick={login} className="mt-6 h-11 rounded-full bg-ink px-8 font-semibold text-white">
          로그인
        </button>
      </div>
    );
  }

  const Active = TABS.find((t) => t.key === tab)!.El;

  return (
    <div>
      <ProfileCard />

      <nav aria-label="마이페이지" role="tablist" className="no-scrollbar mt-8 flex gap-6 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cx(
              "-mb-px shrink-0 border-b-2 pb-3 text-[15px]",
              tab === t.key ? "border-ink font-bold" : "border-transparent text-sub hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="pt-6">
        <Active />
      </div>
    </div>
  );
}
