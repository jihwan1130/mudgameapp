// =========================================================
//  WHATIF — 코인 지갑 (프론트 시뮬레이션 전용, 실제 결제 없음)
//  잔액 · 내역 · 해금 상태를 localStorage 에 저장해서 모든 페이지가 공유해요.
//  games.js 다음에 불러오세요.
// =========================================================

const COIN_PACKAGES = [
  { coins: 10, bonus: 0, won: 1000 },
  { coins: 30, bonus: 0, won: 3000 },
  { coins: 50, bonus: 3, won: 5000 },
  { coins: 100, bonus: 10, won: 10000 },
  { coins: 300, bonus: 45, won: 30000 },
];
const COIN_PAY_METHODS = ["신용/체크카드", "카카오페이", "네이버페이", "토스페이", "휴대폰 결제"];

const Wallet = (() => {
  const KEY = "whatif_wallet";
  const seedDate = (daysAgo) => new Date(Date.now() - daysAgo * 864e5).toISOString();
  const seed = () => ({
    coins: 0,
    history: [],
    unlocks: {},
  });

  let state;
  try { state = JSON.parse(localStorage.getItem(KEY)); } catch {}
  if (!state || !Number.isFinite(state.coins)) {
    // 데모 시작 상태: 가입 보너스 + 충전 1회 + 사용 1회
    state = seed();
    [
      [30, "charge", "가입 축하 코인", 20],
      [12, "charge", "카카오페이 충전", 50],
      [12, "use", "좀비 아파트 27층 · 4화", -1],
      [5, "use", "하얀 복도 · 분기 재선택권", -3],
    ].forEach(([ago, type, desc, amount]) => {
      state.coins += amount;
      state.history.unshift({ id: `s${ago}${desc.length}`, date: seedDate(ago), type, desc, amount, balance: state.coins });
    });
    state.unlocks = { "survival-1": { eps: [4], rerolls: 0 }, "white-hall": { eps: [], rerolls: 1 } };
  }

  const listeners = new Set();
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    listeners.forEach((fn) => fn(state));
  };
  const record = (type, desc, amount) => {
    state.coins += amount;
    state.history.unshift({ id: `w${Date.now()}`, date: new Date().toISOString(), type, desc, amount, balance: state.coins });
  };
  const entry = (id) => (state.unlocks[id] ??= { eps: [], rerolls: 0 });

  // 다른 탭에서 바뀌면 동기화
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    try { state = JSON.parse(e.newValue) ?? seed(); } catch { state = seed(); }
    listeners.forEach((fn) => fn(state));
  });

  return {
    get coins() { return state.coins; },
    get history() { return state.history; },
    onChange: (fn) => listeners.add(fn),

    ownsWork: (id) => isFreeGame(id) || !!state.unlocks[id]?.owned,
    episodeOpen(id, n) {
      return isFreeGame(id) || n <= WHATIF_PRICE.freeEpisodes || !!state.unlocks[id]?.owned || !!state.unlocks[id]?.eps.includes(n);
    },
    rerolls: (id) => state.unlocks[id]?.rerolls ?? 0,
    hiddenOpen: (id) => isFreeGame(id) || !!state.unlocks[id]?.hidden,

    /** 코인 차감 시도. 성공하면 true */
    spend(cost, desc, apply) {
      if (state.coins < cost) return false;
      record("use", desc, -cost);
      apply();
      save();
      return true;
    },
    charge(pkg, method) {
      record("charge", `${method} 충전${pkg.bonus ? ` (+보너스 ${pkg.bonus})` : ""}`, pkg.coins + pkg.bonus);
      save();
    },
    grantReroll(id, desc) {
      entry(id).rerolls += 1;
      state.history.unshift({ id: `w${Date.now()}`, date: new Date().toISOString(), type: "reward", desc, amount: 0, balance: state.coins });
      save();
    },
    entry,
    reset() { localStorage.removeItem(KEY); location.reload(); },
  };
})();

