import { POLYGON_TYPES } from "../constants";

export const getRandomPolygon = (rows: { count: number; offset: number }[]) => {
  const polygonsCount = rows.reduce((acc, row) => acc + row.count, 0);

  // TODO: Временно убрал рандомное картообразование
  // return Array.from(
  //   { length: polygonsCount },
  //   () => POLYGON_TYPES[Math.floor(Math.random() * POLYGON_TYPES.length)],
  // );
  return [
    POLYGON_TYPES[0],
    POLYGON_TYPES[1],
    POLYGON_TYPES[3],
    POLYGON_TYPES[2],
    POLYGON_TYPES[4],
    POLYGON_TYPES[2],
    POLYGON_TYPES[3],
    POLYGON_TYPES[0],
    POLYGON_TYPES[1],
    POLYGON_TYPES[4],
    POLYGON_TYPES[1],
    POLYGON_TYPES[3],
    POLYGON_TYPES[4],
    POLYGON_TYPES[0],
    POLYGON_TYPES[4],
    POLYGON_TYPES[4],
    POLYGON_TYPES[3],
    POLYGON_TYPES[0],
  ];
};
