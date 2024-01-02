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

const AddNewQuestion = () => {
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

  const questionTypes = Object.values(EQuestionType)
    .map((type) => ({
      label: type.split(":")[0],
      value: type,
    }))
    .filter(
      (type, index, self) =>
        self.findIndex((t) => t.label === type.label) === index
    );

  return (
    <Collapsible className="rounded-md border shadow-sm shadow-slate-800">
      <CollapsibleTrigger className="flex w-full items-center rounded-md p-4 text-start hover:bg-accent hover:text-accent-foreground">
        <Icons.plus className="mr-2 h-4 w-4" />
        <div className="text">Add new question</div>
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
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input type</FormLabel>
                  <FormDescription>
                    What type of input should this question be?
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an input type" />
                      </SelectTrigger>
                    </FormControl>
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
