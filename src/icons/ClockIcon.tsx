import { useId } from "react";
import type { ComponentProps } from "react";

type ClockProps = ComponentProps<"svg"> & {
  color?: string;
};

export function ClockIcon({ color = "#FA6001", ...props }: ClockProps) {
  const id = useId();
  const clipPathId = `${id}-clock-clip`;

  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M8.81601 7.64793L7.00345 6.28852V3.51937C7.00345 3.24093 6.77839 3.01587 6.49996 3.01587C6.22152 3.01587 5.99646 3.24093 5.99646 3.51937V6.54029C5.99646 6.69888 6.07098 6.84843 6.19786 6.94309L8.21179 8.45355C8.30241 8.52152 8.40816 8.55425 8.51338 8.55425C8.66694 8.55425 8.81799 8.48526 8.91669 8.35234C9.08388 8.13028 9.03856 7.8146 8.81601 7.64793Z"
          fill={color}
        />
        <path
          d="M6.5 0C2.91568 0 0 2.91568 0 6.5C0 10.0843 2.91568 13 6.5 13C10.0843 13 13 10.0843 13 6.5C13 2.91568 10.0843 0 6.5 0ZM6.5 11.993C3.47153 11.993 1.00697 9.52847 1.00697 6.5C1.00697 3.47153 3.47153 1.00697 6.5 1.00697C9.52897 1.00697 11.993 3.47153 11.993 6.5C11.993 9.52847 9.52847 11.993 6.5 11.993Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id={clipPathId}>
          <rect width="13" height="13" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
