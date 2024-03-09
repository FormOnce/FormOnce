"use client";

import React from "react";
import { EQuestionType, type TQuestion } from "~/types/question.types";

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icons,
  Separator,
} from "@components/ui";
import { TextQuestionForm } from "./text-question-form";

type TEditableQuestionProps = TQuestion & {
  index: number;
  editQuestion: (values: TQuestion) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  setCurrentQuestion: (QIdx: number) => void;
};

const EditableQuestion = ({
  editQuestion,
  deleteQuestion,
  setCurrentQuestion,
  ...question
}: TEditableQuestionProps) => {
  const [isOpen, setIsColapsed] = React.useState(false);

  const [isDeletingQuestion, setIsDeletingQuestion] = React.useState(false);

  const onEditQuestion = async (values: TQuestion) => {
    await editQuestion({
      ...values,
      id: question.id,
    } as TQuestion);
    setIsColapsed(false);
  };

  const onDeleteQuestion = async (questionId: string) => {
    setIsDeletingQuestion(true);
    await deleteQuestion(questionId);
    setIsDeletingQuestion(false);
  };

  const onOpenChange = (open: boolean) => {
    setCurrentQuestion(question.index);
    setIsColapsed(open);
  };

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <Collapsible
        open={isOpen}
        onOpenChange={onOpenChange}
        className="w-full rounded-md border shadow-sm shadow-slate-800"
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
            <TextQuestionForm
              onEdit={onEditQuestion}
              mode="edit"
              {...question}
            />
          )}
        </CollapsibleContent>
      </Collapsible>
      <Button
        variant={"destructive"}
        size={"icon"}
        loading={isDeletingQuestion}
        noChildOnLoading={true}
        onClick={() => onDeleteQuestion(question.id!)}
      >
        <Icons.trash className="h-5 w-5" />
      </Button>
    </div>
  );
};

export { EditableQuestion };
