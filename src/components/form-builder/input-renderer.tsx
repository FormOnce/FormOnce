/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "../ui";
import {
  EQuestionType,
  ESelectSubType,
  type TQuestion,
} from "~/types/question.types";
import type { Control, ControllerRenderProps } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";

type TInputRenderProps = {
  question: TQuestion;
  field: ControllerRenderProps<Record<string, any>, string>;
  formControl: Control<Record<string, any>, string>;
};

export const InputRenderer = ({
  question,
  field,
  formControl,
}: // ...props
TInputRenderProps) => {
  switch (question.type) {
    case EQuestionType.Text:
      return (
        <FormItem>
          <FormLabel>{question.title}</FormLabel>
          <FormControl>
            <RenderTextInput
              type={question.subType}
              field={field}
              placeholder={question.placeholder ?? ""}
            />
          </FormControl>
          <FormDescription>{question.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );

    case EQuestionType.Select:
      return (
        <RenderSelectInput
          question={question}
          field={field}
          formControl={formControl}
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
};

type TRenderTextInputProps = {
  type: string;
  field: TInputRenderProps["field"];
  placeholder: string;
};

const RenderTextInput = ({
  type,
  field,
  placeholder,
}: TRenderTextInputProps) => {
  switch (type) {
    case "short":
      return (
        <Input
          className="mt-2"
          placeholder={placeholder}
          type="text"
          {...field}
        />
      );
    case "long":
      return <Textarea className="mt-2" placeholder={placeholder} {...field} />;
    case "email":
      return (
        <Input
          className="mt-2"
          placeholder={placeholder}
          type="email"
          {...field}
        />
      );
    case "number":
      return (
        <Input
          className="mt-2"
          placeholder={placeholder}
          type="number"
          {...field}
        />
      );
    case "url":
      return (
        <Input
          className="mt-2"
          placeholder={placeholder}
          type="url"
          {...field}
        />
      );
    case "phone":
      return (
        <Input
          className="mt-2"
          placeholder={placeholder}
          type="tel"
          pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
          {...field}
        />
      );
    case "password":
      return (
        <Input
          className="mt-2"
          placeholder={placeholder}
          type="password"
          {...field}
        />
      );
    default:
      return (
        <Input
          className="mt-2"
          placeholder="Enter your answer"
          type="text"
          {...field}
        />
      );
  }
};

type TRenderSelectInputProps = {
  question: TQuestion;
  field: TInputRenderProps["field"];
  formControl: TInputRenderProps["formControl"];
};

const RenderSelectInput = ({
  question,
  formControl,
}: TRenderSelectInputProps) => {
  type THandleCheckboxChange = {
    item: string;
    checked: CheckedState;
    field: ControllerRenderProps<Record<string, any>, string>;
    mode: ESelectSubType;
  };

  const handleCheckboxChange = ({
    item,
    checked,
    field,
    mode,
  }: THandleCheckboxChange) => {
    // set field.value empty array if it's undefined, (this happens for new questions)
    field.value = (field.value as string[]) ?? [];

    if (mode === ESelectSubType.Single) {
      return checked
        ? field.onChange([item])
        : field.onChange(
            (field?.value as string[])?.filter((value) => value !== item)
          );
    } else {
      return checked
        ? field.onChange([...(field?.value as string[]), item])
        : field.onChange(
            (field?.value as string[])?.filter((value) => value !== item)
          );
    }
  };

  switch (question.subType) {
    case ESelectSubType.Multiple:
    case ESelectSubType.Single:
      return (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">{question.title}</FormLabel>
            <FormDescription>{question.description}</FormDescription>
          </div>
          {question.options.map((item) => (
            <FormField
              key={item}
              control={formControl}
              name={question.id!}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={(field.value as string[])?.includes(item)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange({
                            item,
                            checked,
                            field,
                            mode: question.subType,
                          })
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {item}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      );
    default:
      return <></>;
  }
};
