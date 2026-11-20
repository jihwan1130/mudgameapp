import { WISHLIST_IDS } from "@/data/user";
import { workById } from "@/data/works";
import WorkCard from "../WorkCard";
import { HeartIcon } from "../Icons";

export default function WishlistTab() {
  return (
    <div>
      <p className="mb-4 flex items-center gap-1.5 text-sm text-sub">
        <HeartIcon className="size-4 text-up" /> 찜한 작품 <b className="font-mono text-ink">{WISHLIST_IDS.length}</b>
      </p>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6">
        {WISHLIST_IDS.map((id) => (
          <WorkCard key={id} work={workById(id)} />
        ))}
      </div>
    </div>
  );
}
