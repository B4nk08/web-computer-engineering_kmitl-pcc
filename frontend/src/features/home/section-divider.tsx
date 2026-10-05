import { CLUSTER_THEME } from "@/config/cluster-theme";
import { cn } from "@/lib/utils";

type Tone = "white" | "surface";

const BG: Record<Tone, string> = {
  white: "bg-white",
  surface: "bg-[var(--surface)]",
};

const FILL: Record<Tone, string> = {
  white: "text-white",
  surface: "text-[var(--surface)]",
};

/** รอยต่อโค้งระหว่างสองส่วนที่สีพื้นต่างกัน */
export function WaveDivider({ from, to, flip = false }: { from: Tone; to: Tone; flip?: boolean }) {
  return (
    <div className={cn("relative -mt-px leading-[0]", BG[from])} aria-hidden>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn("block h-8 w-full sm:h-14", FILL[to], flip && "-scale-x-100")}
      >
        <path
          fill="currentColor"
          d="M0 48c120-22 240-34 360-28s240 30 360 36 240-10 360-26 240-22 360-10v60H0z"
          opacity="0.45"
        />
        <path
          fill="currentColor"
          d="M0 56c160 18 320 22 480 8s320-44 480-40 320 30 480 36v60H0z"
        />
      </svg>
    </div>
  );
}

/** ตัวคั่นระหว่างส่วนที่สีพื้นเดียวกัน */
export function DotDivider({ tone = "white" }: { tone?: Tone }) {
  return (
    <div className={cn("px-4 md:px-8", BG[tone])} aria-hidden>
      <div className="mx-auto flex max-w-[1200px] items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
        <span className="flex items-center gap-1.5">
          {(["software", "iot", "network", "data"] as const).map((code) => (
            <span key={code} className={cn("size-1.5 rounded-full", CLUSTER_THEME[code].bar)} />
          ))}
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
      </div>
    </div>
  );
}
