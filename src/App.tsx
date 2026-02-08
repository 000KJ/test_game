import { HexGrid } from "./components/HexGrid";
import bgImage from "./assets/bg.png";
import { HexGround } from "./components/HexGround";
import { useAppHeightCssVar } from "./viewport";

export default function App() {
  useAppHeightCssVar();

  return (
    <div className="relative min-h-[var(--app-height,100vh)] w-full overflow-hidden overscroll-none">
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
