// =========================================================
//  whatif — 공통: 포맷 · 아이콘 · 썸네일/카드 · 헤더/푸터 · 캐시 모달 · 토스트
//  (빌드 없이 file:// 로 열어도 동작하도록 일반 <script> 로 불러와요)
// =========================================================

/* ---------------- 포맷 ---------------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const won = (n) => `₩${Math.abs(n).toLocaleString("ko-KR")}`;
const signedWon = (n) => `${n >= 0 ? "+" : "-"}${won(n)}`;
const compact = (n) => {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? Math.round(v) : Number(v.toFixed(1))}만`;
  }
  return n.toLocaleString("ko-KR");
};
const playTime = (min) => (min >= 60 ? `${Math.floor(min / 60)}시간${min % 60 ? ` ${min % 60}분` : ""}` : `${min}분`);
const ymd = (iso) => {
  const d = new Date(iso);
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
};
const cx = (...c) => c.filter(Boolean).join(" ");

/* ---------------- 아이콘 ---------------- */
const SV = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"';
const Icon = {
  search: (c = "size-5") => `<svg ${SV} class="${c}"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  wallet: (c = "size-5") => `<svg ${SV} class="${c}"><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1"/><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 13.5h2"/></svg>`,
  user: (c = "size-5") => `<svg ${SV} class="${c}"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
  left: (c = "size-5") => `<svg ${SV} class="${c}"><path d="m15 18-6-6 6-6"/></svg>`,
  right: (c = "size-5") => `<svg ${SV} class="${c}"><path d="m9 18 6-6-6-6"/></svg>`,
  down: (c = "size-4") => `<svg ${SV} class="${c}"><path d="m6 9 6 6 6-6"/></svg>`,
  bolt: (c = "size-4") => `<svg viewBox="0 0 24 24" fill="currentColor" class="${c}"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>`,
  close: (c = "size-5") => `<svg ${SV} class="${c}"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  heart: (c = "size-4") => `<svg viewBox="0 0 24 24" fill="currentColor" class="${c}"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>`,
  lock: (c = "size-4") => `<svg ${SV} class="${c}"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
};

/* ---------------- 앱 상태 (mock) ----------------
   로그인 여부 · 캐시 · 캐시 내역을 localStorage 에 저장해서
   index.html ↔ mypage.html 을 오가도 유지돼요. */
const App = (() => {
  const KEY = "whatif_demo_state";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch {}
  const state = {
    loggedIn: saved.loggedIn ?? true,
    cash: saved.cash ?? USER.cash,
    history: saved.history ?? CASH_HISTORY,
  };
  const listeners = new Set();
  const save = () => {
    localStorage.setItem(KEY, JSON.stringify(state));
    listeners.forEach((fn) => fn(state));
  };
  return {
    state,
    onChange: (fn) => listeners.add(fn),
    login() { state.loggedIn = true; save(); toast(`${USER.nickname}님, 반가워요!`); },
    logout() { state.loggedIn = false; save(); toast("로그아웃 되었어요"); },
    charge(price, bonus, method) {
      const add = price + bonus;
      state.cash += add;
      state.history = [
        {
          id: `c${Date.now()}`,
          date: MOCK_TODAY.toISOString(),
          type: "charge",
          desc: `${method} 충전${bonus ? ` (+보너스 ${bonus.toLocaleString("ko-KR")})` : ""}`,
          amount: add,
          balance: state.cash,
        },
        ...state.history,
      ];
      save();
      toast(`₩${add.toLocaleString("ko-KR")} 충전 완료 (데모)`);
    },
    reset() { localStorage.removeItem(KEY); location.reload(); },
  };
})();

/* ---------------- 토스트 ---------------- */
let toastTimer;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role", "status");
    el.className = "fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-term px-5 py-2.5 text-sm text-console shadow-lg";
    document.body.appendChild(el);
  }
  el.innerHTML = `<span class="mr-1.5 font-mono text-term">&gt;</span>${esc(msg)}`;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2400);
}

/* ---------------- 썸네일 ---------------- */
function Thumb(work, { cls = "" } = {}) {
  const position = cls.includes("absolute") ? "" : "relative";
  return `<div class="${cx("overflow-hidden bg-soft", position, cls)}">
    <img src="${work.poster}" alt="" width="480" height="720" loading="lazy" decoding="async" class="absolute inset-0 size-full object-cover">
  </div>`;
}
/* ---------------- 배지 / 카드 ---------------- */
const BADGE_STYLE = {
  EVENT: "bg-event text-console",
  UP: "bg-up text-console",
  NEW: "bg-term text-console",
  "3다무": "bg-term text-console",
  "15": "bg-panel text-ink",
};

