"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { genreInfo, WORKS } from "@/data/works";
import { USER } from "@/data/user";
import { compact, cx } from "@/lib/format";
import { useApp } from "./AppProvider";
import CategoryTabs from "./CategoryTabs";
import Thumb from "./Thumb";
import { ChevronDown, SearchIcon, UserIcon, WalletIcon } from "./Icons";

function Logo() {
  return (
    <Link href="/" className="shrink-0 font-mono text-[22px] font-bold tracking-tight text-ink" aria-label="whatif 홈">
      whatif<span className="term-cursor text-term">_</span>
    </Link>
  );
}

function SearchBox({ autoFocus, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => {
    const k = q.trim();
    if (!k) return [];
    return WORKS.filter((w) => w.title.includes(k) || w.author.includes(k)).slice(0, 6);
  }, [q]);

  const go = (genreLabel: string) => {
    setOpen(false);
    setQ("");
    onDone?.();
    router.push(`/?tab=${encodeURIComponent(genreLabel)}`, { scroll: false });
  };

  return (
    <div className="relative w-full">
      <label className="flex h-10 items-center gap-2 rounded-full border border-line bg-soft px-4 focus-within:border-ink focus-within:bg-white">
        <span className="font-mono text-sm font-bold text-term" aria-hidden>&gt;</span>
        <span className="relative flex min-w-0 flex-1">
          <input
            value={q}
            autoFocus={autoFocus}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => { setFocused(true); setOpen(true); }}
            onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 150); }}
            onKeyDown={(e) => { if (e.key === "Enter" && results[0]) go(genreInfo(results[0].genre).label); }}
            aria-label="작품 검색 (제목, 작가)"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          {/* 커스텀 placeholder: "제목, 작가를 입력하세요_" (커서만 모노스페이스) */}
          {!q && (
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-sm text-sub">
              제목, 작가를 입력하세요
              {!focused && <span className="term-cursor font-mono">_</span>}
            </span>
          )}
        </span>
        <SearchIcon className="size-[18px] shrink-0 text-sub" />
      </label>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-card border border-line bg-white shadow-xl">
          {results.length ? (
            results.map((w) => (
              <button
                key={w.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(genreInfo(w.genre).label)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-soft"
              >
                <Thumb work={w} className="aspect-[3/4] w-9 shrink-0 rounded-md text-[7px]" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{w.title}</span>
                  <span className="block text-xs text-sub">{genreInfo(w.genre).label} · {w.author}</span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-sub">
              <span className="font-mono text-up">[404]</span> 검색 결과가 없어요
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const { logout, openCash } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full py-1 pl-1 pr-2 hover:bg-soft"
      >
        <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">
          {USER.nickname[0]}
        </span>
        <ChevronDown className="size-4 text-sub" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-card border border-line bg-white py-1 shadow-xl">
          <p className="border-b border-line px-4 py-2.5 text-sm">
            <b>{USER.nickname}</b>
            <span className="block font-mono text-xs text-sub">@{USER.handle}</span>
          </p>
          <Link role="menuitem" href="/mypage" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-soft">
            마이페이지
          </Link>
          <button role="menuitem" onClick={() => { setOpen(false); openCash(); }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-soft">
            캐시 충전
          </button>
          <button role="menuitem" onClick={() => { setOpen(false); logout(); }} className="block w-full px-4 py-2.5 text-left text-sm text-sub hover:bg-soft">
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header({ activeTab = null }: { activeTab?: string | null }) {
  const { loggedIn, login, cash, openCash } = useApp();
  const [mSearch, setMSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="flex h-16 items-center gap-4">
          <Logo />

          <div className="ml-6 hidden max-w-[420px] flex-1 md:block">
            <SearchBox />
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setMSearch((v) => !v)}
              className="grid size-10 place-items-center rounded-full hover:bg-soft md:hidden"
              aria-label="검색 열기"
            >
              <SearchIcon />
            </button>

            {/* 캐시관리 */}
            <button
              onClick={openCash}
              className="flex h-10 items-center gap-1.5 rounded-full px-2.5 hover:bg-soft"
              aria-label="캐시 관리"
              title="캐시 충전"
            >
              <WalletIcon />
              <span className="text-xs font-semibold tabular-nums">{loggedIn ? compact(cash) : "-"}</span>
            </button>

            {/* 마이페이지 */}
            <Link href="/mypage" className="grid size-10 place-items-center rounded-full hover:bg-soft" aria-label="마이페이지">
              <UserIcon />
            </Link>

            {/* 로그인 / 프로필 */}
            {loggedIn ? (
              <ProfileMenu />
            ) : (
              <button onClick={login} className="ml-1 h-9 rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85">
                로그인
              </button>
            )}
          </div>
        </div>

        {mSearch && (
          <div className="pb-3 md:hidden">
            <SearchBox autoFocus onDone={() => setMSearch(false)} />
          </div>
        )}

        <div className={cx(activeTab === undefined && "hidden")}>
          <CategoryTabs active={activeTab} />
        </div>
      </div>
    </header>
  );
}
