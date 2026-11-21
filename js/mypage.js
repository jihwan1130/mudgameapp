// =========================================================
//  whatif — 마이페이지(mypage.html)
//  프로필 카드 · 내 서재 · 엔딩 컬렉션 · 캐시 내역 · 구매 내역 · 찜 · 계정 설정
// =========================================================

renderHeader(null);
renderFooter();

const $main = document.getElementById("main");

const MP_TABS = [
  { key: "library", label: "내 서재" },
  { key: "endings", label: "엔딩 컬렉션" },
  { key: "cash", label: "코인 내역" },
  { key: "purchases", label: "구매 내역" },
  { key: "wish", label: "찜한 작품" },
  { key: "settings", label: "계정 설정" },
];
const ui = {
  tab: MP_TABS.some((t) => t.key === location.hash.slice(1)) ? location.hash.slice(1) : "library",
  librarySub: "playing",
  cashType: "all",
  cashMonths: 3,
  prefs: { newWork: true, event: false, night: false, spoiler: true },
};

/* ---------------- 프로필 카드 ---------------- */
function ProfileCard() {
  const found = ENDINGS.reduce((s, e) => s + e.endings.filter((x) => x.found).length, 0);
  const stats = [
    ["보유 작품", PURCHASED_IDS.length],
    ["플레이 중", PLAYING.length],
    ["발견한 엔딩", found],
  ];
  return `<section class="pixel-window account-window" aria-label="내 프로필">
    <div class="window-bar"><span class="window-label"><span class="pixel-icon pixel-user" aria-hidden="true"></span>내 프로필</span><span class="window-lines" aria-hidden="true"></span></div>
    <div class="flex flex-col gap-5 p-5 md:flex-row md:items-center md:p-7">
    <div class="flex items-center gap-4">
      <span class="grid size-16 shrink-0 place-items-center rounded-full bg-term text-2xl font-bold text-console">${esc(USER.nickname[0])}</span>
      <div>
        <h1 class="text-xl font-bold">${esc(USER.nickname)}</h1>
        <p class="font-mono text-xs text-sub">@${esc(USER.handle)}</p>
        <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-sub">
          ${stats.map(([l, v]) => `<span>${l} <b class="font-mono text-ink">${v}</b></span>`).join("")}
        </div>
        <a href="serial.html" class="terminal-button primary mt-3">내 소설 연재하기</a>
      </div>
    </div>
    <div class="flex items-center justify-between gap-4 rounded-card bg-soft px-5 py-4 md:ml-auto md:min-w-[320px]">
      <div>
        <p class="text-xs text-sub">보유 코인 <span class="font-mono">(1코인 = ₩100)</span></p>
        <p class="font-mono text-2xl font-bold text-term">${coinLabel(Wallet.coins)}</p>
      </div>
      <button data-open-cash class="h-10 shrink-0 rounded-full bg-term px-5 text-sm font-semibold text-console hover:bg-term/85">코인 충전</button>
    </div>
    </div>
  </section>`;
}

/* ---------------- 1) 내 서재 ---------------- */
function LibraryTab() {
  const save = readWhatifSave();
  const subBtn = (k, label) => `<button data-lib="${k}" class="${cx(
    "h-9 rounded-full border px-4 text-sm",
    ui.librarySub === k ? "border-ink bg-term font-semibold text-console" : "border-line hover:border-ink/40"
  )}">${label}</button>`;

  const body =
    ui.librarySub === "playing"
      ? `<ul class="divide-y divide-line">${PLAYING.map((p) => {
          const w = workById(p.workId);
          const canResume = save?.id === w.id;
          return `<li class="flex items-center gap-4 py-4">
            <a href="${gameUrl(w.id)}" class="w-16 shrink-0 md:w-20" aria-label="${esc(w.title)} 상세">
              ${Thumb(w, { cls: "aspect-[2/3] rounded-lg" })}
            </a>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-sub">${esc(w.genres[0])}</p>
              <p class="truncate font-semibold">${esc(w.title)}</p>
              <p class="mt-0.5 truncate text-xs text-sub">마지막 저장 · <span class="text-ink">${esc(p.lastSave)}</span><span class="ml-2 font-mono">${ymd(p.savedAt)}</span></p>
              <div class="mt-2 flex items-center gap-2">
                <div class="h-1.5 max-w-[320px] flex-1 overflow-hidden rounded-full bg-soft">
                  <div class="h-full rounded-full bg-term" style="width:${p.progress}%"></div>
                </div>
                <span class="font-mono text-xs text-sub">${p.progress}%</span>
              </div>
            </div>
            <a href="${canResume ? "play.html?continue=1" : playUrl(w.id)}" class="terminal-button ${canResume ? "primary" : ""} shrink-0">
              ${canResume ? "이어하기" : "첫 장면"}
            </a>
          </li>`;
        }).join("")}</ul>`
      : `<div class="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6">
          ${PURCHASED_IDS.map((id) => WorkCard(workById(id))).join("")}
        </div>`;

  return `<div class="mb-5 flex flex-wrap gap-2">${subBtn("playing", `플레이 중인 작품 ${PLAYING.length}`)}${subBtn("bought", `구매한 작품 ${PURCHASED_IDS.length}`)}</div>${body}`;
}

