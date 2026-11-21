const play = document.getElementById("play");
const status = document.getElementById("status");
const formatDate = (time) => new Date(time).toLocaleString("ko-KR", { hour12: false });
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
const escapeText = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

function notFound(message) {
  play.innerHTML = [
    '<div class="pixel-window empty-banner story-panel"><p class="command prompt">[404]</p>',
    '<h1>' + escapeText(message) + '</h1>',
    '<a href="index.html" class="terminal-button primary">작품 고르기</a></div>',
  ].join("");
}

let currentWork = null;

async function start() {
  const query = new URLSearchParams(location.search);
  const resumed = query.has("continue");
  const save = readWhatifSave();
  const work = gameById(resumed ? save?.id : query.get("game"));

  if (!work) return notFound(resumed ? "저장된 작품이 없어요" : "작품을 찾지 못했어요");
  currentWork = work;
  document.title = work.title + " — WHATIF";

  play.innerHTML = [
    '<section class="pixel-window play-banner">',
    '<img class="banner-art" src="' + work.backdrop + '" alt="" fetchpriority="high" />',
    '<img class="featured-poster" src="' + work.poster + '" alt="' + escapeText(work.title) + ' 포스터" width="480" height="720" />',
    '<div class="banner-copy">',
    '<p class="banner-genres">' + work.genres.map((genre) => '<span>' + escapeText(genre) + '</span>').join("") + '</p>',
    '<h1>' + escapeText(work.title) + '</h1>',
    '</div></section>',
    '<article class="pixel-window story-panel" aria-label="첫 장면">',
    '<div class="window-bar story-bar"><span class="pixel-icon pixel-window-icon" aria-hidden="true"></span> play ./'+ work.id + '<span class="window-lines" aria-hidden="true"></span></div>',
    '<div class="story-content">',
    '<p class="command"><span class="prompt">&gt;</span> ' + (resumed ? '저장된 지점 · ' + escapeText(formatDate(save.savedAt)) : '새 이야기를 시작합니다') + '</p>',
    '<div id="scene" class="story-lines"></div>',
    '<div id="after" class="story-after" hidden></div>',
    '</div></article>',
    '<section id="shop" class="pixel-window story-panel shop-panel" aria-label="회차 · 결제"></section>',
  ].join("");

  renderShop(work);
  Wallet.onChange(() => renderShop(work));

  const scene = document.getElementById("scene");
  const showInstantly = resumed || matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const line of work.intro) {
    const paragraph = document.createElement("p");
    scene.appendChild(paragraph);
    if (showInstantly) {
      paragraph.textContent = line;
      continue;
    }
    for (const character of line) {
      paragraph.textContent += character;
      await delay(24);
    }
    await delay(180);
  }

  const savedAt = Date.now();
  let saved = false;
  try {
    localStorage.setItem(WHATIF_SAVE_KEY, JSON.stringify({ id: work.id, savedAt }));
    status.textContent = "[SAVE] " + work.title + " · " + formatDate(savedAt);
    saved = true;
  } catch {
    status.textContent = "[SAVE ERROR] 브라우저에 저장할 수 없어요";
  }

  const after = document.getElementById("after");
  after.hidden = false;
  after.innerHTML = [
    '<p class="story-notice">' + (saved ? '첫 장면을 저장했어요. ' : '')
      + (work.externalUrl ? '본편은 새 탭에서 열려요.' : '선택지가 있는 본편은 준비 중이에요.') + '</p>',
    '<div class="story-actions">',
    work.externalUrl
      ? '<a class="terminal-button primary" href="' + escapeText(work.externalUrl) + '" target="_blank" rel="noopener noreferrer">게임 시작 ↗</a>'
      : '',
    '<a class="terminal-button" href="' + playUrl(work.id) + '">처음부터</a>',
    '<a class="terminal-button' + (work.externalUrl ? '' : ' primary') + '" href="' + gameUrl(work.id) + '">작품 목록으로</a>',
    '</div>',
  ].join("");
}

