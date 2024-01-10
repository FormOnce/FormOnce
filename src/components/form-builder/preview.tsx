import React, { useEffect, useState } from "react";
import type { TFormSchema } from "~/types/form.types";
import { Button } from "../ui";
import { QuestionRenderer } from "./question-renderer";

type TPreviewProps = {
  formSchema: TFormSchema;
  currentQuestionIdx?: number;
};

function Preview({ formSchema, currentQuestionIdx }: TPreviewProps) {
  const [qIdx, setQuestionIdx] = useState(currentQuestionIdx ?? 0);

  useEffect(() => {
    setQuestionIdx(currentQuestionIdx ?? 0);
  }, [currentQuestionIdx]);

  const handleNext = () => {
    setQuestionIdx((i) =>
      i + 1 > formSchema.questions.length - 1 ? 0 : i + 1
    );
  };

  //   if no formSchema, nothing to preview
  if (!formSchema) return null;

  return (
    <div className="rounded-md border px-12 py-16">
      {!!formSchema.questions[qIdx] && (
        <QuestionRenderer question={formSchema.questions[qIdx]} />
      )}
      <div className="flex justify-end">
        <Button onClick={handleNext}>
          {qIdx === formSchema.questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}

export { Preview };
