import { useState, type MouseEvent } from "react";
import { HexTile } from "./HexTile";
import { Modal } from "./modal";
import tile from "../assets/tile.png";

const HEX_WIDTH = 128;
const HEX_HEIGHT = 144;
const ROW_Y_STEP = HEX_HEIGHT * 0.75; // плотная укладка pointy-top

const COLS = 4;
const ROWS = 5;

const GRID_WIDTH = COLS * HEX_WIDTH + HEX_WIDTH / 2;
const GRID_HEIGHT = (ROWS - 1) * ROW_Y_STEP + HEX_HEIGHT;

const map = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLS }, (_, q) => ({ q, r })),
).flat();

export function HexGrid() {
  const [unitPosition, setUnitPosition] = useState<{
    q: number;
    r: number;
  } | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOrigin, setDialogOrigin] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hoveredHex, setHoveredHex] = useState<string | null>(null);

  function handleHexClick(e: MouseEvent<HTMLDivElement>, q: number, r: number) {
    setUnitPosition({ q, r });
    setDialogOrigin({ x: e.clientX, y: e.clientY });
    setDialogOpen(true);
  }

  return (
    <>
      <div className="w-full pt-20">
        <div
          className="relative mx-auto"
          style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}
        >
          {map.map(({ q, r }) => {
            const x = q * HEX_WIDTH + (r % 2) * (HEX_WIDTH / 2);
            const y = r * ROW_Y_STEP;

            const hasUnit = unitPosition?.q === q && unitPosition?.r === r;
            const hexId = `${q}-${r}`;
            const isHovered = hoveredHex === hexId;

            return (
              <div
                key={hexId}
                onMouseEnter={() => setHoveredHex(hexId)}
                onMouseLeave={() => setHoveredHex(null)}
                //         className="
                //                 transition-all duration-300
                // hover:-translate-y-2
                // hover:z-20"
                style={{
                  position: "absolute",
                  transform: `translate(${x}px, ${y}px)`,
                  zIndex: isHovered ? 1000 : r,
                  // clipPath:
                  //   "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  // WebkitClipPath:
                  //   "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <HexTile
                  image={tile}
                  hasUnit={hasUnit}
                  onClick={(e) => handleHexClick(e, q, r)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        open={dialogOpen}
        origin={dialogOrigin}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
