import { defineHex, Grid } from "honeycomb-grid";
import horseImage from "../assets/horse.png";

import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
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

  const [hoveredHex, setHoveredHex] = useState<number | null>(null);
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

  const HOVER_LIFT_Y = 10;

  function getHexGroupStyle(isHovered: boolean): CSSProperties {
    return {
      cursor: "pointer",
      transform: isHovered
        ? `translateY(-${HOVER_LIFT_Y}px)`
        : "translateY(0px)",
      transition: "transform 180ms ease, filter 180ms ease",
      filter: "drop-shadow(0px 10px 10px rgba(0,0,0,0.35))",

      // важно для CSS-transform у SVG элементов
      transformBox: "fill-box",
      transformOrigin: "center",
    };
  }

  const handleHexMouseEnter = (index: number) => {
    // mouseenter не всплывает как mouseover, поэтому меньше лишних событий;
    // + не обновляем state, если hover уже на этом hex
    setHoveredHex((prev) => (prev === index ? prev : index));
  };

  const handleHexMouseLeave = (index: number) => {
    setHoveredHex((prev) => (prev === index ? null : prev));
  };

  const ordered = useMemo(() => {
    if (hoveredHex === null)
      return hexArray.map((hex, index) => ({ hex, index }));

    const all = hexArray.map((hex, index) => ({ hex, index }));
    return [
      ...all.filter(({ index }) => index !== hoveredHex),
      { hex: hexArray[hoveredHex], index: hoveredHex },
    ];
  }, [hoveredHex, hexArray]);

  const randomPolygons = useMemo(() => getRandomPolygon(rows), [rows]);

  return (
    <>
      {!polygonChosen && gameStarted && (
        <div
          className="fixed left-1/2 z-10 h-[48px] w-[285px] -translate-x-1/2 text-center"
          style={{
            top: "calc(var(--app-height, 100vh) * 0.05)",
            opacity: 1,
            fontFamily:
              "Non Bureau, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            fontWeight: 500,
            fontSize: 24,
            lineHeight: "100%",
            letterSpacing: "0%",
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
        {ordered.map(({ hex, index }) => {
          const points = hex.corners.map(({ x, y }) => `${x},${y}`).join(" ");
          const isHovered = hoveredHex === index;
          const bbox = getPolygonBBox(hex.corners);
          const { width: tileWidth, height: tileHeight } = bbox;
          const tileX = hex.x - tileWidth / 2;
          const tileY = hex.y - tileHeight / 2;

          const { centerX, centerY, unitSize, clipId, hasUnit } =
            getUnitCoordinates(hex, unitPosition, index);

          return (
            <g
              key={`${hex.q}-${hex.r}-${index}`}
              style={getHexGroupStyle(isHovered)}
              onMouseEnter={() =>
                gameStarted && getIsClickablePolygons(index)
                  ? handleHexMouseEnter(index)
                  : null
              }
              onMouseLeave={() =>
                gameStarted && getIsClickablePolygons(index)
                  ? handleHexMouseLeave(index)
                  : null
              }
              onClick={(e: MouseEvent<SVGGElement>) => {
                if (gameStarted && getIsClickablePolygons(index)) {
                  setPolygonChosen(true);
                  handleHexClick(e, hex.q, hex.r);
                }
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
                  opacity:
                    gameStarted && getIsClickablePolygons(index) ? 1 : 0.75,
                }}
              />

              {hasUnit && (
                <image
                  href={horseImage}
                  x={centerX - unitSize / 2}
                  y={centerY - unitSize / 2}
                  width={unitSize}
                  height={unitSize}
                  preserveAspectRatio="xMidYMid meet"
                  clipPath={`url(#${clipId})`}
                  pointerEvents="none"
                  style={{
                    filter: "drop-shadow(0px 6px 6px rgba(0,0,0,0.35))",
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {!gameStarted && (
        <div className="fixed bottom-[calc(var(--app-height,100vh)*0.10)] left-1/2 -translate-x-1/2">
          <button
            onClick={() => setGameStarted(true)}
            type="button"
            className="flex w-[60vw] aspect-[229/56] 
            items-center justify-center gap-[10px] 
            rounded-[16px] border-4 border-white bg-[#1E802A] 
            font-family: 'Non Bureau';
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            line-height: 100%;
            text-base font-semibold leading-none text-white 
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
