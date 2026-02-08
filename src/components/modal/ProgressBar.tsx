import { useEffect, useMemo, useRef, useState } from "react";
import { ClockIcon } from "../../icons";

type Props = {
  durationMs?: number;
  active?: boolean;
  resetKey?: string | number;
  onComplete?: () => void;
  className?: string;
  showTimeLeft?: boolean;
};

const DEFAULT_DURATION_MS = 30_000;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function ProgressBar({
  durationMs = DEFAULT_DURATION_MS,
  active = true,
  resetKey,
  onComplete,
  className,
  showTimeLeft = true,
}: Props) {
  const [remainingMs, setRemainingMs] = useState(durationMs);

  const rafIdRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const completedRef = useRef(false);

  const progress = useMemo(() => {
    if (durationMs <= 0) return 0;
    return clamp(remainingMs / durationMs, 0, 1);
  }, [durationMs, remainingMs]);

  useEffect(() => {
    // reset on key / duration changes
    setRemainingMs(durationMs);
    completedRef.current = false;
    startedAtRef.current = 0;
  }, [resetKey, durationMs]);

  useEffect(() => {
    if (!active) {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const tick = (now: number) => {
      if (!startedAtRef.current) startedAtRef.current = now;
      const elapsed = now - startedAtRef.current;
      const nextRemaining = Math.max(0, durationMs - elapsed);

      setRemainingMs((prev) =>
        Math.abs(prev - nextRemaining) < 40 ? prev : nextRemaining,
      );

      if (nextRemaining <= 0) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
        rafIdRef.current = null;
        return;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [active, durationMs, onComplete]);

  return (
    <div className={className}>
      <div
        className="relative h-5 w-full overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-label="Обратный отсчёт"
        aria-valuemin={0}
        aria-valuemax={durationMs}
        aria-valuenow={Math.round(remainingMs)}
      >
        <div
          className="h-full rounded-full transition-[width] duration-100 ease-linear"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, #7BBD00 0%, #E0F000 100%)",
          }}
        />
        {showTimeLeft && (
          <>
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
              {formatTime(remainingMs)}
            </div>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ClockIcon />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
