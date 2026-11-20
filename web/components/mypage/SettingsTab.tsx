"use client";

import { useState } from "react";
import { USER } from "@/data/user";
import { cx, ymd } from "@/lib/format";
import { useApp } from "../AppProvider";

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx("relative h-6 w-11 shrink-0 rounded-full transition-colors", on ? "bg-term" : "bg-line")}
    >
      <span className={cx("absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]", on ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

export default function SettingsTab() {
  const { notify, logout } = useApp();
  const [nick, setNick] = useState(USER.nickname);
  const [prefs, setPrefs] = useState({ newWork: true, event: false, night: false, spoiler: true });

  const rows: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: "newWork", label: "찜한 작품 업데이트 알림", desc: "새 엔딩·회차가 열리면 알려드려요" },
    { key: "event", label: "이벤트 · 혜택 알림", desc: "무료 체험, 캐시 보너스 소식" },
    { key: "night", label: "야간 알림 받기", desc: "21시 ~ 08시 사이 알림" },
    { key: "spoiler", label: "엔딩 이름 스포일러 가리기", desc: "엔딩 컬렉션에서 못 찾은 엔딩을 ??? 로 표시" },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h3 className="mb-3 font-bold">기본 정보</h3>
        <div className="space-y-4 rounded-card border border-line p-5">
          <label className="block">
            <span className="text-xs text-sub">닉네임</span>
            <div className="mt-1 flex gap-2">
              <input
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                maxLength={12}
                className="h-10 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm outline-none focus:border-ink"
              />
              <button
                onClick={() => notify("닉네임 변경은 데모에서 저장되지 않아요")}
                className="h-10 shrink-0 rounded-lg bg-ink px-4 text-sm font-semibold text-white"
              >
                변경
              </button>
            </div>
          </label>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-sub">이메일</p>
              <p className="mt-1">{USER.email}</p>
            </div>
            <div>
              <p className="text-xs text-sub">가입일</p>
              <p className="mt-1 font-mono">{ymd(USER.joinedAt)}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-bold">알림 · 표시</h3>
        <ul className="divide-y divide-line rounded-card border border-line">
          {rows.map((r) => (
            <li key={r.key} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-sub">{r.desc}</p>
              </div>
              <Toggle label={r.label} on={prefs[r.key]} onChange={(v) => setPrefs((p) => ({ ...p, [r.key]: v }))} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex gap-4 text-sm">
        <button onClick={logout} className="text-sub underline-offset-4 hover:underline">로그아웃</button>
        <button onClick={() => notify("데모에서는 탈퇴할 수 없어요")} className="text-sub underline-offset-4 hover:text-up hover:underline">
          회원 탈퇴
        </button>
      </section>
    </div>
  );
}
