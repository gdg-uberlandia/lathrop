import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/assets/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/assets/components/ui/form";
import { Input } from "@/assets/components/ui/input";
import { Textarea } from "@/assets/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
import type { MissionFormType } from "./missions-schema";

export function MissionQuizFields({
  form,
}: {
  form: UseFormReturn<MissionFormType>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quizConfig.questions",
    keyName: "fieldKey",
  });
  const questions = form.watch("quizConfig.questions") ?? [];
  return (
    <div className="space-y-4 rounded-xl border p-4 md:col-span-8">
      <h3 className="font-medium">Quiz relâmpago</h3>
      <p className="text-sm text-muted-foreground">
        Até 10 perguntas, com 2 a 3 alternativas e uma resposta correta por
        pergunta. Todas têm o mesmo peso. Cada envio completo consome uma
        tentativa.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          name="quizConfig.minCorrectAnswers"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mínimo de acertos</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={Math.max(1, fields.length)}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="quizConfig.maxAttempts"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limite de tentativas</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {fields.map((question, index) => (
        <fieldset
          key={question.fieldKey}
          className="space-y-3 rounded-lg border p-4"
        >
          <legend className="px-1 font-medium">Pergunta {index + 1}</legend>
          <FormField
            name={`quizConfig.questions.${index}.prompt`}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enunciado</FormLabel>
                <FormControl>
                  <Textarea {...field} maxLength={500} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(questions[index]?.options ?? question.options).map(
            (_, optionIndex) => (
              <FormField
                key={optionIndex}
                name={`quizConfig.questions.${index}.options.${optionIndex}`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa {optionIndex + 1}</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={200} />
                    </FormControl>
                    <FormMessage />
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={
                        (questions[index]?.options ?? question.options)
                          .length <= 2
                      }
                      onClick={() => {
                        const options = form.getValues(
                          `quizConfig.questions.${index}.options`,
                        );
                        const correct = form.getValues(
                          `quizConfig.questions.${index}.correctOptionIndex`,
                        );
                        form.setValue(
                          `quizConfig.questions.${index}.options`,
                          options.filter(
                            (_, itemIndex) => itemIndex !== optionIndex,
                          ),
                          { shouldDirty: true },
                        );
                        form.setValue(
                          `quizConfig.questions.${index}.correctOptionIndex`,
                          correct === optionIndex
                            ? 0
                            : correct > optionIndex
                              ? correct - 1
                              : correct,
                          { shouldDirty: true },
                        );
                      }}
                    >
                      Remover alternativa
                    </Button>
                  </FormItem>
                )}
              />
            ),
          )}
          <Button
            type="button"
            variant="outline"
            disabled={
              (questions[index]?.options ?? question.options).length >= 3
            }
            onClick={() =>
              form.setValue(
                `quizConfig.questions.${index}.options`,
                [
                  ...form.getValues(`quizConfig.questions.${index}.options`),
                  "",
                ],
                { shouldDirty: true },
              )
            }
          >
            Adicionar alternativa
          </Button>
          <FormField
            name={`quizConfig.questions.${index}.correctOptionIndex`}
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4">
                <FormLabel className="font-semibold text-emerald-900">
                  Resposta correta · gabarito
                </FormLabel>
                <p className="text-sm text-emerald-800">
                  Escolha a alternativa que será aceita na correção desta
                  pergunta.
                </p>
                <Select
                  value={String(field.value ?? 0)}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger className="border-emerald-400 bg-white font-medium text-emerald-950">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(questions[index]?.options ?? question.options).map(
                      (_, optionIndex) => (
                        <SelectItem
                          key={optionIndex}
                          value={String(optionIndex)}
                        >
                          Alternativa {optionIndex + 1}
                          {questions[index]?.options[optionIndex]
                            ? ` — ${questions[index].options[optionIndex]}`
                            : ""}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            disabled={fields.length <= 1}
            onClick={() => remove(index)}
          >
            Remover pergunta
          </Button>
        </fieldset>
      ))}
      {form.formState.errors.quizConfig?.questions && (
        <p role="alert" className="text-sm text-destructive">
          Confira os enunciados e as alternativas. Cada pergunta precisa de
          alternativas preenchidas e diferentes e uma resposta correta válida.
        </p>
      )}
      <Button
        type="button"
        variant="secondary"
        disabled={fields.length >= 10}
        onClick={() =>
          append({
            id: uuidv4(),
            prompt: "",
            options: ["", "", ""],
            correctOptionIndex: 0,
          })
        }
      >
        Adicionar pergunta
      </Button>
      <p className="text-xs text-muted-foreground">
        Editar o quiz não reinicia as tentativas já utilizadas.
      </p>
    </div>
  );
}
