"use client";

import React from "react";
import { EQuestionType, type TQuestion } from "~/types/question.types";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui";
import { TextQuestionForm } from "./text-question-form";

type TEditableQuestionProps = TQuestion & {
  index: number;
  editQuestion: (values: TQuestion) => void;
};

const EditableQuestion = ({
  editQuestion,
  ...question
}: TEditableQuestionProps) => {
  const [isOpen, setIsColapsed] = React.useState(false);

  const onEditQuestion = (values: TQuestion) => {
    editQuestion({ ...values, type: question.type } as TQuestion);
    setIsColapsed(false);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => setIsColapsed(open)}
      className="rounded-md border shadow-sm shadow-slate-800"
    >
      <CollapsibleTrigger
        className={`flex w-full items-center justify-between rounded-md p-4 text-start ${
          !isOpen && "hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <div className="flex items-center">
          <div>{question.index}</div>
          <div className="ml-4">
            <p className="text">{question.title}</p>
            <p className="text-sm text-muted-foreground">
              {question.description}
            </p>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-6 pt-4">
        {question.type === EQuestionType.Text && (
          <TextQuestionForm onEdit={onEditQuestion} mode="edit" {...question} />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export { EditableQuestion };
