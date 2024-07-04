'use client'

import React from 'react'
import {
  EQuestionType,
  ESelectSubType,
  ETextSubType,
  type TQuestion,
} from '~/types/question.types'

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
} from '@components/ui'
import { SelectQuestionForm } from './select-question-form'
import { TextQuestionForm } from './text-question-form'

type TAddNewQuestionProps = {
  onAddQuestion: (values: TQuestion) => Promise<void>
}

const questionTypes = Object.values(EQuestionType).map((type) => ({
  label: type,
  value: type,
}))

const questionSubTypes = [
  ...Object.values(ETextSubType),
  ...Object.values(ESelectSubType),
].map((type) => ({
  label: type,
  value: type,
}))

const AddNewQuestion = (props: TAddNewQuestionProps) => {
  const [isOpen, setIsColapsed] = React.useState(false)
  const [inputType, setInputType] = React.useState<EQuestionType>(
    EQuestionType.Text,
  )

  const onInputTypeChange = (value: EQuestionType) => {
    setInputType(value)
  }

  const onAddQuestion = async (values: TQuestion) => {
    await props.onAddQuestion({ ...values, type: inputType } as TQuestion)
    setIsColapsed(false)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => setIsColapsed(open)}
      className="rounded-md border shadow-sm shadow-slate-800"
    >
      <CollapsibleTrigger
        className={`flex w-full items-center justify-between rounded-md p-4 text-start ${
          !isOpen && 'hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        <div className="flex h-9 items-center">
          <Icons.plus
            className={`mr-2 h-6 w-6 transition ${isOpen && 'rotate-90'}`}
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
                {questionSubTypes.map(
                  (type) =>
                    type && (
                      <SelectItem key={type.label} value={type.value}>
                        <div className="px-2">{type.label}</div>
                      </SelectItem>
                    ),
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-6 pt-4">
        {inputType === EQuestionType.Text && (
          <TextQuestionForm onSubmit={onAddQuestion} mode="add" />
        )}
        {inputType === EQuestionType.Select && (
          <SelectQuestionForm onSubmit={onAddQuestion} mode="add" />
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

export { AddNewQuestion }