/* ---------------- 2) 엔딩 컬렉션 ---------------- */
function EndingsTab() {
  return `<div class="grid gap-4 md:grid-cols-2">${ENDINGS.map((rec) => {
    const w = workById(rec.workId);
    const found = rec.endings.filter((e) => e.found).length;
    const total = rec.endings.length;
    return `<article class="rounded-card border border-line p-4">
      <div class="flex items-center gap-3">
        ${Thumb(w, { cls: "aspect-[2/3] w-12 shrink-0 rounded-lg text-[7px]" })}
        <div class="min-w-0 flex-1">
          <a href="${gameUrl(w.id)}" class="block truncate font-semibold hover:text-term">${esc(w.title)}</a>
          <div class="mt-1.5 flex items-center gap-2">
            <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-soft"><div class="h-full rounded-full bg-term" style="width:${(found / total) * 100}%"></div></div>
            <span class="font-mono text-sm font-semibold">${found}/${total}</span>
          </div>
        </div>
      </div>
      <ol class="mt-4 grid grid-cols-2 gap-2">
        ${rec.endings.map((e, i) => `<li class="${cx(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
          e.found ? "bg-soft" : "border border-dashed border-line text-sub"
        )}">
          <span class="font-mono text-[11px] text-sub">#${String(i + 1).padStart(2, "0")}</span>
          ${e.found ? `<span class="truncate">${esc(e.name)}</span>` : `<span class="font-mono tracking-widest">???</span>${Icon.lock("ml-auto size-3.5")}`}
        </li>`).join("")}
      </ol>
    </article>`;
  }).join("")}</div>`;
}

/* ---------------- 3) 코인 내역 ---------------- */
const CASH_TYPES = [["all", "전체"], ["charge", "충전"], ["use", "사용"], ["reward", "보상"]];
const PERIODS = [[1, "1개월"], [3, "3개월"], [6, "6개월"], [0, "전체"]];
const TYPE_LABEL = { charge: "충전", use: "사용", refund: "환불", reward: "보상" };
const TYPE_STYLE = { use: "bg-up/10 text-up", charge: "bg-term/10 text-term", refund: "bg-event/10 text-event", reward: "bg-event/10 text-event" };

