import { Hex } from "honeycomb-grid";

export const getUnitCoordinates = (
  hex: Hex,
  unitPosition: { q: number; r: number } | null,
  index: number,
) => {
  const hasUnit = unitPosition?.q === hex.q && unitPosition?.r === hex.r;
  const clipId = `hex-clip-${hex.q}-${hex.r}-${index}`;

  const xs = hex.corners.map((c) => c.x);
  const ys = hex.corners.map((c) => c.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2.1;
  const hexWidth = maxX - minX;
  const hexHeight = maxY - minY;
  const unitSize = Math.min(hexWidth, hexHeight) * 0.9;

  return {
    centerX,
    centerY,
    unitSize,
    clipId,
    hasUnit,
  };
};
