import { FC } from "react";
import { useCounterStore } from "../../store/useCounterStore";

interface Props {
  selectedAnswer: string | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  onClose: () => void;
}

export const Footer: FC<Props> = ({
  selectedAnswer,
  currentQuestionIndex,
  totalQuestions,
  onClose,
}) => {
  const incQuestion = useCounterStore((s) => s.inc);
  const resetQuestions = useCounterStore((s) => s.reset);

  const handleNext = () => {
    const isLast = currentQuestionIndex >= totalQuestions - 1;
    if (isLast) {
      resetQuestions();
      onClose();
      return;
    }
    incQuestion();
    onClose();
  };

  return (
    <div className="flex justify-end gap-3">
      <button
        disabled={!selectedAnswer}
        className={[
          "flex h-[49px] w-full items-center justify-center gap-[10px] rounded-2xl border-2 border-white px-[21px] py-[13px]",
          "bg-[#248BBF] text-white text-[16px]",
          "transition-opacity",
          !selectedAnswer ? "opacity-50 cursor-not-allowed" : "opacity-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
        ].join(" ")}
        onClick={handleNext}
      >
        Далее
      </button>
    </div>
  );
};
