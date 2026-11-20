/** 일반 회사 정보 푸터 + 맨 아래 터미널 상태바 */
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-[#fafafa]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 text-xs leading-6 text-sub md:px-6">
        <nav className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink">
          <a href="#" className="hover:underline">회사소개</a>
          <a href="#" className="hover:underline">이용약관</a>
          <a href="#" className="font-bold hover:underline">개인정보처리방침</a>
          <a href="#" className="hover:underline">청소년보호정책</a>
          <a href="#" className="hover:underline">작가 지원</a>
          <a href="#" className="hover:underline">고객센터</a>
        </nav>
        <p>(주)왓이프 · 대표 OOO · 사업자등록번호 000-00-00000 · 통신판매업신고 제0000-서울-0000호</p>
        <p>서울특별시 OO구 OO로 00 · 고객센터 0000-0000 (평일 10:00~18:00) · help@whatif.example</p>
        <p className="mt-2">© 2026 whatif. 모든 작품의 저작권은 각 작가에게 있습니다.</p>
      </div>
      <div className="border-t border-line bg-white">
        <p className="mx-auto max-w-[1200px] truncate px-4 py-2 font-mono text-[11px] text-term md:px-6">
          whatif@server:~$ online · 1,284 players exploring · v0.1.0
          <span className="term-cursor">_</span>
        </p>
      </div>
    </footer>
  );
}
