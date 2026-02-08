// components/HexTile.tsx
import type { MouseEvent } from "react";
import horseImage from "../assets/horse.png";

type Props = {
  image: string;
  hasUnit?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};

export function HexTile({ image, hasUnit, onClick }: Props) {
  return (
    <div
      className="
        relative
        w-32 h-36
        transition-all duration-300
        hover:-translate-y-2
        hover:z-20
      "
    >
      {/* <div
        onClick={onClick}
        className="w-full h-full cursor-pointer bg-cover bg-center shadow-lg"
        style={{
          backgroundImage: `url(${image})`,
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          WebkitClipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      /> */}
      {/* Визуальный слой — ничего не обрезаем */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />

      {/* Кликабельная гексагональная область */}
      <div
        onClick={onClick}
        aria-label="hex tile"
        className="
      absolute inset-0
      cursor-pointer
      bg-transparent
      focus:outline-none
      z-index-0
    "
        // style={{
        //   clipPath:
        //     "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        //   WebkitClipPath:
        //     "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        // }}
      />

      {hasUnit && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={horseImage}
            className="w-[50%] h-[50%]
              rounded-full
              shadow-xl"
            alt="unit"
          />
        </div>
      )}
    </div>
  );
}
