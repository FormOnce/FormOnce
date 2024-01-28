import React, { useEffect, useState } from "react";
import type { TFormSchema } from "~/types/form.types";
import { InputRenderer } from "./input-renderer";
import type { TQuestion } from "~/types/question.types";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Progress,
} from "@components/ui";
import { formSchemaToZod } from "~/utils/forms/formSchemaToZod";

type TPreviewProps = {
  formSchema: TFormSchema;
  currentQuestionIdx?: number;
  questions: TQuestion[];
};

function Preview({ formSchema, currentQuestionIdx, questions }: TPreviewProps) {
  const [qIdx, setQuestionIdx] = useState(currentQuestionIdx ?? 0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setQuestionIdx(currentQuestionIdx ?? 0);

    const currProgress =
      (((currentQuestionIdx ?? 0) + 1) * 100) / questions.length;
    setProgress(currProgress);
  }, [currentQuestionIdx, questions]);

  const handleNext = async () => {
    await form.trigger(questions[qIdx]?.id);
    if (form.formState.errors[questions[qIdx]!.id!]) return;

    setQuestionIdx((i) => (i + 1 > questions.length - 1 ? 0 : i + 1));

    const currProgress =
      ((qIdx + 1 < questions.length ? qIdx + 2 : 1) * 100) / questions.length;
    setProgress(currProgress);

    if (qIdx === questions.length - 1) {
      form.reset();
    }
  };

  const ZFormSchema = formSchemaToZod(formSchema);

  const defaultValues = questions.reduce(
    (acc: Record<string, unknown>, curr) => {
      if (curr.id) {
        acc[curr.id] = "";
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

  return (
    <div className="rounded-md border px-12 py-16">
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          // onSubmit={form.handleSubmit(onSubmit, onError)}
          className="my-8"
        >
          {questions.map((question, idx) => (
            <FormField
              key={idx}
              control={form.control}
              name={question.id!}
              render={({ field }) => (
                <div className="overflow-hidden">
                  <FormItem
                    className={`transition-all duration-150 ease-out ${
                      qIdx === idx
                        ? "not-sr-only translate-x-0"
                        : "sr-only -translate-x-full"
                    }`}
                  >
                    <FormLabel>{question.title}</FormLabel>
                    <FormDescription>{question.description}</FormDescription>
                    <FormControl>
                      <InputRenderer
                        type={question.type}
                        subType={question.subType}
                        placeholder={question.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
          ))}
        </form>
      </Form>
      <div className="mt-8 flex justify-end">
        <Button type="button" onClick={() => void handleNext()}>
          {qIdx === questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
      <div className="mt-14 px-24">
        <Progress className="h-[5px]" value={progress} />
      </div>
    </div>
  );
}

export { Preview };