function Badges(badges, max = 2) {
  if (!badges.length) return "";
  return `<div class="absolute left-1.5 top-1.5 z-[1] flex flex-wrap gap-1">${badges
    .slice(0, max)
    .map((b) => `<span class="rounded px-1 py-px font-mono text-[10px] font-bold leading-4 ${BADGE_STYLE[b]}">[${b}]</span>`)
    .join("")}</div>`;
}

function WorkCard(work) {
  return `<a href="${gameUrl(work.id)}" class="group block min-w-0 text-left">
    <div class="scan aspect-[2/3] rounded-card border border-line transition-colors group-hover:border-term">
      ${Thumb(work, { cls: "absolute inset-0" })}
      ${Badges(work.badges)}
      ${work.isFree ? '<span class="absolute bottom-1.5 right-1.5 z-[1] rounded bg-panel px-1.5 text-xs font-bold leading-4 text-ink">무료</span>' : ""}
    </div>
    <div class="mt-2">
      <p class="text-sm font-semibold leading-snug break-keep">${esc(work.title)}</p>
      <p class="mt-0.5 text-xs text-sub">${esc(work.genres[0])} · 엔딩 ${work.endings}개</p>
      <p class="text-xs text-sub">평균 ${playTime(work.avgPlayMin)}</p>
    </div>
  </a>`;
}
/* ---------------- 헤더 ---------------- */
function SearchBox(id) {
  return `<div class="relative w-full" data-search="${id}">
    <label class="flex h-10 items-center gap-2 rounded-full border border-line bg-soft px-4 focus-within:border-ink focus-within:bg-panel">
      <span class="font-mono text-sm font-bold text-term" aria-hidden="true">&gt;</span>
      <span class="relative flex min-w-0 flex-1">
        <input aria-label="작품 검색 (제목, 작가)" class="min-w-0 flex-1 bg-transparent text-sm outline-none">
        <span aria-hidden="true" data-ph class="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-sm text-sub">
          제목, 작가를 입력하세요<span data-cur class="term-cursor font-mono">_</span>
        </span>
      </span>
      ${Icon.search("size-[18px] shrink-0 text-sub")}
    </label>
    <div data-results hidden class="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-card border border-line bg-panel shadow-xl"></div>
  </div>`;
}

function wireSearch(root) {
  const input = root.querySelector("input");
  const ph = root.querySelector("[data-ph]");
  const cur = root.querySelector("[data-cur]");
  const box = root.querySelector("[data-results]");
  let results = [];
  const go = (work) => { location.href = gameUrl(work.id); };

  const render = () => {
    const k = input.value.trim();
    ph.hidden = !!input.value;
    results = k ? WORKS.filter((w) => w.title.includes(k) || w.author.includes(k)).slice(0, 6) : [];
    if (!k) return (box.hidden = true);
    box.hidden = false;
    box.innerHTML = results.length
      ? results
          .map(
            (w, i) => `<button data-i="${i}" class="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-soft">
              ${Thumb(w, { cls: "aspect-[2/3] w-9 shrink-0 rounded-md text-[7px]" })}
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold">${esc(w.title)}</span>
                <span class="block text-xs text-sub">${esc(w.genres[0])} · ${esc(w.author)}</span>
              </span>
            </button>`
          )
          .join("")
      : `<p class="px-4 py-3 text-sm text-sub"><span class="font-mono text-up">[404]</span> 검색 결과가 없어요</p>`;
  };

  input.addEventListener("input", render);
  input.addEventListener("focus", () => { cur.hidden = true; render(); });
  input.addEventListener("blur", () => { cur.hidden = false; setTimeout(() => (box.hidden = true), 150); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && results[0]) go(results[0]); });
  box.addEventListener("mousedown", (e) => e.preventDefault());
  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (b) go(results[+b.dataset.i]);
  });
}

