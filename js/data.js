// 마이페이지에 필요한 작품 목록과 계정 데모 데이터.
const GENRES = [
  { key: "mystery", label: "추리" },
  { key: "horror", label: "공포" },
  { key: "branch", label: "분기소설" },
  { key: "survival", label: "생존" },
  { key: "fantasy", label: "판타지" },
  { key: "sf", label: "SF" },
  { key: "romance", label: "로맨스" },
  { key: "short", label: "단편" },
];
const TABS = ["추천", ...WHATIF_FILTERS.slice(1)];
const AUTHORS = ["밤고양이", "선택장인", "무명작가K", "새벽세시", "이프랩", "갈림길", "회색토끼", "윤슬", "도서관유령", "레몬사탕", "북극곰", "로그아웃", "한밤의서점", "초록커서", "모래시계"];

function rnd(seed) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
}

const WORKS = WHATIF_GAMES.map((work, index) => {
  const legacyId = Object.keys(WHATIF_ALIASES).find((id) => WHATIF_ALIASES[id] === work.id) ?? work.id;
  const [key, number] = legacyId.split("-");
  const genreIndex = GENRES.findIndex((genre) => genre.key === key);
  const familyIndex = genreIndex < 0 ? GENRES.findIndex((genre) => genre.label === work.genres[0]) : genreIndex;
  const ordinal = Number(number) || index + 1;
  const seed = (genreIndex < 0 ? 8 + index : genreIndex) * 100 + ordinal;
  const short = key === "short";
  const badges = [];
  if (rnd(seed + 1) < 0.18) badges.push("EVENT");
  if (rnd(seed + 2) < 0.22) badges.push("UP");
  if (rnd(seed + 3) < 0.2) badges.push("NEW");
  if (rnd(seed + 4) < 0.15) badges.push("3다무");
  if (key === "horror" || rnd(seed + 5) < 0.1) badges.push("15");
  return {
    ...work,
    author: AUTHORS[(Math.max(0, familyIndex) * 3 + ordinal - 1) % AUTHORS.length],
    endings: short ? 2 + Math.floor(rnd(seed) * 3) : 3 + Math.floor(rnd(seed) * 9),
    avgPlayMin: short ? 5 + Math.floor(rnd(seed + 6) * 10) : 25 + Math.floor(rnd(seed + 6) * 150),
    isFree: isFreeGame(work.id),
    badges,
  };
});

const workById = (id) => {
  const game = gameById(id);
  return WORKS.find((work) => work.id === game?.id);
};
/* ---------------- 로그인 유저 ---------------- */

const MOCK_TODAY = new Date("2026-11-20T12:00:00+09:00");
const daysAgo = (n) => {
  const d = new Date(MOCK_TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const USER = {
  nickname: "선택장인",
  handle: "choice_master",
  email: "player@whatif.example",
  joinedAt: daysAgo(412),
};

const PURCHASED_IDS = ["horror-1", "branch-3", "survival-1", "sf-4", "fantasy-2", "romance-1", "short-5"];

const PLAYING = [
  { workId: "horror-1", progress: 64, lastSave: "3장 · 복도 끝 철문 앞", savedAt: daysAgo(0) },
  { workId: "mystery-1", progress: 38, lastSave: "2장 · 현상수배 전단의 뒷면", savedAt: daysAgo(1) },
  { workId: "branch-3", progress: 81, lastSave: "5장 · 세 번째 선택지", savedAt: daysAgo(3) },
  { workId: "survival-1", progress: 12, lastSave: "1장 · 27층 비상계단", savedAt: daysAgo(9) },
  { workId: "sf-4", progress: 47, lastSave: "4장 · 기억 감정실", savedAt: daysAgo(21) },
];

const ENDINGS = [
  { workId: "horror-1", endings: [
    { name: "불 켜진 복도", found: true }, { name: "사진 속 열한 번째 사람", found: true }, { name: "철문 너머", found: true },
    { name: "형광등이 꺼질 때", found: false }, { name: "아무도 없었다", found: false }, { name: "다시, 첫 번째 문", found: false }, { name: "하얀 가운", found: false },
  ] },
  { workId: "mystery-1", endings: [
    { name: "이름을 부르지 않았다", found: true }, { name: "맨발의 증인", found: true }, { name: "현상금", found: false }, { name: "발자국은 하나", found: false },
  ] },
  { workId: "branch-3", endings: [
    { name: "첫 번째를 골랐다면", found: true }, { name: "두 번째를 골랐다면", found: true }, { name: "세 번째 선택지", found: true },
    { name: "고르지 않았다", found: true }, { name: "네 번째는 없었다", found: false },
  ] },
  { workId: "short-5", endings: [
    { name: "왼쪽 버튼", found: true }, { name: "가운데 버튼", found: false }, { name: "오른쪽 버튼", found: false },
  ] },
];

// 코인 잔액 · 내역은 js/wallet.js (Wallet) 에서 관리해요.

const PURCHASES = [
  { workId: "horror-1", method: "소장", paid: 8, date: daysAgo(2) },
  { workId: "short-5", method: "소장", paid: 3, date: daysAgo(6) },
  { workId: "survival-1", method: "소장", paid: 8, date: daysAgo(21) },
  { workId: "romance-1", method: "소장", paid: 8, date: daysAgo(33) },
  { workId: "fantasy-1", method: "회차구매", paid: 3, date: daysAgo(40), episodes: 3 },
  { workId: "branch-3", method: "소장", paid: 8, date: daysAgo(64) },
  { workId: "sf-4", method: "대여", paid: 4, date: daysAgo(96), rentalDaysLeft: 0 },
  { workId: "mystery-9", method: "소장", paid: 8, date: daysAgo(160) },
  { workId: "horror-3", method: "대여", paid: 4, date: daysAgo(1), rentalDaysLeft: 6 },
];

const WISHLIST_IDS = ["horror-5", "mystery-3", "branch-1", "fantasy-6", "sf-7", "romance-4", "survival-4", "short-2"];
