// =========================================================
//  whatif — 작품 mock 데이터
//  장르마다 10개씩, 총 80개. 숫자(플레이 수 등)는 시드 기반으로 고정 생성.
// =========================================================

export type Genre =
  | "mystery"
  | "horror"
  | "branch"
  | "survival"
  | "fantasy"
  | "sf"
  | "romance"
  | "short";

export type Badge = "EVENT" | "UP" | "NEW" | "3다무" | "15";

export interface Work {
  id: string;
  title: string;
  genre: Genre;
  author: string;
  copy: string; // 한 줄 카피
  endings: number; // 엔딩 개수
  avgPlayMin: number; // 평균 플레이 시간(분)
  plays: number; // 누적 플레이 수
  badges: Badge[];
  price: number; // 소장가 (₩, 0 = 무료)
  isFree: boolean;
  isCompleted: boolean;
  isNew: boolean;
  poster?: string; // 실제 포스터가 있는 작품만
}

export interface GenreInfo {
  key: Genre;
  label: string;
  dir: string; // 섹션 제목 앞 "$ ls ./dir"
  gradient: [string, string]; // 플레이스홀더 썸네일 색
}

export const GENRES: GenreInfo[] = [
  { key: "mystery", label: "추리", dir: "mystery", gradient: ["#1f2a44", "#5b6b8c"] },
  { key: "horror", label: "공포", dir: "horror", gradient: ["#1a1a1a", "#7a1f2b"] },
  { key: "branch", label: "분기소설", dir: "branch", gradient: ["#3b2a6b", "#c07adb"] },
  { key: "survival", label: "생존", dir: "survival", gradient: ["#2f3a1f", "#a3884a"] },
  { key: "fantasy", label: "판타지", dir: "fantasy", gradient: ["#123b4a", "#4fb3a9"] },
  { key: "sf", label: "SF", dir: "sf", gradient: ["#0b1d3a", "#2f80ed"] },
  { key: "romance", label: "로맨스", dir: "romance", gradient: ["#f08a9b", "#ffd0b5"] },
  { key: "short", label: "단편", dir: "short", gradient: ["#3a3a3a", "#c9b38a"] },
];

export const genreInfo = (g: Genre) => GENRES.find((x) => x.key === g)!;

export const TABS = ["추천", ...GENRES.map((g) => g.label)] as const;

const TITLES: Record<Genre, string[]> = {
  mystery: [
    "맨발이라 부르지 마라", "13번째 증언", "밀실의 고양이", "붉은 우산 살인사건", "마지막 열차의 승객",
    "거짓말하는 탐정", "사라진 오후 3시", "유리 정원의 비밀", "백야 호텔 703호", "잉크가 마르기 전에",
  ],
  horror: [
    "하얀 복도", "문 너머의 숨소리", "새벽 4시 44분", "지하 3층 주차장", "인형의 집 이사 첫날",
    "붉은 방 안내문", "아무도 없는 교실", "거울 속 하숙생", "폐교 수학여행", "13층은 없습니다",
  ],
  branch: [
    "만약 그날 우산을 들었다면", "두 갈래 길의 끝", "세 번째 선택지", "너를 고르지 않은 세계", "시간을 접는 편지",
    "갈림길 정거장", "엔딩은 하나가 아니다", "다시 쓰는 어제", "선택하지 않은 문", "백 개의 결말",
  ],
  survival: [
    "좀비 아파트 27층", "무인도 30일", "마지막 편의점", "정전된 도시", "빙하기 캠핑장",
    "지하철 생존기", "산소 잔량 72시간", "폭설 산장", "방사능 구역 D-7", "배급표를 지켜라",
  ],
  fantasy: [
    "용사 파티의 짐꾼입니다", "마왕성 관리인", "마법학교 낙제생", "검은 숲의 계약", "왕녀의 서기관",
    "드래곤 하숙집", "별을 먹는 마법사", "회귀한 견습 기사", "정령의 숲 지도", "마지막 연금술사",
  ],
  sf: [
    "화성 기지 오류 보고서", "안드로이드는 꿈을 묻는다", "궤도 엘리베이터 정지", "기억 판매소", "2099 서울 야간택시",
    "클론의 생일", "승무원 7명 중 1명", "신호가 끊긴 행성", "타임루프 연구소", "AI 판사",
  ],
  romance: [
    "계약 연애 100일", "편의점 야간 알바와 단골손님", "옆집 작가님", "첫사랑 리셋 버튼", "비 오는 날의 서점",
    "사내 연애 금지 조항", "소꿉친구 재회 프로젝트", "고백 시뮬레이션", "여름밤 옥상 정원", "너의 엔딩이 되고 싶어",
  ],
  short: [
    "3분 미스터리", "엘리베이터 안의 1분", "마지막 문자", "한 장짜리 유서", "자정의 자판기",
    "버스 정류장 괴담", "커피 한 잔의 선택", "고양이의 하루", "잃어버린 우산", "5분 탈출",
  ],
};

