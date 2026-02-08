import { POLYGON_TYPES } from "../constants";
import pastures2 from "../../assets/polygons/hex2.png";
import desert3 from "../../assets/polygons/hex11.png";
import rocks2 from "../../assets/polygons/hex12.png";
import pastures4 from "../../assets/polygons/hex8.png";
import desert2 from "../../assets/polygons/hex10.png";
import pastures5 from "../../assets/polygons/hex13.png";

export const getRandomPolygon = (rows: { count: number; offset: number }[]) => {
  const polygonsCount = rows.reduce((acc, row) => acc + row.count, 0);

  // TODO: Временно убрал рандомное картообразование
  // return Array.from(
  //   { length: polygonsCount },
  //   () => POLYGON_TYPES[Math.floor(Math.random() * POLYGON_TYPES.length)],
  // );
  return [
    {...POLYGON_TYPES[0], image: pastures2},
    POLYGON_TYPES[1],
    POLYGON_TYPES[3],
    POLYGON_TYPES[2],
    {...POLYGON_TYPES[4], image: desert3},
    POLYGON_TYPES[2],
    {...POLYGON_TYPES[3], image: rocks2},
    {...POLYGON_TYPES[0], image: pastures4},
    POLYGON_TYPES[1],
    {...POLYGON_TYPES[4], image: desert2},
    POLYGON_TYPES[1],
    POLYGON_TYPES[3],
    POLYGON_TYPES[4],
    {...POLYGON_TYPES[0], image: pastures5},
    {...POLYGON_TYPES[4], image: desert2},
    {...POLYGON_TYPES[4], image: desert3},
    {...POLYGON_TYPES[3], image: rocks2},
    {...POLYGON_TYPES[0], image: pastures2},
  ];
};
