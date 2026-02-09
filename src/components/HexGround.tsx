import { defineHex, Grid } from "honeycomb-grid";
import horseImage from "../assets/horse.png";
import polygon1 from "../assets/polygons/Polygon1.svg";
import polygon2 from "../assets/polygons/Polygon2.svg";
import polygon4 from "../assets/polygons/Polygon4.svg";
import polygon6 from "../assets/polygons/Polygon6.svg";
import polygon7 from "../assets/polygons/Polygon7.svg";
import polygon9 from "../assets/polygons/Polygon9.svg";
import polygon12 from "../assets/polygons/Polygon12.svg";
import polygon13 from "../assets/polygons/Polygon13.svg";
import forest from "../assets/polygons/forest.svg";
import stone from "../assets/polygons/stone.svg";
import layer2Left from "../assets/polygons/layer2-left.svg";
import layer2Right from "../assets/polygons/layer2-right.svg";
import layer3Left from "../assets/polygons/layer3-left.svg";
import layer3Right from "../assets/polygons/layer3-right.svg";

import { useCallback, useMemo, useRef, useState, type MouseEvent } from "react";
import { Modal } from "./modal";
import {
  getIsClickablePolygons,
  getPolygonBBox,
  getRandomPolygon,
  getUnitCoordinates,
} from "./utils";

const HEX_WIDTH = 90;
const HEX_HEIGHT = 79;

const POLYGON_TEXTURES = [
  polygon1,
  polygon2,
  stone,
  forest,
  polygon4,
  forest,
  polygon6,
  polygon7,
  polygon2,
  polygon9,
  polygon2,
  stone,
  polygon12,
  polygon13,
  polygon9,
  polygon4,
  polygon6,
  polygon1,
];

const Hex = defineHex({
  dimensions: { width: HEX_WIDTH, height: HEX_HEIGHT },
  origin: "topLeft",
});

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

const isOverLimitFigure = (index: number): boolean => {
  return index === 2 || index === 3 || index === 5 || index === 11;
};

const VIEWBOX_PADDING = 24;
const gridBBox = (() => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const hex of hexArray) {
    const bbox = getPolygonBBox(hex.corners);
    minX = Math.min(minX, bbox.x);
    minY = Math.min(minY, bbox.y);
    maxX = Math.max(maxX, bbox.x + bbox.width);
    maxY = Math.max(maxY, bbox.y + bbox.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
})();