/** activeTab: "추천" | 장르명 | null(마이페이지) */
function renderHeader(activeTab) {
  const el = document.getElementById("header");
  el.className = "site-header account-header";

  const tabs = TABS.map((t) => {
    const on = t === activeTab;
    const href = t === "추천" ? "index.html" : `index.html?genre=${encodeURIComponent(t)}`;
    return `<a href="${href}" ${on ? 'aria-current="page"' : ""} class="${cx(
      "shrink-0 border-b-2 pb-2.5 pt-1 text-[15px] transition-colors md:text-base",
      on ? "border-ink font-bold text-ink" : "border-transparent text-sub hover:text-ink"
    )}">${t}</a>`;
  }).join("");

  el.innerHTML = `<div class="mx-auto max-w-[1200px] px-4 md:px-6">
    <div class="flex h-16 items-center gap-4">
      <a href="index.html" class="brand" aria-label="WHATIF 홈"><img src="assets/whatif.png" alt="" width="1240" height="368" /></a>
      <div class="ml-6 hidden max-w-[420px] flex-1 md:block">${SearchBox("pc")}</div>
      <div class="ml-auto flex items-center gap-1 md:gap-2">
        <button data-act="m-search" class="grid size-10 place-items-center rounded-full hover:bg-soft md:hidden" aria-label="검색 열기">${Icon.search()}</button>
        <button data-act="cash" class="flex h-10 items-center gap-1.5 rounded-full px-2.5 hover:bg-soft" aria-label="캐시 관리" title="캐시 충전">
          ${Icon.wallet()}<span data-cash-compact class="text-xs font-semibold tabular-nums"></span>
        </button>
        <a href="mypage.html" class="grid size-10 place-items-center rounded-full hover:bg-soft" aria-label="마이페이지">${Icon.user()}</a>
        <div data-auth></div>
      </div>
    </div>
    <div data-m-search hidden class="pb-3 md:hidden">${SearchBox("m")}</div>
    <nav aria-label="카테고리" class="no-scrollbar -mb-px flex gap-5 overflow-x-auto md:gap-7">${tabs}</nav>
  </div>`;

  el.querySelectorAll("[data-search]").forEach(wireSearch);

  const auth = el.querySelector("[data-auth]");
  const paintAuth = () => {
    el.querySelector("[data-cash-compact]").textContent = App.state.loggedIn ? compact(App.state.cash) : "-";
    auth.innerHTML = App.state.loggedIn
      ? `<div class="relative" data-profile>
          <button data-act="profile" aria-haspopup="menu" aria-expanded="false" class="flex items-center gap-1 rounded-full py-1 pl-1 pr-2 hover:bg-soft">
            <span class="grid size-8 place-items-center rounded-full bg-term text-sm font-bold text-console">${esc(USER.nickname[0])}</span>
            ${Icon.down("size-4 text-sub")}
          </button>
          <div role="menu" data-menu hidden class="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-card border border-line bg-panel py-1 shadow-xl">
            <p class="border-b border-line px-4 py-2.5 text-sm"><b>${esc(USER.nickname)}</b><span class="block font-mono text-xs text-sub">@${esc(USER.handle)}</span></p>
            <a role="menuitem" href="mypage.html" class="block px-4 py-2.5 text-sm hover:bg-soft">마이페이지</a>
            <button role="menuitem" data-act="cash" class="block w-full px-4 py-2.5 text-left text-sm hover:bg-soft">캐시 충전</button>
            <button role="menuitem" data-act="logout" class="block w-full px-4 py-2.5 text-left text-sm text-sub hover:bg-soft">로그아웃</button>
          </div>
        </div>`
      : `<button data-act="login" class="ml-1 h-9 rounded-full bg-term px-4 text-sm font-semibold text-console hover:bg-term/85">로그인</button>`;
  };
  paintAuth();
  App.onChange(paintAuth);

  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const menu = el.querySelector("[data-menu]");
    switch (b.dataset.act) {
      case "m-search": {
        const box = el.querySelector("[data-m-search]");
        box.hidden = !box.hidden;
        if (!box.hidden) box.querySelector("input").focus();
        break;
      }
      case "cash": if (menu) menu.hidden = true; openCash(); break;
      case "profile":
        menu.hidden = !menu.hidden;
        b.setAttribute("aria-expanded", String(!menu.hidden));
        break;
      case "logout": App.logout(); break;
      case "login": App.login(); break;
    }
  });
  document.addEventListener("mousedown", (e) => {
    const p = el.querySelector("[data-profile]");
    if (p && !p.contains(e.target)) p.querySelector("[data-menu]").hidden = true;
  });
}

/* ---------------- 푸터 ---------------- */
function renderFooter() {
  const el = document.getElementById("footer");
  el.className = "mt-20 border-t border-line bg-panel";
  el.innerHTML = `<div class="mx-auto max-w-[1200px] px-4 py-10 text-xs leading-6 text-sub md:px-6">
      <nav class="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink">
        <a href="#" class="hover:underline">회사소개</a>
        <a href="#" class="hover:underline">이용약관</a>
        <a href="#" class="font-bold hover:underline">개인정보처리방침</a>
        <a href="#" class="hover:underline">청소년보호정책</a>
        <a href="#" class="hover:underline">작가 지원</a>
        <a href="#" class="hover:underline">고객센터</a>
      </nav>
      <p>(주)왓이프 · 대표 OOO · 사업자등록번호 000-00-00000 · 통신판매업신고 제0000-서울-0000호</p>
      <p>서울특별시 OO구 OO로 00 · 고객센터 0000-0000 (평일 10:00~18:00) · help@whatif.example</p>
      <p class="mt-2">© 2026 whatif. 모든 작품의 저작권은 각 작가에게 있습니다.</p>
    </div>
    <div class="border-t border-line bg-panel">
      <p class="mx-auto max-w-[1200px] truncate px-4 py-2 font-mono text-xs text-term md:px-6">
        whatif@server:~$<span class="term-cursor">_</span>
      </p>
    </div>`;
}