/* ---------------- 토스트 ---------------- */
let walletToastTimer;
function walletToast(msg) {
  if (typeof toast === "function") return toast(msg); // 마이페이지는 기존 토스트 사용
  let el = document.getElementById("wallet-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "wallet-toast";
    el.setAttribute("role", "status");
    el.className = "fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 border-2 border-term bg-console px-5 py-2.5 text-sm text-ink shadow-lg";
    document.body.appendChild(el);
  }
  el.innerHTML = `<span class="mr-1.5 font-mono text-term">&gt;</span>${String(msg).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}`;
  el.hidden = false;
  clearTimeout(walletToastTimer);
  walletToastTimer = setTimeout(() => (el.hidden = true), 2400);
}

const coinLabel = (n) => `${n.toLocaleString("ko-KR")}코인`;

/* ---------------- 공통 모달 틀 ---------------- */
function openWalletModal(title, paint, onClick) {
  const wrap = document.createElement("div");
  wrap.className = "fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center";
  document.body.appendChild(wrap);
  document.body.style.overflow = "hidden";
  const opener = document.activeElement;

  const close = () => {
    wrap.remove();
    document.body.style.overflow = "";
    window.removeEventListener("keydown", onKey);
    opener?.focus?.();
  };
  const onKey = (e) => e.key === "Escape" && close();
  window.addEventListener("keydown", onKey);

  const render = () => {
    wrap.innerHTML = `<div role="dialog" aria-modal="true" aria-label="${title}" data-dialog
        class="pixel-window max-h-[92vh] w-full overflow-y-auto bg-panel sm:max-w-[460px]">
      <div class="window-bar"><span class="window-label"><span class="pixel-icon pixel-window-icon" aria-hidden="true"></span>${title}</span>
        <span class="window-lines" aria-hidden="true"></span>
        <button data-close aria-label="닫기" class="grid size-7 place-items-center font-mono text-sm hover:text-term">X</button>
      </div>
      <div class="p-5">${paint()}</div>
    </div>`;
    wrap.querySelector("[data-dialog] .p-5 button")?.focus();
  };
  render();

  wrap.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dialog]") || e.target.closest("[data-close]")) return close();
    onClick(e, { close, render });
  });
  return { close, render };
}

