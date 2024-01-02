/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React from "react";
import { ZQuestion, EQuestionType } from "~/types/question.types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icons,
  Input,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui";

const formSchema = ZQuestion;

const questionTypes = Object.values(EQuestionType)
  .map((type) => ({
    label: type.split(":")[0],
    value: type,
  }))
  .filter(
    (type, index, self) =>
      self.findIndex((t) => t.label === type.label) === index
  );

const AddNewQuestion = () => {
  const [isOpen, setIsColapsed] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      placeholder: "",
      type: EQuestionType.TextShort,
    },
    mode: "onTouched",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This will be type-safe and validated.
    console.log(values);
    form.reset();
  }

  const onInputTypeChange = (value: EQuestionType) => {
    form.setValue("type", value);
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
              defaultValue={EQuestionType.TextShort}
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormDescription>
                    Title that will be shown to the user.
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter question title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormDescription>
                    A description that will be shown to the user just like this
                    one
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter question description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
                  <FormDescription>
                    Placeholder for this question
                  </FormDescription>
                  <FormControl>
                    <Input type="text" placeholder="Hold my place" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Question</Button>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AddNewQuestion;
