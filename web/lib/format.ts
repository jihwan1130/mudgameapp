export const won = (n: number) => `₩${Math.abs(n).toLocaleString("ko-KR")}`;

export const signedWon = (n: number) => `${n >= 0 ? "+" : "-"}${won(n)}`;

/** 12345 → "1.2만", 980 → "980" */
export const compact = (n: number) => {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? Math.round(v) : Number(v.toFixed(1))}만`;
  }
  return n.toLocaleString("ko-KR");
};

export const playTime = (min: number) =>
  min >= 60 ? `${Math.floor(min / 60)}시간${min % 60 ? ` ${min % 60}분` : ""}` : `${min}분`;

/** ISO → "2026.11.18" */
export const ymd = (iso: string) => {
  const d = new Date(iso);
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
};

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