const COPIES: Record<Genre, string[]> = {
  mystery: ["범인은 이 안에 있다", "단서는 이미 당신 손에", "모두가 거짓말을 한다", "시계는 거꾸로 가고 있었다", "마지막 증언을 믿을 것인가"],
  horror: ["문을 열 것인가, 말 것인가", "뒤를 돌아보지 마세요", "불이 꺼지면 시작된다", "그건 사람이 아니었다", "아직 끝나지 않았다"],
  branch: ["모든 선택에는 다른 내일이 있다", "어느 쪽을 골라도 후회할까", "당신의 결말은 몇 번째인가요", "같은 하루, 다른 끝", "고르지 않은 쪽이 궁금해진다"],
  survival: ["오늘 밤을 버틸 수 있을까", "식량은 사흘 치, 사람은 다섯", "믿을 사람은 나뿐", "살아남는 쪽을 고르세요", "구조 신호는 아직이다"],
  fantasy: ["검 대신 장부를 들었다", "마법은 늘 대가를 원한다", "전설은 짐꾼에게서 시작됐다", "계약서는 끝까지 읽을 것", "숲이 길을 바꾼다"],
  sf: ["시스템이 당신을 부르고 있다", "기억은 팔 수 있을까", "신호가 끊긴 지 37일째", "인간임을 증명하세요", "같은 하루가 또 시작됐다"],
  romance: ["이번엔 다른 대답을 할 수 있을까", "100일 뒤, 우리는", "고백 타이밍은 단 한 번", "비가 그치기 전에", "엔딩은 둘이 정하는 거야"],
  short: ["딱 5분이면 충분해요", "한 번의 선택, 한 번의 결말", "출근길에 한 편", "짧지만 오래 남는", "자기 전에 한 입"],
};

const AUTHORS = [
  "밤고양이", "선택장인", "무명작가K", "새벽세시", "이프랩", "갈림길", "회색토끼", "윤슬",
  "도서관유령", "레몬사탕", "북극곰", "로그아웃", "한밤의서점", "초록커서", "모래시계",
];

// 시드 기반 의사 난수 (항상 같은 값)
const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const POSTERS: Record<string, string> = {
  "하얀 복도": "/posters/white-corridor.png",
  "맨발이라 부르지 마라": "/posters/barefoot.png",
};

export const WORKS: Work[] = GENRES.flatMap(({ key }, gi) =>
  TITLES[key].map((title, i) => {
    const s = gi * 100 + i + 1;
    const r = rnd(s);
    const isShort = key === "short";
    const isFree = rnd(s + 7) < 0.18;
    const badges: Badge[] = [];
    if (rnd(s + 1) < 0.18) badges.push("EVENT");
    if (rnd(s + 2) < 0.22) badges.push("UP");
    const isNew = rnd(s + 3) < 0.2;
    if (isNew) badges.push("NEW");
    if (rnd(s + 4) < 0.15) badges.push("3다무");
    if (key === "horror" || rnd(s + 5) < 0.1) badges.push("15");

    return {
      id: `${key}-${i + 1}`,
      title,
      genre: key,
      author: AUTHORS[(gi * 3 + i) % AUTHORS.length],
      copy: COPIES[key][i % COPIES[key].length],
      endings: isShort ? 2 + Math.floor(r * 3) : 3 + Math.floor(r * 9),
      avgPlayMin: isShort ? 5 + Math.floor(rnd(s + 6) * 10) : 25 + Math.floor(rnd(s + 6) * 150),
      plays: Math.floor(800 + Math.pow(rnd(s + 8), 2) * 320000),
      badges,
      price: isFree ? 0 : (isShort ? 500 : 1500) + Math.floor(rnd(s + 9) * 6) * 500,
      isFree,
      isCompleted: rnd(s + 10) < 0.55,
      isNew,
      poster: POSTERS[title],
    } satisfies Work;
  })
);

// 메인 히어로 8개 (직접 고른 카피)
export const HERO: { id: string; copy: string }[] = [
  { id: "horror-1", copy: "문을 열 것인가, 말 것인가" },
  { id: "mystery-1", copy: "그 이름을 부르는 순간, 게임은 시작된다" },
  { id: "branch-1", copy: "우산 하나로 갈라진 두 개의 인생" },
  { id: "survival-1", copy: "27층, 계단은 막혔고 문밖엔 소리가 난다" },
  { id: "sf-5", copy: "목적지를 말해주세요. 단, 2099년 기준으로" },
  { id: "fantasy-1", copy: "용사보다 짐꾼이 먼저 진실을 알았다" },
  { id: "romance-2", copy: "새벽 2시, 그 손님은 오늘도 우유를 샀다" },
  { id: "short-5", copy: "자정에만 열리는 자판기, 버튼은 세 개" },
];

export const workById = (id: string) => WORKS.find((w) => w.id === id)!;
export const worksByGenre = (g: Genre) => WORKS.filter((w) => w.genre === g);
export const ranking = () => [...WORKS].sort((a, b) => b.plays - a.plays);

// 2차 필터 칩
export const CHIPS = [
  { key: "hot", label: "지금핫한", icon: "bolt" },
  { key: "rank", label: "실시간 랭킹" },
  { key: "new", label: "오늘신작" },
  { key: "free", label: "무료체험" },
  { key: "done", label: "완결추천" },
  { key: "multi", label: "멀티엔딩" },
  { key: "event", label: "이벤트" },
  { key: "short", label: "단편 한입" },
] as const;
export type ChipKey = (typeof CHIPS)[number]["key"];

const hotScore = (w: Work) =>
  (w.badges.includes("UP") ? 2 : 0) + (w.isNew ? 1 : 0) + Math.min(w.plays / 150000, 1);

export function worksByChip(chip: ChipKey): Work[] {
  const byPlays = ranking();
  switch (chip) {
    // 지금핫한: 급상승(UP) · 신작 우선, 그다음 플레이 수
    case "hot": return [...WORKS].sort((a, b) => hotScore(b) - hotScore(a));
    case "rank": return byPlays;
    case "new": return byPlays.filter((w) => w.isNew);
    case "free": return byPlays.filter((w) => w.isFree);
    case "done": return byPlays.filter((w) => w.isCompleted);
    case "multi": return [...WORKS].sort((a, b) => b.endings - a.endings);
    case "event": return byPlays.filter((w) => w.badges.includes("EVENT"));
    case "short": return byPlays.filter((w) => w.genre === "short");
  }
}
