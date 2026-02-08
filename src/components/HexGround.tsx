import { defineHex, Grid } from "honeycomb-grid";
import horseImage from "../assets/horse.png";

import { useCallback, useMemo, useRef, useState, type MouseEvent } from "react";
import { Modal } from "./modal";
import {
  getIsClickablePolygons,
  getPolygonBBox,
  getRandomPolygon,
  getUnitCoordinates,
} from "./utils";

const Hex = defineHex({ dimensions: 30, origin: "topLeft" });

const rows = [
  { count: 3, offset: 1 },
  { count: 4, offset: 0 },
  { count: 3, offset: 0 },
  { count: 4, offset: -1 },
  { count: 3, offset: -1 },
  { count: 1, offset: -1 },
];

const hexes = rows.flatMap((row, r) =>
  Array.from(
    { length: row.count },
    (_, q) => new Hex({ q: q + row.offset, r }),
  ),
);

const grid = new Grid(Hex, hexes);
const hexArray = grid.toArray();

export const HexGround = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [polygonChosen, setPolygonChosen] = useState(false);
  const [unitPosition, setUnitPosition] = useState<{
    q: number;
    r: number;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOrigin, setDialogOrigin] = useState<{
    x: number;
    y: number;
  } | null>(null);
  function handleHexClick(e: MouseEvent<SVGGElement>, q: number, r: number) {
    setUnitPosition({ q, r });
    setDialogOrigin({ x: e.clientX, y: e.clientY });
    setDialogOpen(true);
  }

  // В SVG "z-index" не работает как в HTML: порядок отрисовки зависит от DOM-очереди.
  // Чтобы поднять гекс над соседями БЕЗ React-state и перерендера остальных ячеек,
  // на hover мы временно переносим текущий <g> в конец слоя, а при уходе мыши
  // возвращаем его на место по data-index. = useRef<SVGGElement | null>(null);

  const hexLayerRef = useRef<SVGGElement | null>(null);

  const bringToFront = useCallback((el: SVGGElement) => {
    const layer = hexLayerRef.current;
    if (!layer) return;
    // appendChild перемещает существующий узел, не клонируя его
    layer.appendChild(el);
  }, []);

  const restoreOrder = useCallback((el: SVGGElement) => {
    const layer = hexLayerRef.current;
    if (!layer) return;

    const idxRaw = el.dataset.index;
    if (!idxRaw) return;
    const idx = Number(idxRaw);
    if (!Number.isFinite(idx)) return;

    const children = Array.from(layer.children) as SVGGElement[];
    const before = children.find((c) => {
      const cIdx = Number(c.dataset.index);
      return Number.isFinite(cIdx) && cIdx > idx;
    });

    layer.insertBefore(el, before ?? null);
  }, []);

  const randomPolygons = useMemo(() => getRandomPolygon(rows), [rows]);

  return (
    <>
      {!polygonChosen && gameStarted && (
        <div
          className="fixed left-1/2 z-10 h-[48px] w-[285px] -translate-x-1/2 text-center"
          style={{
            top: "calc(var(--app-height, 100vh) * 0.05)",
            opacity: 1,
          }}
        >
          Тыкни по гексу,
          <br />
          чтобы выбрать уровень
        </div>
      )}
      <svg
        viewBox="0 -30 270 370"
        // className="mt-20"
        preserveAspectRatio="xMidYMid center" // центрирует по высоте
        width="100%"
        height="100%"
      >
        <g ref={hexLayerRef}>
          {hexArray.map((hex, index) => {
            const points = hex.corners.map(({ x, y }) => `${x},${y}`).join(" ");
            const bbox = getPolygonBBox(hex.corners);
            const { width: tileWidth, height: tileHeight } = bbox;
            const tileX = hex.x - tileWidth / 2;
            const tileY = hex.y - tileHeight / 2;

            const { centerX, centerY, unitSize, clipId, hasUnit } =
              getUnitCoordinates(hex, unitPosition, index);

            const clickable = gameStarted && getIsClickablePolygons(index);

            return (
              <g
                key={`${hex.q}-${hex.r}-${index}`}
                className="hex-ground-cell"
                data-index={index}
                data-clickable={clickable ? "true" : "false"}
                onPointerEnter={(e) => {
                  if (!clickable) return;
                  bringToFront(e.currentTarget);
                }}
                onPointerLeave={(e) => {
                  if (!clickable) return;
                  restoreOrder(e.currentTarget);
                }}
                onClick={(e: MouseEvent<SVGGElement>) => {
                  if (!clickable) return;
                  setPolygonChosen(true);
                  handleHexClick(e, hex.q, hex.r);
                }}
              >
                {/* ГЕКС — ОСНОВАНИЕ */}
                <polygon
                  points={points}
                  fill="transparent"
                  // fill="#d6e6a3"
                  // stroke="#000"
                  // strokeWidth={1}
                />

                {/* КАРТИНКА — ВЫХОДИТ ЗА ПРЕДЕЛЫ ГЕКСА */}
                <image
                  href={randomPolygons[index].image}
                  width={tileWidth + 5}
                  height={
                    randomPolygons[index].type === "rocks"
                      ? tileHeight + 8
                      : tileHeight + 5
                  }
                  x={Math.floor(tileX)}
                  y={
                    randomPolygons[index].type === "rocks"
                      ? Math.floor(tileY - 3)
                      : Math.floor(tileY)
                  }
                  preserveAspectRatio="none"
                  pointerEvents="none"
                  style={{
                    opacity: clickable ? 1 : 0.75,
                  }}
                />

                {hasUnit && (
                  <>
                    {/* ВЫБРАННЫЙ ГЕКС — ОБВОДКА + ЗЕЛЕНОЕ СВЕЧЕНИЕ */}
                    {/* <polygon
                      points={points}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={5.18}
                      strokeLinejoin="round"
                      pointerEvents="none"
                      style={{
                        filter:
                          "drop-shadow(0px 0px 6px #84d642) drop-shadow(0px 0px 12px #84d642)",
                      }}
                    /> */}
                    <image
                      href={horseImage}
                      x={centerX - unitSize / 2}
                      y={centerY - unitSize / 2}
                      width={unitSize}
                      height={unitSize}
                      transform={`translate(${centerX} 0) scale(-1 1) translate(${-centerX} 0)`}
                      preserveAspectRatio="xMidYMid meet"
                      clipPath={`url(#${clipId})`}
                      pointerEvents="none"
                      style={{
                        filter: "drop-shadow(0px 6px 6px rgba(0,0,0,0.35))",
                      }}
                    />
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {!gameStarted && (
        <div className="fixed bottom-[calc(var(--app-height,100vh)*0.10)] left-1/2 -translate-x-1/2">
          <button
            onClick={() => setGameStarted(true)}
            type="button"
            className="flex w-[60vw] max-h-[55px] aspect-[229/56] 
            items-center justify-center gap-[10px] 
            rounded-[16px] border-4 border-white bg-[#1E802A] 
            text-white 
            shadow-[4px_4px_9px_0px_rgba(0,0,0,0.45)]
          "
          >
            Играть
          </button>
        </div>
      )}

      <Modal
        open={dialogOpen}
        origin={dialogOrigin}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};
