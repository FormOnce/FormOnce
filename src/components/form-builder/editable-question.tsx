"use client";

import React from "react";
import { EQuestionType, type TQuestion } from "~/types/question.types";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
} from "@components/ui";
import { TextQuestionForm } from "./text-question-form";

type TEditableQuestionProps = TQuestion & {
  index: number;
  editQuestion: (values: TQuestion) => void;
  setCurrentQuestion: (QIdx: number) => void;
};

const EditableQuestion = ({
  editQuestion,
  setCurrentQuestion,
  ...question
}: TEditableQuestionProps) => {
  const [isOpen, setIsColapsed] = React.useState(false);

  const onEditQuestion = (values: TQuestion) => {
    editQuestion({
      ...values,
      id: question.id,
    } as TQuestion);
    setIsColapsed(false);
  };

  const onOpenChange = (open: boolean) => {
    setCurrentQuestion(question.index);
    setIsColapsed(open);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="rounded-md border shadow-sm shadow-slate-800"
    >
      <CollapsibleTrigger
        className={`flex w-full flex-col rounded-md p-4 pb-3 text-start ${
          !isOpen && "hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <div className="flex items-center">
          <div>{question.index + 1}</div>
          <div className="ml-4">
            <p className="text-sm">{question.title}</p>
            <p className="text-xs text-muted-foreground">
              {question.description}
            </p>
          </div>
        </div>
        {isOpen && (
          <Separator
            className={`ml-4 mt-2 w-[95%] ${isOpen ? null : "hidden"}`}
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-6 pt-0">
        {question.type === EQuestionType.Text && (
          <TextQuestionForm onEdit={onEditQuestion} mode="edit" {...question} />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export { EditableQuestion };
