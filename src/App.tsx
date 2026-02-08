import bgImage from "./assets/bg.png";
import { AppLoader } from "./components/AppLoader";
import { HexGround } from "./components/HexGround";
import { APP_IMAGE_URLS } from "./appImages";
import { usePreloadImages } from "./hooks/usePreloadImages";
import { useAppHeightCssVar } from "./viewport";
import { useEffect, useState } from "react";

export default function App() {
  useAppHeightCssVar();

  const { isReady, progress, loaded, total } = usePreloadImages(APP_IMAGE_URLS);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    // tiny delay to avoid "flash" on fast cache hits
    const t = window.setTimeout(() => setShowLoader(false), 200);
    return () => window.clearTimeout(t);
  }, [isReady]);

  return (
    <div className="relative min-h-[var(--app-height,100vh)] w-full overflow-hidden overscroll-none">
      {showLoader && (
        <AppLoader progress={progress} loaded={loaded} total={total} />
      )}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* screen darken overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/35 to-black/25"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      />

      <div className="relative z-10 flex h-[var(--app-height,100vh)] overflow-hidden">
        <HexGround />
      </div>
    </div>
  );
}
