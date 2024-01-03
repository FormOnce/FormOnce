/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React from "react";
import { ZQuestion, EQuestionType, TQuestion } from "~/types/question.types";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icons,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui";
import { TextQuestion } from "./text-question";

const questionTypes = Object.values(EQuestionType).map((type) => ({
  label: type,
  value: type,
}));

const AddNewQuestion = () => {
  const [isOpen, setIsColapsed] = React.useState(false);
  const [inputType, setInputType] = React.useState<EQuestionType>(
    EQuestionType.Text
  );

  const onInputTypeChange = (value: EQuestionType) => {
    setInputType(value);
  };

  const onAddQuestion = (values: TQuestion) => {
    console.log("Adding question: ");
    console.log({ ...values, type: inputType });
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
        <div className="flex h-9 items-center">
          <Icons.plus
            className={`mr-2 h-6 w-6 transition ${isOpen && "rotate-90"}`}
          />
          <span className="text">Add new question</span>
        </div>
        {isOpen && (
          <div className="w-36 items-center">
            <Select
              onValueChange={onInputTypeChange}
              defaultValue={EQuestionType.Text}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an input type" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map(
                  (type) =>
                    type && (
                      <SelectItem key={type.label} value={type.value}>
                        {type.label}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-6 pt-4">
        {inputType === EQuestionType.Text && (
          <TextQuestion onSubmit={onAddQuestion} />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AddNewQuestion;