/* ---------------- 캐시 충전 모달 ----------------
   결제 수단 선택 UI만 (실제 결제 연동 없음) */
function openCash() {
  if (!App.state.loggedIn) return toast("로그인 후 충전할 수 있어요");
  let pi = 2;
  let method = PAY_METHODS[0];

  const wrap = document.createElement("div");
  wrap.className = "fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center";
  document.body.appendChild(wrap);
  document.body.style.overflow = "hidden";

  const close = () => {
    wrap.remove();
    document.body.style.overflow = "";
    window.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => e.key === "Escape" && close();
  window.addEventListener("keydown", onKey);

  const paint = () => {
    const p = CASH_PRODUCTS[pi];
    const bonus = Math.round((p.price * p.bonusRate) / 100);
    const cash = App.state.cash;
    wrap.innerHTML = `<div role="dialog" aria-modal="true" aria-labelledby="cash-title" data-dialog
        class="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-panel p-5 sm:max-w-[480px] sm:rounded-2xl sm:p-6">
      <div class="flex items-center justify-between">
        <h2 id="cash-title" class="text-lg font-bold">캐시 충전</h2>
        <button data-m="close" aria-label="닫기" class="grid size-9 place-items-center rounded-full hover:bg-soft">${Icon.close()}</button>
      </div>
      <p class="mt-1 text-sm text-sub">보유 캐시 <b class="font-mono text-ink">${won(cash)}</b></p>

      <h3 class="mt-5 text-sm font-semibold">충전 금액</h3>
      <div class="mt-2 grid grid-cols-2 gap-2">
        ${CASH_PRODUCTS.map((x, i) => {
          const on = i === pi;
          const xb = Math.round((x.price * x.bonusRate) / 100);
          return `<button data-p="${i}" class="${cx(
            "relative rounded-card border px-4 py-3 text-left transition-colors",
            on ? "border-ink bg-term text-console" : "border-line hover:border-ink/40",
            i === CASH_PRODUCTS.length - 1 && "col-span-2"
          )}">
            <span class="block text-base font-bold">${won(x.price)}</span>
            <span class="text-xs ${on ? "text-console/70" : "text-sub"}">${
              x.bonusRate
                ? `+ 보너스 <b class="${on ? "text-term" : "text-up"}">${x.bonusRate}%</b> (${xb.toLocaleString("ko-KR")}캐시)`
                : "기본 충전"
            }</span>
          </button>`;
        }).join("")}
      </div>

      <h3 class="mt-5 text-sm font-semibold">결제 수단</h3>
      <div class="mt-2 flex flex-wrap gap-2">
        ${PAY_METHODS.map((m) => `<button data-pay="${m}" class="${cx(
          "h-9 rounded-full border px-4 text-sm",
          m === method ? "border-ink font-semibold" : "border-line text-sub hover:text-ink"
        )}">${m}</button>`).join("")}
      </div>

      <dl class="mt-5 space-y-1.5 rounded-card bg-soft p-4 text-sm">
        <div class="flex justify-between"><dt class="text-sub">충전 금액</dt><dd class="font-mono">${won(p.price)}</dd></div>
        <div class="flex justify-between"><dt class="text-sub">보너스</dt><dd class="font-mono text-term">+${bonus.toLocaleString("ko-KR")}</dd></div>
        <div class="flex justify-between border-t border-line pt-1.5 font-semibold"><dt>충전 후 캐시</dt><dd class="font-mono">${won(cash + p.price + bonus)}</dd></div>
      </dl>

      <button data-m="pay" class="mt-5 h-12 w-full rounded-card bg-term font-semibold text-console hover:bg-term/85">${won(p.price)} 결제하기</button>
      <p class="mt-2 text-center text-xs text-sub">데모 화면이에요. 실제 결제는 진행되지 않아요.</p>
    </div>`;
  };
  paint();

  wrap.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dialog]")) return close();
    const t = e.target.closest("[data-p],[data-pay],[data-m]");
    if (!t) return;
    if (t.dataset.p) { pi = +t.dataset.p; paint(); }
    else if (t.dataset.pay) { method = t.dataset.pay; paint(); }
    else if (t.dataset.m === "close") close();
    else if (t.dataset.m === "pay") {
      const p = CASH_PRODUCTS[pi];
      App.charge(p.price, Math.round((p.price * p.bonusRate) / 100), method);
      close();
    }
  });
}
