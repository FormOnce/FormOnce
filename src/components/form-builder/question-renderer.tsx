import React from "react";
import { Input, Textarea } from "../ui";
import type { TQuestion } from "~/types/question.types";

type TQuestionRenderer = {
  question: TQuestion | undefined;
  visible?: boolean;
};

function QuestionRenderer({ question, visible = true }: TQuestionRenderer) {
  if (!question) return null;

  return (
    <div className="overflow-hidden">
      <div
        className={`mb-4 min-h-[8rem] transition-all duration-150 ease-out ${
          visible ? "not-sr-only translate-x-0" : "sr-only -translate-x-full"
        }`}
      >
        <p className="text font-semibold">{question.title}</p>
        <p className=" text-sm text-gray-500">{question.description}</p>
        <div className="mt-2">
          <InputRenderer
            type={question.type}
            subType={question.subType}
            placeholder={question.placeholder}
          />
        </div>
      </div>
    </div>
  );
}

const InputRenderer = ({
  type,
  subType,
  placeholder,
}: Pick<TQuestion, "type" | "subType" | "placeholder">) => {
  switch (type) {
    case "text":
      switch (subType) {
        case "short":
          return (
            <Input
              className="mt-2"
              placeholder={placeholder}
              type="email"
              name="answer"
            />
          );
        case "long":
          return (
            <Textarea
              className="mt-2"
              placeholder={placeholder}
              name="answer"
            />
          );
        case "email":
          return (
            <Input
              className="mt-2"
              placeholder={placeholder}
              type="email"
              name="answer"
            />
          );
        case "number":
          return (
            <Input
              className="mt-2"
              placeholder={placeholder}
              type="number"
              name="answer"
            />
          );
        case "url":
          return (
            <Input
              className="mt-2"
              placeholder={placeholder}
              type="url"
              name="answer"
            />
          );
        case "phone":
          return (
            <Input
              className="mt-2"
              placeholder={placeholder}
              type="tel"
              pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              name="answer"
            />
          );
        case "password":
          return (
            <Input
              className="mt-2"
              placeholder="Enter your password"
              type="password"
              name="answer"
            />
          );
        default:
          return (
            <Input
              className="mt-2"
              placeholder="Enter your answer"
              type="text"
              name="answer"
            />
          );
      }

    default:
      return (
        <Input
          className="mt-2"
          placeholder="Enter your answer"
          type="text"
          name="answer"
        />
      );
  }
};

export { QuestionRenderer };
