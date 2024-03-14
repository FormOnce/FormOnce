import React from "react";
import type { TFormSchema } from "~/types/form.types";
import type { TQuestion } from "~/types/question.types";

import FormRenderer from "./form-renderer";
import { Button, Icons } from "../ui";

type TPreviewProps = {
  formSchema: TFormSchema;
  currentQuestionIdx?: number;
  questions: TQuestion[];
};

function Preview({ formSchema, currentQuestionIdx, questions }: TPreviewProps) {
  // resetSignal passed to form renderer, which resets local form when resetSingal is true and calls onReset
  const [resetSignal, setResetSignal] = React.useState(false);

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

  const onReset = () => {
    setResetSignal((prev) => !prev);
  };

  return (
    <div className="rounded-md border px-4 py-6">
      <Button
        variant="secondary"
        onClick={onReset}
        className="float-right gap-1 text-sm font-normal [&>svg]:active:rotate-180"
      >
        Reset <Icons.reset className="duration-50 transform transition" />
      </Button>
      <div className="px-8 py-10">
        <FormRenderer
          formSchema={formSchema}
          questions={questions}
          currentQuestionIdx={currentQuestionIdx}
          onNext={onNext}
          onPrev={onPrev}
          onSubmit={onSubmit}
          resetSignal={resetSignal}
          onReset={onReset}
        />
      </div>
    </div>
  );
}

export { Preview };
