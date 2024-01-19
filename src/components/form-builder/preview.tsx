import React, { useEffect, useState } from "react";
import type { TFormSchema } from "~/types/form.types";
import { Button, Progress } from "../ui";
import { QuestionRenderer } from "./question-renderer";

type TPreviewProps = {
  formSchema: TFormSchema;
  currentQuestionIdx?: number;
};

function Preview({ formSchema, currentQuestionIdx }: TPreviewProps) {
  const [qIdx, setQuestionIdx] = useState(currentQuestionIdx ?? 0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setQuestionIdx(currentQuestionIdx ?? 0);

    const currProgress =
      (((currentQuestionIdx ?? 0) + 1) * 100) / formSchema.questions.length;
    setProgress(currProgress);
  }, [currentQuestionIdx, formSchema.questions.length]);

  const handleNext = () => {
    setQuestionIdx((i) =>
      i + 1 > formSchema.questions.length - 1 ? 0 : i + 1
    );

    const currProgress =
      ((qIdx + 1 < formSchema.questions.length ? qIdx + 2 : 1) * 100) /
      formSchema.questions.length;
    setProgress(currProgress);
  };

  //   if no formSchema, nothing to preview
  if (!formSchema) return null;

  return (
    <div className="rounded-md border px-12 py-16">
      {formSchema.questions.map((question, idx) => (
        <QuestionRenderer
          key={idx}
          question={question}
          visible={qIdx === idx}
        />
      ))}
      <div className="flex justify-end">
        <Button onClick={handleNext}>
          {qIdx === formSchema.questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
      <div className="mt-14 px-24">
        <Progress className="h-[5px]" value={progress} />
      </div>
    </div>
  );
}

export { Preview };
