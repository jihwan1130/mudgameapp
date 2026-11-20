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

async function start() {
  const query = new URLSearchParams(location.search);
  const resumed = query.has("continue");
  const save = readWhatifSave();
  const work = gameById(resumed ? save?.id : query.get("game"));

  if (!work) return notFound(resumed ? "저장된 작품이 없어요" : "작품을 찾지 못했어요");
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
  ].join("");

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

start();
