import question1 from "../../assets/question1.png";
import question2 from "../../assets/question2.png";
import question3 from "../../assets/question3.png";

export const QUESTIONS = [
  {
    id: 1,
    image: question1,
    question: "Какое животное чаще всего обитает на лугах и пастбищах?",
    answers: {
      a: "Корова",
      b: "Пингвин",
      c: "Верблюд",
    },
    correctAnswer: "a",
  },
  {
    id: 2,
    image: question2,
    question: "Что важнее всегодля выживания в пустыне?",
    answers: {
      a: "Вода",
      b: "Тёплая куртка",
      c: "Лыжи",
    },
    correctAnswer: "a",
  },
  {
    id: 3,
    image: question3,
    question: "Что лучше всего растёт на плодородной земле?",
    answers: {
      a: "Мох тундры",
      b: "Пшеница",
      c: "Кактус",
    },
    correctAnswer: "b",
  },
] as const;
