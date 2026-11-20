const CONTINUE_URL = "play.html?continue=1";
const escapeText = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));
const pixelIcon = (name) => '<span class="pixel-icon pixel-' + name + '" aria-hidden="true"></span>';

const query = new URLSearchParams(location.search);
const initialGenre = query.get("genre") || query.get("tab");
const state = {
  view: query.get("view") === "all" ? "all" : "rec",
  genre: WHATIF_FILTERS.includes(initialGenre) ? initialGenre : "전체",
  search: "",
  current: gameById(query.get("game"))?.id ?? null,
};

const nav = document.getElementById("nav");
const hero = document.getElementById("hero");
const filters = document.getElementById("filters");
const list = document.getElementById("list");
const search = document.getElementById("search");

function visibleGames() {
  const keyword = state.search.trim().toLocaleLowerCase("ko");
  const works = WHATIF_GAMES.filter((work) =>
    (state.genre === "전체" || work.genres.includes(state.genre)) &&
    (!keyword || [work.title, ...work.genres].some((value) => value.toLocaleLowerCase("ko").includes(keyword)))
  );
  if (state.view === "all") return works.sort((a, b) => a.title.localeCompare(b.title, "ko"));
  if (state.genre !== "전체") return works.sort((a, b) => a.genres.indexOf(state.genre) - b.genres.indexOf(state.genre));
  return works;
}

function renderNav(save) {
  const item = (key, href, icon, label) =>
    '<a href="' + href + '" data-nav="' + key + '"' + (state.view === key ? ' aria-current="page"' : "") + '>' + pixelIcon(icon) + label + '</a>';
  nav.innerHTML =
    item("rec", "index.html", "folder", "추천") +
    item("all", "index.html?view=all", "files", "전체 작품") +
    '<a href="' + CONTINUE_URL + '">' + pixelIcon("play") + '이어하기' + (save ? '<span class="save-dot" aria-label="저장 있음"></span>' : "") + '</a>' +
    '<a href="mypage.html">' + pixelIcon("user") + '마이페이지</a>';
}

function renderHero(works, save) {
  const index = works.findIndex((work) => work.id === state.current);
  const work = works[index];
  const disabled = works.length < 2 ? " disabled" : "";
  const titleBar = [
    '<div class="window-bar preview-bar">',
    '<span class="window-label">' + pixelIcon("window-icon") + '작품 미리보기</span>',
    '<span class="window-lines" aria-hidden="true"></span>',
    '<div class="banner-controls" aria-label="작품 전환">',
    '<span class="banner-counter" aria-live="polite">' + String(index + 1).padStart(2, "0") + ' / ' + String(works.length).padStart(2, "0") + '</span>',
    '<button type="button" data-move="-1" aria-label="이전 작품"' + disabled + '>' + pixelIcon("left") + '</button>',
    '<button type="button" data-move="1" aria-label="다음 작품"' + disabled + '>' + pixelIcon("right") + '</button>',
    '</div></div>',
  ].join("");

  if (!work) {
    hero.innerHTML = titleBar + '<div class="empty-banner"><h2>조건에 맞는 작품이 없어요</h2><p>다른 장르를 선택하거나 검색어를 지워 보세요.</p></div>';
    return;
  }

  hero.innerHTML = [
    titleBar,
    '<div class="banner-inner">',
    '<img class="banner-art" src="' + work.backdrop + '" alt="" fetchpriority="high" />',
    '<div class="banner-copy">',
    '<p class="command banner-command"><span class="prompt">~ $</span> open ./'+ work.id + '</p>',
    '<p class="banner-genres">' + work.genres.map((genre) => '<span>' + escapeText(genre) + '</span>').join("") + '</p>',
    '<h2 id="game-title" tabindex="-1">' + escapeText(work.title) + '</h2>',
    '<p class="banner-description">' + escapeText(work.desc) + '</p>',
    '<div class="banner-actions"><a class="terminal-button primary" href="' + playUrl(work.id) + '">' + pixelIcon("play") + '플레이</a>',
    save?.id === work.id ? '<a class="terminal-button" href="' + CONTINUE_URL + '">이어하기</a>' : "",
    '</div></div>',
    '<img class="featured-poster" src="' + work.poster + '" alt="' + escapeText(work.title) + ' 포스터" width="480" height="720" />',
    '</div>',
  ].join("");
}

function renderList(works) {
  document.getElementById("list-count").textContent = works.length + "편";
  filters.innerHTML = WHATIF_FILTERS.map((genre) =>
    '<button type="button" data-genre="' + genre + '" aria-pressed="' + (state.genre === genre) + '">' + genre + '</button>'
  ).join("");
  list.innerHTML = works.map((work) => {
    const selected = work.id === state.current;
    return [
      '<button type="button" class="poster-card" data-game="' + work.id + '" aria-pressed="' + selected + '">',
      '<span class="poster-image"><img src="' + work.poster + '" alt="" width="480" height="720" loading="lazy" decoding="async" /></span>',
      '<span class="poster-caption"><strong>' + escapeText(work.title) + '</strong>',
      '<span>' + escapeText(work.genres.join(" · ")) + '</span></span>',
      '</button>',
    ].join("");
  }).join("");
}

function render() {
  const works = visibleGames();
  if (!works.some((work) => work.id === state.current)) state.current = works[0]?.id ?? null;
  const save = readWhatifSave();
  renderNav(save);
  renderHero(works, save);
  renderList(works);

  const params = new URLSearchParams();
  if (state.view === "all") params.set("view", "all");
  if (state.genre !== "전체") params.set("genre", state.genre);
  if (state.current) params.set("game", state.current);
  const suffix = params.size ? "?" + params : "";
  if (location.protocol !== "file:") history.replaceState(null, "", location.pathname + suffix);
}

function move(step) {
  const works = visibleGames();
  if (works.length < 2) return;
  const index = works.findIndex((work) => work.id === state.current);
  state.current = works[(index + step + works.length) % works.length].id;
  const focused = document.activeElement.closest("[data-move], [data-game]");
  render();
  if (focused?.dataset.move) hero.querySelector('[data-move="' + focused.dataset.move + '"]').focus();
  if (focused?.dataset.game) list.querySelector('[aria-pressed="true"]').focus();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-genre],[data-game],[data-move],[data-nav]");
  if (!button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const { genre, game, move: direction, nav: view } = button.dataset;
  if (genre) {
    state.genre = genre;
    state.current = null;
    render();
    filters.querySelector('[aria-pressed="true"]').focus();
  } else if (game) {
    state.current = game;
    render();
    hero.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    document.getElementById("game-title").focus({ preventScroll: true });
  } else if (direction) {
    move(Number(direction));
  } else if (view) {
    event.preventDefault();
    state.view = view;
    state.genre = "전체";
    state.current = null;
    state.search = search.value = "";
    render();
    nav.querySelector('[aria-current="page"]').focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
  if (event.target === document.body || event.target.closest("#hero, #list")) {
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  }
});

search.addEventListener("input", () => {
  state.search = search.value;
  render();
});
window.addEventListener("storage", (event) => { if (event.key === WHATIF_SAVE_KEY) render(); });

document.getElementById("archive-count").textContent = "등록 작품 " + WHATIF_GAMES.length + "편";
render();
