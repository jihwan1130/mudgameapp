import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MyPageView from "@/components/mypage/MyPageView";

export const metadata: Metadata = { title: "마이페이지 — whatif" };

export default function MyPage() {
  return (
    <>
      <Header activeTab={null} />
      <main className="mx-auto max-w-[1200px] px-4 pt-6 md:px-6 md:pt-8">
        <MyPageView />
      </main>
      <Footer />
    </>
  );
}
