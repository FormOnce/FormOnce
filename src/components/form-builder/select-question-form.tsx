import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Icons,
  Input,
  Switch,
} from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { type z } from 'zod'
import {
  EQuestionType,
  ESelectSubType,
  type TSelectQuestion,
  ZSelectQuestion,
} from '~/types/question.types'

const formSchema = ZSelectQuestion

type TSelectQuestionForm =
  | {
      mode: 'add'
      onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
    }
  | (TSelectQuestion & {
      mode: 'edit'
      onEdit: (values: z.infer<typeof formSchema>) => Promise<void>
    })

const SelectQuestionForm = (props: TSelectQuestionForm) => {
  const [isLoading, setIsloading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      props.mode === 'edit'
        ? {
            title: props.title,
            description: props.description,
            placeholder: props.placeholder,
            type: EQuestionType.Select,
            subType: props.subType,
            options: props.options,
          }
        : {
            title: '',
            description: '',
            placeholder: '',
            type: EQuestionType.Select,
            subType: ESelectSubType.Single,
            options: ['Option 1', 'Option 2'],
          },
    mode: 'onTouched',
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options' as unknown as never,
    rules: {
      minLength: {
        value: 2,
        message: 'You need to have at least 2 options',
      },
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsloading(true)
    // This will be type-safe and validated.
    if (props.mode === 'add') await props.onSubmit(values)
    else await props.onEdit(values)
    setIsloading(false)
    form.reset()
  }

  function onError(errors: unknown) {
    console.log(errors)
  }

  return (
    <Form {...form}>
      <form
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
              <div className="flex gap-3">
                <FormLabel>Allow multiple</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value === ESelectSubType.Multiple}
                    onCheckedChange={(b) =>
                      b
                        ? field.onChange(ESelectSubType.Multiple)
                        : field.onChange(ESelectSubType.Single)
                    }
                  />
                </FormControl>
              </div>
              <FormDescription>
                Allow the user to select multiple options
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Options</h3>
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`options.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter option"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      variant={'ghost'}
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
                    >
                      <Icons.trash className="h-5 w-5" />
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => append('Option')}
            className="text-muted-foreground hover:bg-primary/90 hover:text-primary-foreground"
          >
            <Icons.plus className="h-5 w-5" />
          </Button>
        </div>
        {props.mode === 'add' ? (
          <Button type="submit">Add Question</Button>
        ) : (
          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            loading={isLoading}
          >
            Edit Question
          </Button>
        )}
      </form>
    </Form>
  )
}

export { SelectQuestionForm }
