import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import AppProvider from "@/components/AppProvider";
import "./globals.css";

// 터미널 포인트용 모노스페이스 (본문은 Pretendard)
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "whatif — 선택이 이야기를 바꾸는 곳",
  description: "플레이어의 선택에 따라 이야기가 갈라지는 텍스트 MUD 게임 · 인터랙티브 소설 플랫폼",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={mono.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
