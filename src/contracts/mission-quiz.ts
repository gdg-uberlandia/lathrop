import { z } from "zod";

export const missionQuizConfigSchema = z
  .object({
    questions: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            prompt: z.string().trim().min(1).max(500),
            options: z.array(z.string().trim().min(1).max(200)).min(2).max(3),
            correctOptionIndex: z.number().int().nonnegative(),
          })
          .strict()
          .superRefine((question, context) => {
            if (question.correctOptionIndex >= question.options.length)
              context.addIssue({
                code: "custom",
                path: ["correctOptionIndex"],
                message: "Selecione uma alternativa correta válida",
              });
            if (new Set(question.options).size !== question.options.length)
              context.addIssue({
                code: "custom",
                path: ["options"],
                message: "As alternativas devem ser diferentes",
              });
          }),
      )
      .min(1)
      .max(10),
    minCorrectAnswers: z.number().int().min(1),
    maxAttempts: z.number().int().min(1).max(100),
  })
  .strict()
  .superRefine((quiz, context) => {
    if (quiz.minCorrectAnswers > quiz.questions.length)
      context.addIssue({
        code: "custom",
        path: ["minCorrectAnswers"],
        message:
          "O mínimo de acertos não pode superar a quantidade de perguntas",
      });
    if (
      new Set(quiz.questions.map((question) => question.id)).size !==
      quiz.questions.length
    )
      context.addIssue({
        code: "custom",
        path: ["questions"],
        message: "As perguntas precisam de identificadores distintos",
      });
  });
