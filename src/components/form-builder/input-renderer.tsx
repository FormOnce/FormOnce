import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  // RadioGroup,
  Textarea,
} from "../ui";
import { EQuestionType, type TQuestion } from "~/types/question.types";
// import { RadioGroupItem } from "@radix-ui/react-radio-group";
import type { ControllerRenderProps } from "react-hook-form";

type TInputRenderProps = {
  question: TQuestion;
  field: ControllerRenderProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>,
    string
  >;
};

export const InputRenderer = ({
  question,
  field,
}: // ...props
TInputRenderProps) => {
  console.log("question", question);
  switch (question.type) {
    case EQuestionType.Text:
      return (
        <FormItem>
          <FormLabel>{question.title}</FormLabel>
          <FormDescription>{question.description}</FormDescription>
          <FormControl>
            <RenderTextInput
              type={question.subType}
              field={field}
              placeholder={question.placeholder ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    // case "select":
    //   switch (subType) {
    //     case "single":
    //       return (
    //         <RadioGroup
    //           aria-multiselectable
    //           className="flex flex-col space-y-1"
    //         >
    //           {
    //             props.options.map((option: string, idx) => (
    //               <FormItem key={idx} className="flex items-center space-x-3 space-y-2">
    //                 <FormControl>
    //                   <RadioGroupItem value={option} />
    //                 </FormControl>
    //                 <FormLabel className="font-normal">{option}</FormLabel>
    //               </FormItem>
    //             ))
    //           }
    //           <FormItem className="flex items-center space-x-3 space-y-2">
    //             <FormControl>
    //               <RadioGroupItem value="all" />
    //             </FormControl>
    //             <FormLabel className="font-normal">All new messages</FormLabel>
    //           </FormItem>
    //         </RadioGroup>
    //       );
    //     case "multiple":
    //       return (
    //         <RadioGroup className="flex flex-col space-y-1">
    //           <FormItem className="flex items-center space-x-3 space-y-0">
    //             <FormControl>
    //               <RadioGroupItem value="all" />
    //             </FormControl>
    //             <FormLabel className="font-normal">All new messages</FormLabel>
    //           </FormItem>
    //           <FormItem className="flex items-center space-x-3 space-y-0">
    //             <FormControl>
    //               <RadioGroupItem value="mentions" />
    //             </FormControl>
    //             <FormLabel className="font-normal">
    //               Direct messages and mentions
    //             </FormLabel>
    //           </FormItem>
    //           <FormItem className="flex items-center space-x-3 space-y-0">
    //             <FormControl>
    //               <RadioGroupItem value="none" />
    //             </FormControl>
    //             <FormLabel className="font-normal">Nothing</FormLabel>
    //           </FormItem>
    //         </RadioGroup>
    //       );
    //     default:
    //       return (
    //         <select
    //           className="mt-2"
    //           name="answer"
    //           {...props}
    //           placeholder="Select an option"
    //         >
    //           <option value="" disabled>
    //             Select an option
    //           </option>
    //           <option value="option1">Option 1</option>
    //           <option value="option2">Option 2</option>
    //           <option value="option3">Option 3</option>
    //         </select>
    //       );
    //   }

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
