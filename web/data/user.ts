// =========================================================
//  whatif — 로그인 유저 mock 데이터
//  날짜는 기준일(MOCK_TODAY)에서 며칠 전인지로 만들어서 기간 필터가 항상 같게 동작해요.
// =========================================================

export const MOCK_TODAY = new Date("2026-11-20T12:00:00+09:00");

const daysAgo = (n: number) => {
  const d = new Date(MOCK_TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const USER = {
  nickname: "선택장인",
  handle: "choice_master",
  email: "player@whatif.example",
  joinedAt: daysAgo(412),
  cash: 12300, // 현재 보유 캐시 (₩)
};

// ---------- 내 서재 ----------
export const PURCHASED_IDS = [
  "horror-1", "mystery-1", "branch-3", "survival-1", "sf-4", "fantasy-2", "romance-1", "short-5",
];

export interface PlayingItem {
  workId: string;
  progress: number; // 0~100
  lastSave: string; // 마지막 저장 지점
  savedAt: string;
}

export const PLAYING: PlayingItem[] = [
  { workId: "horror-1", progress: 64, lastSave: "3장 · 복도 끝 철문 앞", savedAt: daysAgo(0) },
  { workId: "mystery-1", progress: 38, lastSave: "2장 · 현상수배 전단의 뒷면", savedAt: daysAgo(1) },
  { workId: "branch-3", progress: 81, lastSave: "5장 · 세 번째 선택지", savedAt: daysAgo(3) },
  { workId: "survival-1", progress: 12, lastSave: "1장 · 27층 비상계단", savedAt: daysAgo(9) },
  { workId: "sf-4", progress: 47, lastSave: "4장 · 기억 감정실", savedAt: daysAgo(21) },
];

// ---------- 엔딩 컬렉션 ----------
export interface EndingRecord {
  workId: string;
  endings: { name: string; found: boolean }[];
}

export const ENDINGS: EndingRecord[] = [
  {
    workId: "horror-1",
    endings: [
      { name: "불 켜진 복도", found: true },
      { name: "사진 속 열한 번째 사람", found: true },
      { name: "철문 너머", found: true },
      { name: "형광등이 꺼질 때", found: false },
      { name: "아무도 없었다", found: false },
      { name: "다시, 첫 번째 문", found: false },
      { name: "하얀 가운", found: false },
    ],
  },
  {
    workId: "mystery-1",
    endings: [
      { name: "이름을 부르지 않았다", found: true },
      { name: "맨발의 증인", found: true },
      { name: "현상금", found: false },
      { name: "발자국은 하나", found: false },
    ],
  },
  {
    workId: "branch-3",
    endings: [
      { name: "첫 번째를 골랐다면", found: true },
      { name: "두 번째를 골랐다면", found: true },
      { name: "세 번째 선택지", found: true },
      { name: "고르지 않았다", found: true },
      { name: "네 번째는 없었다", found: false },
    ],
  },
  {
    workId: "short-5",
    endings: [
      { name: "왼쪽 버튼", found: true },
      { name: "가운데 버튼", found: false },
      { name: "오른쪽 버튼", found: false },
    ],
  },
];

// ---------- 캐시 내역 ----------
export type CashType = "charge" | "use" | "refund";

export interface CashEntry {
  id: string;
  date: string;
  type: CashType;
  desc: string; // 작품명 또는 충전 수단
  amount: number; // +충전/환불, -사용
  balance: number; // 거래 후 잔액
}

const RAW_CASH: Omit<CashEntry, "id" | "balance">[] = [
  { date: daysAgo(170), type: "charge", desc: "신용카드 충전", amount: 30000 },
  { date: daysAgo(160), type: "use", desc: "백야 호텔 703호 · 소장", amount: -3500 },
  { date: daysAgo(130), type: "use", desc: "좀비 아파트 27층 · 소장", amount: -4000 },
  { date: daysAgo(118), type: "refund", desc: "좀비 아파트 27층 · 결제 취소", amount: 4000 },
  { date: daysAgo(96), type: "use", desc: "기억 판매소 · 대여 7일", amount: -1500 },
  { date: daysAgo(70), type: "charge", desc: "카카오페이 충전", amount: 10000 },
  { date: daysAgo(64), type: "use", desc: "세 번째 선택지 · 소장", amount: -4500 },
  { date: daysAgo(40), type: "use", desc: "용사 파티의 짐꾼입니다 · 회차구매 3화", amount: -900 },
  { date: daysAgo(33), type: "use", desc: "계약 연애 100일 · 소장", amount: -3000 },
  { date: daysAgo(21), type: "use", desc: "좀비 아파트 27층 · 소장", amount: -4000 },
  { date: daysAgo(14), type: "charge", desc: "토스페이 충전", amount: 5000 },
  { date: daysAgo(9), type: "use", desc: "맨발이라 부르지 마라 · 소장", amount: -3500 },
  { date: daysAgo(6), type: "use", desc: "자정의 자판기 · 소장", amount: -1000 },
  { date: daysAgo(2), type: "use", desc: "하얀 복도 · 소장", amount: -4000 },
];

// 잔액은 현재 보유 캐시에서 거꾸로 맞춰 계산
export const CASH_HISTORY: CashEntry[] = (() => {
  const total = RAW_CASH.reduce((s, e) => s + e.amount, 0);
  let bal = USER.cash - total;
  return RAW_CASH.map((e, i) => {
    bal += e.amount;
    return { ...e, id: `c${i + 1}`, balance: bal };
  }).reverse(); // 최신순
})();

// ---------- 구매 내역 ----------
export type PurchaseMethod = "소장" | "대여" | "회차구매";

export interface Purchase {
  workId: string;
  method: PurchaseMethod;
  paid: number;
  date: string;
  rentalDaysLeft?: number; // 대여만
  episodes?: number; // 회차구매만
}

export const PURCHASES: Purchase[] = [
  { workId: "horror-1", method: "소장", paid: 4000, date: daysAgo(2) },
  { workId: "short-5", method: "소장", paid: 1000, date: daysAgo(6) },
  { workId: "mystery-1", method: "소장", paid: 3500, date: daysAgo(9) },
  { workId: "survival-1", method: "소장", paid: 4000, date: daysAgo(21) },
  { workId: "romance-1", method: "소장", paid: 3000, date: daysAgo(33) },
  { workId: "fantasy-1", method: "회차구매", paid: 900, date: daysAgo(40), episodes: 3 },
  { workId: "branch-3", method: "소장", paid: 4500, date: daysAgo(64) },
  { workId: "sf-4", method: "대여", paid: 1500, date: daysAgo(96), rentalDaysLeft: 0 },
  { workId: "mystery-9", method: "소장", paid: 3500, date: daysAgo(160) },
  { workId: "horror-3", method: "대여", paid: 1200, date: daysAgo(1), rentalDaysLeft: 6 },
];

// ---------- 찜 ----------
export const WISHLIST_IDS = [
  "horror-5", "mystery-3", "branch-1", "fantasy-6", "sf-7", "romance-4", "survival-4", "short-2",
];

// ---------- 캐시 충전 상품 ----------
export const CASH_PRODUCTS = [
  { price: 1000, bonusRate: 0 },
  { price: 5000, bonusRate: 0 },
  { price: 10000, bonusRate: 5 },
  { price: 30000, bonusRate: 10 },
  { price: 50000, bonusRate: 15 },
];

export const PAY_METHODS = ["신용/체크카드", "카카오페이", "네이버페이", "토스페이", "휴대폰 결제"];
