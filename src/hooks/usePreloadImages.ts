import { useEffect, useMemo, useRef, useState } from "react";

type PreloadState = {
  total: number;
  loaded: number;
  errors: number;
};

export function usePreloadImages(urls: string[]) {
  const uniqueUrls = useMemo(() => {
    return Array.from(new Set((urls ?? []).filter(Boolean)));
  }, [urls]);

  const [state, setState] = useState<PreloadState>(() => ({
    total: uniqueUrls.length,
    loaded: 0,
    errors: 0,
  }));

  const doneRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    doneRef.current = new Set();
    setState({ total: uniqueUrls.length, loaded: 0, errors: 0 });

    if (uniqueUrls.length === 0) return;

    const markDone = (url: string, ok: boolean) => {
      if (cancelled) return;
      if (doneRef.current.has(url)) return;
      doneRef.current.add(url);

      setState((prev) => ({
        total: prev.total,
        loaded: Math.min(prev.loaded + 1, prev.total),
        errors: prev.errors + (ok ? 0 : 1),
      }));
    };

    uniqueUrls.forEach((url) => {
      const img = new Image();

      img.onload = () => {
        const decode = img.decode?.bind(img);
        if (!decode) return markDone(url, true);

        decode()
          .catch(() => {
            // ignore decode errors; treat as loaded
          })
          .finally(() => markDone(url, true));
      };

      img.onerror = () => markDone(url, false);
      img.src = url;

      // If the image is already in cache, onload may be delayed; handle immediately.
      if (img.complete) {
        markDone(url, img.naturalWidth > 0);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [uniqueUrls]);

  const progress = state.total === 0 ? 1 : state.loaded / state.total;
  const isReady = state.total === 0 ? true : state.loaded >= state.total;

  return {
    ...state,
    progress,
    isReady,
  };
}

