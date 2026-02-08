import { useEffect } from "react";

/**
 * Mobile browsers (iOS Safari / Chrome Android) may report `100vh` including the
 * area behind the address bar. This hook writes the *visible* viewport height
 * into a CSS variable (default: `--app-height`) using `visualViewport` when available.
 */
export function useAppHeightCssVar(varName: `--${string}` = "--app-height") {
  useEffect(() => {
    const root = document.documentElement;

    const set = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      // integer px avoids fractional layout jitter on some devices
      root.style.setProperty(varName, `${Math.round(h)}px`);
    };

    set();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", set);
    vv?.addEventListener("scroll", set);
    window.addEventListener("resize", set);
    window.addEventListener("orientationchange", set);

    return () => {
      vv?.removeEventListener("resize", set);
      vv?.removeEventListener("scroll", set);
      window.removeEventListener("resize", set);
      window.removeEventListener("orientationchange", set);
    };
  }, [varName]);
}

