import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronRight, MoveRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Button,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Form,
  FormField,
  FormItem,
} from '~/components/ui'
import {
  ELogicCondition,
  TLogic,
  TQuestion,
  TSelectQuestion,
  ZLogic,
} from '~/types/question.types'

export type LogicBuilderProps = {
  onAddLogic: (newLogic: TLogic) => void
  sourceQuestion: TQuestion & { id: string }
}

export const LogicBuilder = ({
  onAddLogic,
  sourceQuestion,
}: LogicBuilderProps) => {
  const onAddLogicHandler = (newLogic: TLogic) => {
    onAddLogic(newLogic)
  }

  const questionType = sourceQuestion.type

  return (
    <div className="p-4">
      {questionType === 'text' ? (
        <TextQuestionLogicBuilder
          question={sourceQuestion}
          onAddLogic={onAddLogicHandler}
        />
      ) : (
        <SelectQuestionLogicBuilder
          question={sourceQuestion}
          onAddLogic={onAddLogicHandler}
        />
      )}
    </div>
  )
}

type TextQuestionLogicBuilderProps = {
  question: TQuestion & {
    id: string
  }
  onAddLogic: (newLogic: TLogic) => void
}

const TextQuestionLogicBuilder = ({
  question,
  onAddLogic,
}: TextQuestionLogicBuilderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const FormSchema = ZLogic.merge(
    z.object({
      value: z.string(),
    }),
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questionId: question.id,
      condition: ELogicCondition.ALWAYS,
      value: '',
      skipTo: '',
    },
    mode: 'all',
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    onAddLogic(data)
  }

  const onError = (err: FieldErrors<z.infer<typeof FormSchema>>) => {
    console.log('err', err)
    toast.error('Something went wrong', {
      description:
        'We know this is not ideal, contact ksushant6566@gmail.com if the issue persists',
      duration: 10000,
    })
  }

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col items-start space-y-6"
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          <div className="space-y-3 p-6 w-full">
            <FormField
              control={form.control}
              name="condition"
              render={() => (
                <FormItem>
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => {
                      return (
                        <div
                          className={`flex rounded-md p-3 justify-between gap-2 items-center bg-secondary border-2 hover:border-violet-600 cursor-pointer ${
                            field.value === ELogicCondition.ALWAYS &&
                            'border-violet-600'
                          }`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>Always</span>
                          </div>
                          <Checkbox
                            className={`h-6 w-6 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-primary`}
                            checked={field.value === ELogicCondition.ALWAYS}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange(ELogicCondition.ALWAYS)
                                : field.onChange('')
                            }}
                          />
                        </div>
                      )
                    }}
                  />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 w-full">
              <div className="border border-secondary w-full" />
              <span className="border-primary">or</span>
              <div className="border border-secondary w-full" />
            </div>

            <Collapsible
              open={!isCollapsed}
              //   onOpenChange={(open) => setIsCollapsed(!open)}
              className="w-full"
            >
              <CollapsibleTrigger>
                <div className="flex items-center gap-1 relative cursor-not-allowed">
                  <span className="text">Advanced conditionals</span>
                  <span className="text-xs text-blue-400 absolute top-5 left-0">
                    (coming soon)
                  </span>
                  <ChevronRight
                    className={`h-5 w-5 mt-0.5 transition ${
                      !isCollapsed && 'rotate-90'
                    }`}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 text-center">
                <p className="text-lg text-secondary">Coming soon</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="w-full flex justify-center px-6">
            <Button
              type="submit"
              disabled={!!form.formState.errors.condition}
              size={'lg'}
              className="w-full"
            >
              Continue <MoveRight className="ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

type SelectQuestionLogicBuilderProps = {
  question: TSelectQuestion & {
    id: string
  }
  onAddLogic: (newLogic: TLogic) => void
}

const SelectQuestionLogicBuilder = ({
  question,
  onAddLogic,
}: SelectQuestionLogicBuilderProps) => {
  const FormSchema = ZLogic.merge(
    z.object({
      value: z.array(z.string()).min(1),
    }),
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questionId: question.id,
      condition: ELogicCondition.IS_ONE_OF,
      value: [],
      skipTo: '',
    },
    mode: 'all',
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data)
    onAddLogic(data)
  }

  const onError = (err: FieldErrors<z.infer<typeof FormSchema>>) => {
    if (form.getValues('value').length === 0) {
      toast.error('Please select at least one option')
    } else {
      toast.error('Something went wrong', {
        description:
          'We know this is not ideal, contact ksushant6566@gmail.com if the issue persists',
        duration: 10000,
      })
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col items-start space-y-4"
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          <div className="space-y-3 p-6 text-center w-full">
            <FormField
              control={form.control}
              name="value"
              render={() => (
                <FormItem>
                  {question.options.map((option, i) => (
                    <FormField
                      key={option}
                      control={form.control}
                      name="value"
                      render={({ field }) => {
                        return (
                          <div
                            className={`flex rounded-md p-3 justify-between gap-2 items-center bg-secondary border-2 hover:border-violet-600 cursor-pointer ${
                              field.value.includes(option) &&
                              'border-violet-600'
                            }`}
                          >
                            <div className="flex gap-2 items-center">
                              <span className="border bg-violet-600 text-sm text-primary p-0.5 px-2 rounded-md">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span>{option}</span>
                            </div>
                            <Checkbox
                              className={`h-6 w-6 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-primary`}
                              checked={field.value.includes(option)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option,
                                      ),
                                    )
                              }}
                            />
                          </div>
                        )
                      }}
                    ></FormField>
                  ))}
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex justify-center px-6">
            <Button
              type="submit"
              disabled={!!form.formState.errors.value}
              size={'lg'}
              className="w-full"
            >
              Continue <MoveRight className="ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
