import { useEffect, useMemo, useState } from "react";
import { useCounterStore } from "../../store/useCounterStore";
import { QUESTIONS } from "./constants";
import { ProgressBar } from "./ProgressBar";
import { Question } from "./Question";
import { Footer } from "./Footer";

type Props = {
  open: boolean;
  onClose: () => void;
  origin?: { x: number; y: number } | null;
};

const ANIMATION_MS = 320;

export function Modal({ open, onClose, origin }: Props) {
  const [render, setRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const [transitionOn, setTransitionOn] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const questionIdx = useCounterStore((s) => s.count);

  const totalQuestions = QUESTIONS.length;
  const currentQuestionIndex = Math.min(
    Math.max(questionIdx, 0),
    totalQuestions - 1,
  );
  const currentQuestion = currentQuestionIndex + 1;
  const question = QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestionIndex, open]);

  useEffect(() => {
    if (open) {
      setRender(true);
      // важно: сначала отрисовать стартовое состояние БЕЗ transition,
      // затем включить transition и только потом "показать" (для плавного входа)
      setVisible(false);
      setTransitionOn(false);

      let raf1 = 0;
      let raf2 = 0;

      raf1 = requestAnimationFrame(() => {
        setTransitionOn(true);
        raf2 = requestAnimationFrame(() => setVisible(true));
      });

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    setVisible(false);
    setTransitionOn(true);
    const t = window.setTimeout(() => setRender(false), ANIMATION_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  const startTransform = useMemo(() => {
    // fallback: небольшое появление из центра
    if (!origin) return "translate3d(0, 0, 0) scale(0.92)";
    if (typeof window === "undefined")
      return "translate3d(0, 0, 0) scale(0.92)";

    // модалка по центру экрана → целевая точка = центр viewport
    const targetX = window.innerWidth / 2;
    const viewportH = window.visualViewport?.height ?? window.innerHeight;
    const targetY = viewportH / 2;
    const dx = origin.x - targetX;
    const dy = origin.y - targetY;

    // “вылет” из нажатого гекса
    return `translate3d(${dx}px, ${dy}px, 0) scale(0.15)`;
  }, [origin]);

  if (!render) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        style={{
          opacity: visible ? 1 : 0,
          transitionProperty: transitionOn ? "opacity" : "none",
          transitionDuration: `${ANIMATION_MS}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      <div
        className={[
          "relative flex h-auto w-[80vw] max-h-[calc(var(--app-height,100vh)-32px)] flex-col gap-[10px] overflow-y-auto rounded-[36px] bg-[#00000099] p-4 text-white shadow-[4px_4px_9px_0px_#00000073] backdrop-blur-[10px]",
          "will-change-transform",
        ].join(" ")}
        style={{
          transform: visible ? "translate3d(0, 0, 0) scale(1)" : startTransform,
          opacity: visible ? 1 : 0,
          transformOrigin: "center",
          transitionProperty: transitionOn ? "transform, opacity" : "none",
          transitionDuration: `${ANIMATION_MS}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <img
          src={question.image}
          alt="tile"
          width={328}
          height={157}
          className="block max-h-[227px] w-full rounded-[20px] object-cover opacity-100"
        />
        <div>
          <div
            className="mb-3"
            style={{
              fontFamily:
                "Non Bureau Extended, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            Вопрос {currentQuestion} из {totalQuestions}
          </div>

          <ProgressBar
            className="mb-4"
            durationMs={30_000}
            active={open}
            resetKey={`${currentQuestionIndex}-${open ? 1 : 0}`}
            showTimeLeft
          />
        </div>

        <Question
          question={question.question}
          options={Object.entries(question.answers).map(([value, label]) => ({
            value,
            label,
          }))}
          value={selectedAnswer}
          onChange={setSelectedAnswer}
          correctValue={question.correctAnswer}
          name={`question-${question.id}`}
          className="mb-4"
        />

        {/* footer */}
        <Footer
          selectedAnswer={selectedAnswer}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
