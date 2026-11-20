import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeView from "@/components/HomeView";
import { TABS } from "@/data/works";

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const active = tab && (TABS as readonly string[]).includes(tab) ? tab : "추천";

  return (
    <>
      <Header activeTab={active} />
      <main className="mx-auto max-w-[1200px] px-4 md:px-6">
        <HomeView tab={active} />
      </main>
      <Footer />
    </>
  );
}
