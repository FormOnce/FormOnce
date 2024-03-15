import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formSchemaToZod } from "~/utils/forms/formSchemaToZod";
import { Button, Form, FormField, Icons, Progress } from "@components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputRenderer } from "./input-renderer";
import type { TQuestion } from "~/types/question.types";
import type { TFormSchema } from "~/types/form.types";
import type { z } from "zod";

type TProps = {
  formSchema: TFormSchema;
  questions: TQuestion[];
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
  currentQuestionIdx?: number;
  onReset?: () => void;
  resetSignal?: boolean;
};

function FormRenderer({
  formSchema,
  questions,
  currentQuestionIdx,
  resetSignal,
  onReset,
  ...props
}: TProps) {
  const [qIdx, setQuestionIdx] = useState(currentQuestionIdx ?? 0);
  const [progress, setProgress] = useState(0);
  const [isNextLoading, setIsNextLoading] = useState(false);

  const ZFormSchema = formSchemaToZod(formSchema);

  useEffect(() => {
    setQuestionIdx(currentQuestionIdx ?? 0);

    const currProgress =
      (((currentQuestionIdx ?? 0) + 1) * 100) / questions.length;
    setProgress(currProgress);
  }, [currentQuestionIdx, questions]);

  const handleNext = async () => {
    await form.trigger(questions[qIdx]?.id);
    if (form.formState.errors[questions[qIdx]!.id!]) return;

    setIsNextLoading(true);

    if (qIdx === questions.length - 1) {
      await props.onSubmit(form.getValues());
      form.reset();
    } else {
      props.onNext();
    }

    setQuestionIdx((i) => (i + 1 > questions.length - 1 ? 0 : i + 1));

    const currProgress =
      ((qIdx + 1 < questions.length ? qIdx + 2 : 1) * 100) / questions.length;
    setProgress(currProgress);

    setIsNextLoading(false);
  };

  const defaultValues = questions.reduce(
    (acc: Record<string, unknown>, curr) => {
      if (curr.id) {
        switch (curr.type) {
          case "text":
            acc[curr.id] = "";
            break;
          case "select":
            acc[curr.id] = [];
            break;
          default:
            acc[curr.id] = "";
            break;
        }
      }
      return acc;
    },
    {}
  );

  const form = useForm<z.infer<typeof ZFormSchema>>({
    resolver: zodResolver(ZFormSchema),
    defaultValues: defaultValues,
    mode: "all",
  });

  // watch for reset signal and reset form
  useEffect(() => {
    if (resetSignal) {
      // reset form
      form.reset();

      setQuestionIdx(0);
      currentQuestionIdx;
      setProgress(100 / questions.length);

      if (onReset) {
        onReset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  return (
    <div>
      <Form {...form}>
        <form
          // onSubmit={form.handleSubmit(onSubmit, onError)}
          onSubmit={(e) => {
            e.preventDefault();
            void handleNext();
          }}
          className="my-8"
        >
          {questions.map((question, idx) => (
            <FormField
              key={idx}
              control={form.control}
              name={question.id!}
              render={({ field }) => (
                <div className="overflow-hidden">
                  <div
                    className={`transition-all duration-150 ease-out ${
                      qIdx === idx
                        ? "not-sr-only translate-x-0"
                        : "sr-only -translate-x-full"
                    }`}
                  >
                    <InputRenderer
                      field={field}
                      question={question}
                      formControl={form.control}
                    />
                  </div>
                </div>
              )}
            />
          ))}
        </form>
      </Form>
      <div className="mt-8 flex justify-end">
        <Button type="button" onClick={() => void handleNext()}>
          {isNextLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : qIdx === questions.length - 1 ? (
            "Submit"
          ) : (
            "Next"
          )}
        </Button>
      </div>
      <div className="mt-14 px-24">
        <Progress className="h-[5px]" value={progress} />
      </div>
    </div>
  );
}

export default FormRenderer;
