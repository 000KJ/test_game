import pastures1 from "../assets/polygons/hex1.png";
import pastures2 from "../assets/polygons/hex2.png";
import fields1 from "../assets/polygons/hex3.png";
import fields2 from "../assets/polygons/hex4.png";
import forest1 from "../assets/polygons/hex5.png";
import rocks1 from "../assets/polygons/hex6.png";
import pastures3 from "../assets/polygons/hex7.png";
import pastures4 from "../assets/polygons/hex8.png";
import desert1 from "../assets/polygons/hex9.png";
import desert2 from "../assets/polygons/hex10.png";
import desert3 from "../assets/polygons/hex11.png";
import rocks2 from "../assets/polygons/hex12.png";
import pastures5 from "../assets/polygons/hex13.png";
import pastures6 from "../assets/polygons/hex14.png";
import pastures7 from "../assets/polygons/hex15.png";

export const POLYGON_TYPES = [
  { type: "pastures", image: pastures1, isActive: true }, // пастбища
  { type: "fields", image: fields1, isActive: true }, // поля
  { type: "forest", image: forest1, isActive: false }, // леса
  { type: "rocks", image: rocks1, isActive: false }, // скалы
  { type: "desert", image: desert1, isActive: true }, // пустыня

  // { type: "other", image: otherImage, isAvailable: false },
] as const;
