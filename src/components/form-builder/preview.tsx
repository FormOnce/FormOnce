import React from "react";
import type { TFormSchema } from "~/types/form.types";
import type { TQuestion } from "~/types/question.types";

import FormRenderer from "./form-renderer";

type TPreviewProps = {
  formSchema: TFormSchema;
  currentQuestionIdx?: number;
  questions: TQuestion[];
};

function Preview({ formSchema, currentQuestionIdx, questions }: TPreviewProps) {
  const onNext = () => {
    console.log("next");
  };

  const onPrev = () => {
    console.log("prev");
  };

  const onSubmit = async (values: unknown) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("submit", values);
  };

  return (
    <div className="rounded-md border px-12 py-16">
      <FormRenderer
        formSchema={formSchema}
        questions={questions}
        currentQuestionIdx={currentQuestionIdx}
        onNext={onNext}
        onPrev={onPrev}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export { Preview };
