import { cn } from "@/lib/cn";

export function Avatar({
  initials,
  color,
  imageUrl,
  size = 40,
  className,
}: {
  initials: string;
  color: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shrink-0 rounded-full grid place-items-center font-semibold text-[#2d2d2d] overflow-hidden",
        className
      )}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.max(11, Math.round(size * 0.36)),
      }}
      aria-hidden
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        initials
      )}
    </div>
  );
}