/* ---------------- 회차 · 결제 패널 (시뮬레이션) ---------------- */
function renderShop(work) {
  const shop = document.getElementById("shop");
  const free = isFreeGame(work.id);
  const owned = Wallet.ownsWork(work.id);
  const P = WHATIF_PRICE;
  const lockedCount = Array.from({ length: work.episodes }, (_, i) => i + 1).filter((n) => !Wallet.episodeOpen(work.id, n)).length;

  const episodes = Array.from({ length: work.episodes }, (_, i) => {
    const n = i + 1;
    const open = Wallet.episodeOpen(work.id, n);
    const tag = free ? "무료" : n <= P.freeEpisodes ? "무료" : open ? "소장" : P.episode + "코인";
    return '<button type="button" class="episode' + (open ? " is-open" : " is-locked") + '" data-ep="' + n + '">'
      + '<span class="episode-no">' + String(n).padStart(2, "0") + '화</span>'
      + '<span class="episode-tag">' + (open ? "" : '<span class="pixel-icon pixel-lock" aria-hidden="true"></span>') + tag + '</span>'
      + '</button>';
  }).join("");

  const rerolls = Wallet.rerolls(work.id);
  const hidden = Wallet.hiddenOpen(work.id);
  const item = (title, desc, price, action, label, disabled) =>
    '<li class="shop-item"><div><p class="shop-item-title">' + title + '</p><p class="shop-item-desc">' + desc + '</p></div>'
    + '<div class="shop-item-side"><span class="shop-price">' + price + '</span>'
    + '<button type="button" class="terminal-button' + (disabled ? "" : " primary") + '" data-buy="' + action + '"' + (disabled ? " disabled" : "") + '>' + label + '</button></div></li>';

  shop.innerHTML = [
    '<div class="window-bar story-bar"><span class="pixel-icon pixel-files" aria-hidden="true"></span> 회차 · 결제',
    '<span class="window-lines" aria-hidden="true"></span>',
    '<button type="button" class="coin-chip" data-buy="charge" aria-label="코인 충전">◎ ' + coinLabel(Wallet.coins) + ' <b>충전</b></button></div>',
    '<div class="shop-body">',
    free
      ? '<p class="shop-banner free">[FREE] 무료 작품이에요. 전 회차 · 분기 재선택 · 히든 엔딩을 코인 없이 즐길 수 있어요.</p>'
      : '<p class="shop-banner">1~' + P.freeEpisodes + '화 무료 · 이후 화당 ' + P.episode + '코인' + (owned ? ' · <b>전 회차 소장 중</b>' : '') + '</p>',
    '<h2 class="shop-heading">회차 <span>' + work.episodes + '화</span></h2>',
    '<div class="episode-grid">' + episodes + '</div>',
    '<h2 class="shop-heading">결제 상품</h2>',
    '<ul class="shop-list">',
    free ? "" : item("작품 결제 · 전 회차 소장", "남은 유료 회차를 한 번에 열어요. 회차 합계보다 20% 저렴해요.",
      owned ? "소장 완료" : coinLabel(workPrice(work)), "work", owned ? "소장 중" : "소장하기", owned || !lockedCount),
    item("분기 재선택권", "지나간 선택지로 돌아가 다른 길을 고를 수 있어요. 보유 <b>" + (free ? "무제한" : rerolls + "장") + "</b>",
      free ? "무료" : coinLabel(P.reroll), "reroll", free ? "무료 작품" : "구매", free),
    free ? "" : item("리워드 광고", "광고를 끝까지 보면 분기 재선택권 1장을 무료로 드려요.", "무료", "ad", "광고 보기", false),
    item("히든 엔딩 해금", "숨겨진 엔딩 루트를 바로 열어요.", hidden ? "해금됨" : coinLabel(P.hidden), "hidden", hidden ? "해금 완료" : "해금", hidden),
    item("월 구독 패스", "모든 작품 회차 무제한 · 재선택권 매월 10장. (가설, 검증 후 도입)",
      "₩" + P.passWon.toLocaleString("ko-KR") + "/월", "pass", "준비 중", true),
    '</ul>',
    '<p class="shop-note">시뮬레이션이에요. 실제 결제는 일어나지 않고, 코인과 해금 내역은 이 브라우저에만 저장돼요.</p>',
    '</div>',
  ].join("");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("#shop [data-ep], #shop [data-buy]");
  if (!target || target.disabled) return;
  const work = currentWork;
  if (!work) return;
  const P = WHATIF_PRICE;
  const { ep, buy } = target.dataset;

  if (ep) {
    const n = Number(ep);
    if (Wallet.episodeOpen(work.id, n)) {
      status.textContent = "[READ] " + work.title + " · " + n + "화";
      return walletToast(n + "화를 열었어요 (시뮬레이션)");
    }
    return confirmCoinPurchase({
      title: work.title + " · " + n + "화",
      detail: "이 회차를 소장해요.",
      cost: P.episode,
      desc: work.title + " · " + n + "화",
      apply: () => Wallet.entry(work.id).eps.push(n),
      done: n + "화를 열었어요",
    });
  }
  if (buy === "charge") return openCoinCharge();
  if (buy === "work") {
    return confirmCoinPurchase({
      title: work.title + " · 전 회차 소장",
      detail: "1~" + work.episodes + "화를 모두 소장해요. (이미 산 회차가 있어도 소장가는 같아요)",
      cost: workPrice(work),
      desc: work.title + " · 작품 소장",
      apply: () => { Wallet.entry(work.id).owned = true; },
      done: "전 회차를 소장했어요",
    });
  }
  if (buy === "reroll") {
    return confirmCoinPurchase({
      title: "분기 재선택권 1장",
      detail: work.title + "에서 쓸 수 있어요.",
      cost: P.reroll,
      desc: work.title + " · 분기 재선택권",
      apply: () => { Wallet.entry(work.id).rerolls += 1; },
      done: "분기 재선택권 1장을 샀어요",
    });
  }
  if (buy === "ad") return watchRewardAd(() => Wallet.grantReroll(work.id, work.title + " · 광고 보상 재선택권"));
  if (buy === "hidden") {
    return confirmCoinPurchase({
      title: work.title + " · 히든 엔딩",
      detail: "숨겨진 엔딩 루트를 열어요.",
      cost: P.hidden,
      desc: work.title + " · 히든 엔딩 해금",
      apply: () => { Wallet.entry(work.id).hidden = true; },
      done: "히든 엔딩을 해금했어요",
    });
  }
});

start();
