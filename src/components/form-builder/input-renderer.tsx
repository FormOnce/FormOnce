import React from "react";
import { Input, Textarea } from "../ui";
import type { TQuestion } from "~/types/question.types";

export const InputRenderer = ({
  type,
  subType,
  placeholder,
  ...props
}: Pick<TQuestion, "type" | "subType" | "placeholder">) => {
  switch (type) {
    case "text":
      switch (subType) {
        case "short":
          return (
            <Input
              className="mt-2"
              placeholder={placeholder}
              type="text"
              name="answer"
              {...props}
            />
          );
        case "long":
          return (
            <Textarea
              className="mt-2"
              placeholder={placeholder}
              name="answer"
              {...props}
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
