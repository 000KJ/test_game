type Props = {
  progress: number; // 0..1
  loaded: number;
  total: number;
};

export function AppLoader({ progress, loaded, total }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70 backdrop-blur-[6px]" />

      {/* content */}
      <div className="relative mx-4 w-full max-w-[420px] rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/15" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-white/90 border-r-white/40" />
            <div className="absolute inset-2 rounded-full bg-white/5" />
          </div>

          <div className="min-w-0">
            <div
              className="text-white"
              style={{
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.2,
              }}
            >
              Загрузка ресурсов…
            </div>
            <div className="mt-1 text-sm text-white/75">
              {loaded}/{total} · {pct}%
            </div>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-300 transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-4 text-xs text-white/55">
          Подготавливаем поле и картинки. Это займёт пару секунд.
        </div>
      </div>
    </div>
  );
}