function CashHistoryTab() {
  const from = new Date(MOCK_TODAY);
  if (ui.cashMonths) from.setMonth(from.getMonth() - ui.cashMonths);
  const rows = Wallet.history.filter(
    (h) => (ui.cashType === "all" || h.type === ui.cashType) && (!ui.cashMonths || new Date(h.date) >= from)
  );

  return `<div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex gap-1 rounded-full bg-soft p-1">
        ${CASH_TYPES.map(([k, l]) => `<button data-ctype="${k}" class="${cx(
          "h-8 rounded-full px-4 text-sm",
          ui.cashType === k ? "bg-panel font-semibold shadow-sm" : "text-sub hover:text-ink"
        )}">${l}</button>`).join("")}
      </div>
      <div class="flex gap-1.5">
        ${PERIODS.map(([m, l]) => `<button data-period="${m}" class="${cx(
          "h-8 rounded-full border px-3 text-xs",
          ui.cashMonths === m ? "border-ink bg-term font-semibold text-console" : "border-line text-sub hover:text-ink"
        )}">${l}</button>`).join("")}
      </div>
    </div>
    <div class="mt-4 overflow-x-auto rounded-card border border-line">
      <table class="w-full min-w-[640px] text-sm">
        <thead class="bg-soft text-left text-xs text-sub">
          <tr>
            <th class="px-4 py-3 font-medium">날짜</th>
            <th class="px-4 py-3 font-medium">구분</th>
            <th class="px-4 py-3 font-medium">내용</th>
            <th class="px-4 py-3 text-right font-medium">금액</th>
            <th class="px-4 py-3 text-right font-medium">잔액</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          ${rows.length ? rows.map((h) => `<tr class="hover:bg-soft">
            <td class="whitespace-nowrap px-4 py-3 font-mono text-xs text-sub">${ymd(h.date)}</td>
            <td class="px-4 py-3"><span class="rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_STYLE[h.type]}">${TYPE_LABEL[h.type]}</span></td>
            <td class="px-4 py-3">${esc(h.desc)}</td>
            <td class="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold ${h.amount >= 0 ? "text-term" : "text-up"}">${h.type === "reward" ? "재선택권 +1" : `${h.amount > 0 ? "+" : ""}${coinLabel(h.amount)}`}</td>
            <td class="whitespace-nowrap px-4 py-3 text-right font-mono text-sub">${coinLabel(h.balance)}</td>
          </tr>`).join("") : `<tr><td colspan="5" class="px-4 py-12 text-center text-sm text-sub"><span class="font-mono">[empty]</span> 이 기간에는 내역이 없어요</td></tr>`}
        </tbody>
      </table>
    </div>
    <p class="mt-3 text-right text-xs text-sub">현재 잔액 <b class="font-mono text-ink">${coinLabel(Wallet.coins)}</b></p>`;
}

/* ---------------- 4) 구매 내역 ---------------- */
const METHOD_STYLE = { 소장: "bg-term text-console", 대여: "bg-event/10 text-event", 회차구매: "bg-soft text-ink" };

function PurchasesTab() {
  return `<div class="overflow-x-auto rounded-card border border-line">
    <table class="w-full min-w-[680px] text-sm">
      <thead class="bg-soft text-left text-xs text-sub">
        <tr>
          <th class="px-4 py-3 font-medium">작품명</th>
          <th class="px-4 py-3 font-medium">구매 방식</th>
          <th class="px-4 py-3 text-right font-medium">결제 코인</th>
          <th class="px-4 py-3 font-medium">구매일</th>
          <th class="px-4 py-3 font-medium">대여 남은 기간</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line">
        ${PURCHASES.map((p) => {
          const w = workById(p.workId);
          const left =
            p.method !== "대여" ? `<span class="text-sub">-</span>`
            : p.rentalDaysLeft ? `<span class="font-semibold text-event">${p.rentalDaysLeft}일 남음</span>`
            : `<span class="text-sub">기간 만료</span>`;
          return `<tr class="hover:bg-soft">
            <td class="px-4 py-3"><a href="${gameUrl(w.id)}" class="flex items-center gap-3 hover:text-term">${Thumb(w, { cls: "aspect-[2/3] w-9 shrink-0 rounded-md" })}<span class="font-medium">${esc(w.title)}</span></a></td>
            <td class="px-4 py-3"><span class="rounded-full px-2.5 py-0.5 text-xs font-semibold ${METHOD_STYLE[p.method]}">${p.method}${p.episodes ? ` ${p.episodes}화` : ""}</span></td>
            <td class="whitespace-nowrap px-4 py-3 text-right font-mono">${coinLabel(p.paid)}</td>
            <td class="whitespace-nowrap px-4 py-3 font-mono text-xs text-sub">${ymd(p.date)}</td>
            <td class="px-4 py-3 text-xs">${left}</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
  </div>`;
}

/* ---------------- 5) 찜한 작품 ---------------- */
function WishlistTab() {
  return `<p class="mb-4 flex items-center gap-1.5 text-sm text-sub">${Icon.heart("size-4 text-up")} 찜한 작품 <b class="font-mono text-ink">${WISHLIST_IDS.length}</b></p>
    <div class="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6">${WISHLIST_IDS.map((id) => WorkCard(workById(id))).join("")}</div>`;
}

/* ---------------- 6) 계정 설정 ---------------- */
const PREF_ROWS = [
  ["newWork", "찜한 작품 업데이트 알림", "새 엔딩·회차가 열리면 알려드려요"],
  ["event", "이벤트 · 혜택 알림", "무료 체험, 캐시 보너스 소식"],
  ["night", "야간 알림 받기", "21시 ~ 08시 사이 알림"],
  ["spoiler", "엔딩 이름 스포일러 가리기", "엔딩 컬렉션에서 못 찾은 엔딩을 ??? 로 표시"],
];

function SettingsTab() {
  const toggle = (k, label) => {
    const on = ui.prefs[k];
    return `<button role="switch" aria-checked="${on}" aria-label="${label}" data-pref="${k}"
      class="${cx("relative h-6 w-11 shrink-0 rounded-full transition-colors", on ? "bg-term" : "bg-line")}">
      <span class="${cx("absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]", on ? "left-[22px]" : "left-0.5")}"></span>
    </button>`;
  };
  return `<div class="max-w-2xl space-y-8">
    <section>
      <h3 class="mb-3 font-bold">기본 정보</h3>
      <div class="space-y-4 rounded-card border border-line p-5">
        <label class="block">
          <span class="text-xs text-sub">닉네임</span>
          <div class="mt-1 flex gap-2">
            <input value="${esc(USER.nickname)}" maxlength="12" class="h-10 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm outline-none focus:border-ink">
            <button data-nick class="h-10 shrink-0 rounded-lg bg-term px-4 text-sm font-semibold text-console">변경</button>
          </div>
        </label>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><p class="text-xs text-sub">이메일</p><p class="mt-1">${esc(USER.email)}</p></div>
          <div><p class="text-xs text-sub">가입일</p><p class="mt-1 font-mono">${ymd(USER.joinedAt)}</p></div>
        </div>
      </div>
    </section>
    <section>
      <h3 class="mb-3 font-bold">알림 · 표시</h3>
      <ul class="divide-y divide-line rounded-card border border-line">
        ${PREF_ROWS.map(([k, l, d]) => `<li class="flex items-center gap-4 px-5 py-4">
          <div class="min-w-0 flex-1"><p class="text-sm font-medium">${l}</p><p class="text-xs text-sub">${d}</p></div>
          ${toggle(k, l)}
        </li>`).join("")}
      </ul>
    </section>
    <section class="flex gap-4 text-sm">
      <button data-logout class="text-sub underline-offset-4 hover:underline">로그아웃</button>
      <button data-leave class="text-sub underline-offset-4 hover:text-up hover:underline">회원 탈퇴</button>
    </section>
  </div>`;
}

const TAB_VIEW = {
  library: LibraryTab,
  endings: EndingsTab,
  cash: CashHistoryTab,
  purchases: PurchasesTab,
  wish: WishlistTab,
  settings: SettingsTab,
};

/* ---------------- 렌더 ---------------- */
function render() {
  if (!App.state.loggedIn) {
    $main.innerHTML = `<div class="mx-auto max-w-md py-24 text-center">
      <p class="font-mono text-sm text-up">[401] unauthorized</p>
      <h1 class="mt-2 text-2xl font-bold">로그인이 필요해요</h1>
      <p class="mt-2 text-sm text-sub">내 서재, 엔딩 컬렉션, 코인 내역은 로그인 후 볼 수 있어요.</p>
      <button data-login class="mt-6 h-11 rounded-full bg-term px-8 font-semibold text-console">로그인</button>
    </div>`;
    return;
  }

  $main.innerHTML = `${ProfileCard()}
    <nav aria-label="마이페이지" role="tablist" class="no-scrollbar mt-8 flex gap-6 overflow-x-auto border-b border-line">
      ${MP_TABS.map((t) => `<button role="tab" aria-selected="${ui.tab === t.key}" data-tab="${t.key}" class="${cx(
        "-mb-px shrink-0 border-b-2 pb-3 text-[15px]",
        ui.tab === t.key ? "border-ink font-bold" : "border-transparent text-sub hover:text-ink"
      )}">${t.label}</button>`).join("")}
    </nav>
    <div class="pt-6">${TAB_VIEW[ui.tab]()}</div>`;
}

render();
App.onChange(render); // 로그인/로그아웃 시 다시 그리기
Wallet.onChange(render); // 충전 · 결제 시 다시 그리기

/* ---------------- 이벤트 ---------------- */
$main.addEventListener("click", (e) => {
  const t = e.target.closest(
    "[data-tab],[data-lib],[data-ctype],[data-period],[data-pref],[data-open-cash],[data-login],[data-logout],[data-nick],[data-leave]"
  );
  if (!t) return;
  const d = t.dataset;
  if (d.tab) { ui.tab = d.tab; history.replaceState(null, "", `#${d.tab}`); render(); }
  else if (d.lib) { ui.librarySub = d.lib; render(); }
  else if (d.ctype) { ui.cashType = d.ctype; render(); }
  else if (d.period !== undefined) { ui.cashMonths = +d.period; render(); }
  else if (d.pref) { ui.prefs[d.pref] = !ui.prefs[d.pref]; render(); }
  else if ("openCash" in d) openCash();
  else if ("login" in d) App.login();
  else if ("logout" in d) App.logout();
  else if ("nick" in d) toast("닉네임 변경은 데모에서 저장되지 않아요");
  else if ("leave" in d) toast("데모에서는 탈퇴할 수 없어요");
});
