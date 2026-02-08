import { useId } from "react";

export type QuestionOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  question: string;
  options: readonly QuestionOption[];
  value: string | null;
  onChange: (value: string) => void;
  correctValue?: string;
  name?: string;
  className?: string;
};

export function Question({
  question,
  options,
  value,
  onChange,
  correctValue,
  name,
  className,
}: Props) {
  const autoName = useId();
  const groupName = name ?? `question-${autoName}`;

  return (
    <fieldset className={className}>
      <legend className="mb-3 text-xs text-neutral-300 sm:mb-4 sm:text-sm">
        {question}
      </legend>

      <div className="flex flex-col gap-2 sm:gap-[10px]">
        {options.map((opt) => {
          const id = `${groupName}-${opt.value}`;
          const checked = value === opt.value;
          const isCorrectSelected = checked && value === correctValue;

          return (
            <label key={opt.value} htmlFor={id} className="block">
              <input
                id={id}
                name={groupName}
                type="radio"
                value={opt.value}
                checked={checked}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                className="peer sr-only"
              />

              <span
                className={[
                  "flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 sm:min-h-[49px] sm:gap-[10px] sm:px-[21px] sm:py-[13px]",
                  "bg-white/20 opacity-100",
                  "text-[13px] leading-snug text-white/90 sm:text-sm sm:leading-normal",
                  "cursor-pointer select-none",
                  "transition-colors",
                  "hover:bg-white/25",
                  "peer-checked:text-white",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-white/60",
                  "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                  checked && isCorrectSelected
                    ? "peer-checked:bg-[#2FAD34]"
                    : "peer-checked:bg-[#C03A3A]",
                ].join(" ")}
              >
                <span className="w-full text-center whitespace-normal break-words sm:truncate">
                  {opt.label}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