/* ---------------- 코인 충전 (시뮬레이션) ---------------- */
function openCoinCharge() {
  let pi = 2;
  let method = COIN_PAY_METHODS[0];
  let paying = false;

  openWalletModal("코인 충전", () => {
    const p = COIN_PACKAGES[pi];
    return `<p class="text-sm text-sub">보유 <b class="font-mono text-term">${coinLabel(Wallet.coins)}</b> <span class="text-xs">· 1코인 = 100원</span></p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        ${COIN_PACKAGES.map((x, i) => `<button data-pkg="${i}" aria-pressed="${i === pi}" class="${[
          "border-2 px-3 py-2.5 text-left transition-colors",
          i === pi ? "border-term bg-term text-console" : "border-line hover:border-term",
          i === COIN_PACKAGES.length - 1 ? "col-span-2" : "",
        ].join(" ")}">
          <span class="block font-bold">${coinLabel(x.coins)}${x.bonus ? ` <span class="text-xs ${i === pi ? "" : "text-up"}">+${x.bonus}</span>` : ""}</span>
          <span class="text-xs ${i === pi ? "text-console/80" : "text-sub"}">₩${x.won.toLocaleString("ko-KR")}</span>
        </button>`).join("")}
      </div>
      <p class="mt-5 text-sm font-semibold">결제 수단</p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        ${COIN_PAY_METHODS.map((m) => `<button data-method="${m}" aria-pressed="${m === method}" class="${[
          "h-8 border px-3 text-xs",
          m === method ? "border-term text-term" : "border-line text-sub hover:text-ink",
        ].join(" ")}">${m}</button>`).join("")}
      </div>
      <dl class="mt-5 space-y-1.5 bg-soft p-4 text-sm">
        <div class="flex justify-between"><dt class="text-sub">결제 금액</dt><dd class="font-mono">₩${p.won.toLocaleString("ko-KR")}</dd></div>
        <div class="flex justify-between"><dt class="text-sub">충전 코인</dt><dd class="font-mono text-term">+${p.coins + p.bonus}</dd></div>
        <div class="flex justify-between border-t border-line pt-1.5 font-semibold"><dt>충전 후</dt><dd class="font-mono">${coinLabel(Wallet.coins + p.coins + p.bonus)}</dd></div>
      </dl>
      <button data-pay class="terminal-button primary mt-5 justify-center" style="width:100%" ${paying ? "disabled" : ""}>${paying ? "결제 진행 중..." : `₩${p.won.toLocaleString("ko-KR")} 결제하기`}</button>
      <p class="mt-2 text-center text-xs text-sub">시뮬레이션 화면이에요. 실제 결제는 진행되지 않아요.</p>`;
  }, (e, { close, render }) => {
    const t = e.target.closest("[data-pkg],[data-method],[data-pay]");
    if (!t || paying) return;
    if (t.dataset.pkg) { pi = +t.dataset.pkg; render(); }
    else if (t.dataset.method) { method = t.dataset.method; render(); }
    else {
      paying = true;
      render();
      setTimeout(() => {
        const p = COIN_PACKAGES[pi];
        Wallet.charge(p, method);
        close();
        walletToast(`${coinLabel(p.coins + p.bonus)} 충전 완료 (시뮬레이션)`);
      }, 700);
    }
  });
}

/* ---------------- 구매 확인 ----------------
   cost 코인을 쓰기 전에 확인받고, 부족하면 충전으로 안내 */
function confirmCoinPurchase({ title, detail, cost, desc, apply, done }) {
  openWalletModal("결제 확인", () => {
    const enough = Wallet.coins >= cost;
    return `<p class="font-bold">${title}</p>
      ${detail ? `<p class="mt-1 text-sm text-sub">${detail}</p>` : ""}
      <dl class="mt-4 space-y-1.5 bg-soft p-4 text-sm">
        <div class="flex justify-between"><dt class="text-sub">보유 코인</dt><dd class="font-mono">${coinLabel(Wallet.coins)}</dd></div>
        <div class="flex justify-between"><dt class="text-sub">사용 코인</dt><dd class="font-mono text-up">-${cost}</dd></div>
        <div class="flex justify-between border-t border-line pt-1.5 font-semibold"><dt>결제 후</dt><dd class="font-mono ${enough ? "" : "text-up"}">${enough ? coinLabel(Wallet.coins - cost) : `${cost - Wallet.coins}코인 부족`}</dd></div>
      </dl>
      <div class="mt-5 flex gap-2">
        <button data-close class="terminal-button flex-1 justify-center">취소</button>
        ${enough
          ? `<button data-buy class="terminal-button primary flex-1 justify-center">${coinLabel(cost)} 사용</button>`
          : `<button data-charge class="terminal-button primary flex-1 justify-center">코인 충전하기</button>`}
      </div>`;
  }, (e, { close, render }) => {
    if (e.target.closest("[data-charge]")) {
      close();
      openCoinCharge();
    } else if (e.target.closest("[data-buy]")) {
      if (Wallet.spend(cost, desc, apply)) {
        close();
        walletToast(done);
      } else render();
    }
  });
}

/* ---------------- 리워드 광고 (시뮬레이션) ---------------- */
function watchRewardAd(onReward) {
  let left = 5;
  let timer;
  const modal = openWalletModal("광고 시청", () => left > 0
    ? `<div class="grid aspect-video place-items-center border-2 border-dashed border-line bg-console text-center">
        <div><p class="font-mono text-xs text-sub">[AD] 광고 재생 중</p><p class="mt-2 font-mono text-4xl font-bold text-term">${left}</p></div>
      </div>
      <p class="mt-3 text-center text-xs text-sub">끝까지 보면 분기 재선택권 1장을 드려요. (시뮬레이션)</p>`
    : `<p class="text-center font-bold text-term">보상 지급 완료!</p>
      <p class="mt-1 text-center text-sm text-sub">분기 재선택권 1장을 받았어요.</p>
      <button data-close class="terminal-button primary mt-5 justify-center" style="width:100%">확인</button>`,
  () => {});
  timer = setInterval(() => {
    if (!document.body.contains(document.querySelector("[data-dialog]"))) return clearInterval(timer);
    left -= 1;
    if (left <= 0) { clearInterval(timer); onReward(); }
    modal.render();
  }, 1000);
}
