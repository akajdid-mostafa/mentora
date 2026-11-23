import Image from "next/image";
import { cn } from "@/lib/utils";

export type Portrait = {
  /** A Lummi asset id. Faces are hotlinked and never ship in the download. */
  id: string;
  /** The asset's own pixels. The frame takes this aspect so the matte lines up. */
  width: number;
  height: number;
  /** The matte: the same silhouette, as the alpha of a PNG in `public/masks/`. */
  mask: string;
};

// The person the hero stands on its disc. The matte was lifted from this
// photograph and fits it only — replacing the face means replacing both, or
// pointing `src` at a PNG that already carries its transparency and dropping
// the mask.
export const portraits = {
  glasses: {
    id: "QmZVYS9mPeod3JfH5EvXzqffKCSYWjDm74YzWKFcp95dJY",
    width: 1632,
    height: 2912,
    mask: "/masks/glasses-white-shirt.png",
  },
} satisfies Record<string, Portrait>;

/** A person with the background taken out, standing on whatever is behind the
 *  frame. The matte is a CSS mask on the frame rather than a cut-out file, so
 *  the photograph stays on Lummi's host and only a silhouette ships.
 *
 *  `px` is the width asked of the host — twice the width the frame renders at. */
export function Cutout({
  portrait,
  px,
  className,
}: {
  portrait: Portrait;
  px: number;
  className?: string;
}) {
  const matte = `url(${portrait.mask})`;
  return (
    <div
      aria-hidden="true"
      className={cn("relative", className)}
      style={{
        aspectRatio: `${portrait.width} / ${portrait.height}`,
        maskImage: matte,
        WebkitMaskImage: matte,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      <Image
        src={`https://assets.lummi.ai/assets/${portrait.id}?w=${px}&fm=jpg&q=80`}
        alt=""
        fill
        unoptimized
        loading="eager"
        // the home page's largest paint: fetched first, not at the default
        // priority an eager image starts at
        fetchPriority="high"
        className="object-cover"
      />
    </div>
  );
}