const GRID_VIEWBOX = `${gridBBox.x - VIEWBOX_PADDING} ${
  gridBBox.y - VIEWBOX_PADDING
} ${gridBBox.width + VIEWBOX_PADDING * 2} ${
  gridBBox.height + VIEWBOX_PADDING * 2
}`;

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
        viewBox={GRID_VIEWBOX}
        // className="mt-20"
        preserveAspectRatio="xMidYMid center" // центрирует по высоте
        width="100%"
        height="100%"
        max-width="500px"
      >
        <g ref={hexLayerRef}>
          {hexArray.map((hex, index) => {
            const points = hex.corners.map(({ x, y }) => `${x},${y}`).join(" ");
            const points2 = hex.corners
              .map(({ x, y }) => `${x},${y + 3}`)
              .join(" ");
            const points3 = hex.corners
              .map(({ x, y }) => `${x},${y + 11}`)
              .join(" ");

            // Обводка: делаем внутренний гекс (вписанный), чтобы stroke не выходил наружу
            const borderStrokeWidth = 2.7;
            const borderInset =
              (borderStrokeWidth / 2) / Math.cos(Math.PI / 6); // ~ d / cos(30°) для правильного "вписывания"
            const innerPoints = hex.corners
              .map(({ x, y }) => {
                const dx = x - hex.x;
                const dy = y - hex.y;
                const len = Math.hypot(dx, dy) || 1;
                const factor = Math.max(0, (len - borderInset) / len);
                const ix = hex.x + dx * factor;
                const iy = hex.y + dy * factor;
                return `${ix.toFixed(2)},${iy.toFixed(2)}`;
              })
              .join(" ");
            const bbox = getPolygonBBox(hex.corners);
            const { width: tileWidth, height: tileHeight } = bbox;
            const tileX = hex.x - tileWidth / 2;
            const tileY = hex.y - tileHeight / 2;

            const { centerX, centerY, unitSize, clipId, hasUnit } =
              getUnitCoordinates(hex, unitPosition, index);

            const clickable = gameStarted && getIsClickablePolygons(index);
            const texture = POLYGON_TEXTURES[index];
            const textureClipId = `hex-texture-clip-${index}`;
            const layerTopClipId = `layer-top-clip-${index}`;
            const layer2LeftClipId = `layer2-left-clip-${index}`;
            const layer2RightClipId = `layer2-right-clip-${index}`;
            const layer3LeftClipId = `layer3-left-clip-${index}`;
            const layer3RightClipId = `layer3-right-clip-${index}`;
            const layer3CutoutMaskId = `layer3-cutout-mask-${index}`;
            const layer3CutoutErodeFilterId = `layer3-cutout-erode-${index}`;
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
                <defs>
                  <clipPath id={textureClipId} clipPathUnits="userSpaceOnUse">
                    <polygon points={points} />
                  </clipPath>
                  {/* второй слой левая и правая часть */}
                  <clipPath
                    id={layer2LeftClipId}
                    clipPathUnits="userSpaceOnUse"
                  >
                    <polygon points={points2} />
                  </clipPath>
                  <clipPath
                    id={layer2RightClipId}
                    clipPathUnits="userSpaceOnUse"
                  >
                    <polygon points={points2} />
                  </clipPath>
                  {/* третий (нижний) слой левая и правая часть */}
                  <clipPath
                    id={layer3LeftClipId}
                    clipPathUnits="userSpaceOnUse"
                  >
                    <polygon points={points3} />
                  </clipPath>
                  <clipPath
                    id={layer3RightClipId}
                    clipPathUnits="userSpaceOnUse"
                  >
                    <polygon points={points3} />
                  </clipPath>
                  {/* <clipPath
                    id={layerTopClipId}
                    clipPathUnits="userSpaceOnUse"
                  >
                    <polygon points={pointsTop} />
                  </clipPath> */}
                  {/* Слегка "сужаем" область выреза (points), чтобы убрать 1px шов */}
                  <filter
                    id={layer3CutoutErodeFilterId}
                    filterUnits="userSpaceOnUse"
                    x={Math.floor(tileX) - 8}
                    y={Math.floor(tileY) - 8}
                    width={tileWidth + 16}
                    height={tileHeight + 16}
                  >
                    <feMorphology
                      in="SourceGraphic"
                      operator="erode"
                      radius={1}
                      // stroke="#c9c2ac"
                    />
                  </filter>
                  {/* Маска: показываем нижний слой (points3), но вырезаем базовый гекс (points) */}
                  <mask id={layer3CutoutMaskId} maskUnits="userSpaceOnUse">
                    <polygon points={points3} fill="white" />
                    <g filter={`url(#${layer3CutoutErodeFilterId})`}>
                      <polygon points={points} fill="black" />
                    </g>
                  </mask>
                </defs>

                {/* ТРЕТИЙ (НИЖНИЙ) СЛОЙ ТЕКСТУРЫ*/}
                <image
                  href={layer3Left}
                  x={Math.floor(tileX)}
                  y={Math.floor(tileY + 11)}
                  width={tileWidth}
                  height={tileHeight + 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#${layer3LeftClipId})`}
                  mask={`url(#${layer3CutoutMaskId})`}
                  pointerEvents="none"
                  style={{
                    opacity: clickable ? 1 : 0.75,
                  }}
                />
                {/* ТРЕТИЙ (НИЖНИЙ) СЛОЙ ТЕКСТУРЫ правая часть*/}
                <image
                  href={layer3Right}
                  x={Math.floor(hex.x - tileWidth / 4)}
                  y={Math.floor(tileY + 11)}
                  width={tileWidth}
                  height={tileHeight + 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#${layer3RightClipId})`}
                  mask={`url(#${layer3CutoutMaskId})`}
                  pointerEvents="none"
                  style={{
                    opacity: clickable ? 1 : 0.75,
                  }}
                />
                {/* ВТОРОЙ СЛОЙ ТЕКСТУРЫ*/}
                <image
                  href={layer2Left}
                  x={Math.floor(tileX)}
                  y={Math.floor(tileY + 3)}
                  width={tileWidth}
                  height={tileHeight + 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#${layer2LeftClipId})`}
                  mask={`url(#${layer3CutoutMaskId})`}
                  pointerEvents="none"
                  style={{
                    opacity: clickable ? 1 : 0.75,
                  }}
                />
                {/* ВТОРОЙ СЛОЙ ТЕКСТУРЫ правая часть*/}
                <image
                  href={layer2Right}
                  x={Math.floor(hex.x - tileWidth / 4)}
                  y={Math.floor(tileY + 3)}
                  width={tileWidth}
                  height={tileHeight + 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#${layer2LeftClipId})`}
                  mask={`url(#${layer3CutoutMaskId})`}
                  pointerEvents="none"
                  style={{
                    opacity: clickable ? 1 : 0.75,
                  }}
                />

                {/* ТЕКСТУРА — ОДНА КАРТИНКА, ОБРЕЗАННАЯ ПО ГЕКСУ (БЕЗ ПОВТОРА) */}
                {texture && (
                  <image
                    href={isOverLimitFigure(index) ? polygon1 : texture}
                    x={Math.floor(tileX)}
                    y={Math.floor(tileY)}
                    width={tileWidth}
                    height={tileHeight}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#${textureClipId})`}
                    pointerEvents="none"
                    style={{
                      opacity: clickable ? 1 : 0.75,
                    }}
                  />
                )}

                {/* ГЕКС — ОСНОВАНИЕ */}
                <polygon
                  points={points}
                  fill="transparent"
                  // stroke="#000"
                  // strokeWidth={2.7}
                  // clipPath={`url(#${textureClipId})`}
                />
                {/* <polygon
                  points={innerPoints}
                  fill="transparent"
                  strokeWidth={borderStrokeWidth}
                  stroke="#FFFFFF"
                      // strokeWidth={5.18}
                      strokeLinejoin="round"
                      pointerEvents="none"
                      style={{
                        filter:
                          "drop-shadow(0px 0px 6px #84d642) drop-shadow(0px 0px 12px #84d642)",
                      }}
                /> */}
                {/* ТЕКСТУРА - выходящая за пределы гекса */}
                {texture && isOverLimitFigure(index) && (
                  <image
                    href={texture}
                    x={
                      index !== 2 && index !== 11
                        ? Math.floor(tileX - tileWidth / 19 + 2)
                        : Math.floor(tileX - 2)
                    }
                    y={
                      index !== 2 && index !== 11
                        ? Math.floor(tileY - tileWidth / 9 + 3)
                        : Math.floor(tileY - 27)
                    }
                    width={
                      index !== 2 && index !== 11
                        ? tileWidth + 5
                        : tileWidth + 2
                    }
                    height={
                      index !== 2 && index !== 11
                        ? tileHeight + 5
                        : tileHeight + 50
                    }
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#${layerTopClipId})`}
                    pointerEvents="none"
                    style={{
                      opacity: clickable ? 1 : 0.75,
                    }}
                  />
                )}

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
                      y={centerY - unitSize / 1.5}
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
            className="flex w-[60vw] max-w-[380px] max-h-[55px] aspect-[229/56] 
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
