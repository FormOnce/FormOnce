import React from "react";
import {
  Input,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  RadioGroupItem,
  RadioGroup,
  Icons,
} from "@components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import {
  EQuestionType,
  ETextSubType,
  ZTextQuestion,
} from "~/types/question.types";

const formSchema = ZTextQuestion;

const questionSubTypes = Object.values(ETextSubType).map((type) => ({
  label: type,
  value: type,
  icon: Icons[type as keyof typeof Icons],
}));

type TTextQuestionProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

const TextQuestion = (props: TTextQuestionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      placeholder: "",
      type: EQuestionType.Text,
      subType: ETextSubType.Short,
    },
    mode: "onTouched",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This will be type-safe and validated.
    props.onSubmit(values);
    form.reset();
  }

  function onError(errors: unknown) {
    console.log(errors);
  }

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
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
                A description that will be shown to the user just like this one
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
              <FormDescription>Placeholder for this question</FormDescription>
              <FormControl>
                <Input type="text" placeholder="Hold my place" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Input type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-4 gap-4"
                >
                  {questionSubTypes.map((type) => (
                    <FormItem
                      key={type.label}
                      className="flex items-center justify-center rounded-md border border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <FormLabel className="!mt-0 flex items-center justify-center gap-2">
                        {type.icon && <type.icon className="h-4 w-4" />}
                        {type.label}
                      </FormLabel>
                      <FormControl>
                        <RadioGroupItem
                          className="sr-only"
                          value={type.value}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Question</Button>
      </form>
    </Form>
  );
};

export { TextQuestion };
