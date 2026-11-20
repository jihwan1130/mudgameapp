import Image from "next/image";
import { genreInfo, type Work } from "@/data/works";
import { cx } from "@/lib/format";

/**
 * 썸네일 플레이스홀더: 장르별 그라데이션 + 큰 제목.
 * 실제 포스터가 있는 작품(work.poster)은 이미지를 보여줘요.
 * (썸네일에는 터미널 요소를 쓰지 않음)
 */
export default function Thumb({
  work,
  size = "sm",
  className,
  priority,
  bare,
}: {
  work: Work;
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
  bare?: boolean; // 썸네일 위 글자 없이 (랭킹 카드처럼 위에 다른 걸 얹을 때)
}) {
  const g = genreInfo(work.genre);
  // 같은 장르라도 작품마다 각도를 살짝 다르게
  const angle = 140 + ((work.id.length * 37 + work.title.length * 11) % 70);
  const light = work.genre === "romance";

  return (
    <div
      className={cx("overflow-hidden", !className?.includes("absolute") && "relative", className)}
      style={{ background: `linear-gradient(${angle}deg, ${g.gradient[0]}, ${g.gradient[1]})` }}
    >
      {work.poster ? (
        <Image
          src={work.poster}
          alt={`${work.title} 포스터`}
          fill
          priority={priority}
          sizes={size === "lg" ? "(max-width: 768px) 90vw, 720px" : "(max-width: 768px) 40vw, 200px"}
          className="object-cover"
          style={size === "lg" ? { objectPosition: "center 30%" } : undefined}
        />
      ) : (
        <>
          {/* 은은한 빛 */}
          <div className="absolute -right-1/4 -top-1/4 size-3/4 rounded-full bg-white/15 blur-2xl" />
          {!bare && <div className="absolute inset-0 flex flex-col justify-end p-[8%]">
            <span
              className={cx(
                "mb-1 text-[0.62em] font-semibold tracking-wide opacity-80",
                light ? "text-ink/70" : "text-white/80"
              )}
            >
              {g.label}
            </span>
            <span
              className={cx(
                "font-extrabold leading-[1.15] break-keep",
                light ? "text-ink" : "text-white",
                size === "lg" ? "text-[1.6em]" : size === "md" ? "text-[1.15em]" : "text-[0.95em]"
              )}
            >
              {work.title}
            </span>
          </div>}
        </>
      )}
    </div>
  );
}
